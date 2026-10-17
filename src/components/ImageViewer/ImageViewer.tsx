import { useEffect, useRef, useState, type PointerEvent } from 'react';
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  FlipHorizontalIcon,
  FlipVerticalIcon,
  RotateCcwIcon,
  RotateCwIcon,
  ZoomInIcon,
  ZoomOutIcon,
  RefreshCwIcon,
} from 'lucide-react';
import { Modal } from '../Modal';
import { IconButton } from '../Button';
import { Alert } from '../Alert';
import { Spinner } from '../Spinner';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { useLocale } from '../../locale/LocaleProvider';

export interface ImageViewerItem {
  src: string;
  alt: string;
}
export interface ImageViewerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  images: readonly ImageViewerItem[];
  index: number;
  onIndexChange: (index: number) => void;
  title?: string;
}
const clampZoom = (value: number) => Math.min(10, Math.max(0.1, value));

export function ImageViewer({
  open,
  onOpenChange,
  images,
  index,
  onIndexChange,
  title,
}: ImageViewerProps) {
  const { messages } = useLocale();
  const mobile = useMediaQuery('(max-width: 767px)');
  const active = Math.min(Math.max(0, index), Math.max(0, images.length - 1));
  const image = images[active];
  return (
    <Modal
      open={open && Boolean(image)}
      onOpenChange={onOpenChange}
      title={title ?? messages.imagePreview}
      fullScreenOnMobile
      className="ec-image-viewer"
      style={{ width: mobile ? '100%' : 'min(96vw, 90rem)', maxWidth: mobile ? '100%' : '96vw' }}
    >
      {image && (
        <ImageCanvas
          key={`${active}:${image.src}:${open}`}
          image={image}
          index={active}
          count={images.length}
          onIndexChange={onIndexChange}
        />
      )}
    </Modal>
  );
}

function ImageCanvas({
  image,
  index,
  count,
  onIndexChange,
}: {
  image: ImageViewerItem;
  index: number;
  count: number;
  onIndexChange: (index: number) => void;
}) {
  const { messages } = useLocale();
  const [zoom, setZoom] = useState(1),
    [rotation, setRotation] = useState(0),
    [flipX, setFlipX] = useState(1),
    [flipY, setFlipY] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [loading, setLoading] = useState(true),
    [error, setError] = useState(false),
    [attempt, setAttempt] = useState(0);
  const viewport = useRef<HTMLDivElement>(null);
  const points = useRef(new Map<number, { x: number; y: number }>());
  const gesture = useRef({ x: 0, y: 0, offsetX: 0, offsetY: 0, distance: 0, zoom: 1 });
  const previous = () => {
    if (index > 0) onIndexChange(index - 1);
  };
  const next = () => {
    if (index < count - 1) onIndexChange(index + 1);
  };
  const reset = () => {
    setZoom(1);
    setRotation(0);
    setFlipX(1);
    setFlipY(1);
    setOffset({ x: 0, y: 0 });
  };
  useEffect(() => {
    const element = viewport.current;
    const wheel = (event: WheelEvent) => {
      event.preventDefault();
      setZoom((value) => clampZoom(value * (event.deltaY < 0 ? 1.2 : 1 / 1.2)));
    };
    element?.addEventListener('wheel', wheel, { passive: false });
    return () => element?.removeEventListener('wheel', wheel);
  }, []);
  const down = (event: PointerEvent<HTMLDivElement>) => {
    if (event.button !== 0) return;
    event.currentTarget.setPointerCapture?.(event.pointerId);
    points.current.set(event.pointerId, { x: event.clientX, y: event.clientY });
    const pair = [...points.current.values()];
    gesture.current = {
      x: event.clientX,
      y: event.clientY,
      offsetX: offset.x,
      offsetY: offset.y,
      distance: pair.length === 2 ? Math.hypot(pair[0].x - pair[1].x, pair[0].y - pair[1].y) : 0,
      zoom,
    };
  };
  const move = (event: PointerEvent<HTMLDivElement>) => {
    if (!points.current.has(event.pointerId)) return;
    points.current.set(event.pointerId, { x: event.clientX, y: event.clientY });
    const pair = [...points.current.values()];
    if (pair.length === 2 && gesture.current.distance > 0) {
      setZoom(
        clampZoom(
          (gesture.current.zoom * Math.hypot(pair[0].x - pair[1].x, pair[0].y - pair[1].y)) /
            gesture.current.distance,
        ),
      );
      return;
    }
    if (zoom > 1)
      setOffset({
        x: gesture.current.offsetX + event.clientX - gesture.current.x,
        y: gesture.current.offsetY + event.clientY - gesture.current.y,
      });
  };
  const up = (event: PointerEvent<HTMLDivElement>) => {
    if (!points.current.has(event.pointerId)) return;
    if (
      event.type === 'pointerup' &&
      points.current.size === 1 &&
      gesture.current.distance === 0 &&
      zoom === 1 &&
      Math.abs(event.clientY - gesture.current.y) < 50
    ) {
      const delta = event.clientX - gesture.current.x;
      if (delta > 50) previous();
      else if (delta < -50) next();
    }
    points.current.delete(event.pointerId);
    if (event.currentTarget.hasPointerCapture?.(event.pointerId))
      event.currentTarget.releasePointerCapture(event.pointerId);
  };
  return (
    <div
      className="ec-image-viewer__content"
      style={{ display: 'flex', flexDirection: 'column', gap: 'var(--ec-space-3)', minWidth: 0 }}
      onKeyDown={(event) => {
        if (event.altKey || event.ctrlKey || event.metaKey) return;
        if (event.key === 'ArrowLeft') {
          event.preventDefault();
          previous();
        }
        if (event.key === 'ArrowRight') {
          event.preventDefault();
          next();
        }
      }}
    >
      <div
        className="ec-image-viewer__toolbar"
        role="toolbar"
        aria-label={messages.imageControls}
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: 'var(--ec-space-1)',
        }}
      >
        <IconButton
          label={messages.previousImage}
          icon={<ArrowLeftIcon />}
          disabled={index === 0}
          onClick={previous}
        />
        <span
          aria-live="polite"
          className="ec-image-viewer__position"
          style={{ fontVariantNumeric: 'tabular-nums', minWidth: '3em', textAlign: 'center' }}
        >
          {index + 1} / {count}
        </span>
        <IconButton
          label={messages.nextImage}
          icon={<ArrowRightIcon />}
          disabled={index === count - 1}
          onClick={next}
        />
        <IconButton
          label={messages.zoomOut}
          icon={<ZoomOutIcon />}
          disabled={zoom <= 0.1}
          onClick={() => setZoom((value) => clampZoom(value / 1.2))}
        />
        <output aria-label={messages.zoomLevel}>{Math.round(zoom * 100)}%</output>
        <IconButton
          label={messages.zoomIn}
          icon={<ZoomInIcon />}
          disabled={zoom >= 10}
          onClick={() => setZoom((value) => clampZoom(value * 1.2))}
        />
        <IconButton
          label={messages.rotateLeft}
          icon={<RotateCcwIcon />}
          onClick={() => setRotation((value) => value - 90)}
        />
        <IconButton
          label={messages.rotateRight}
          icon={<RotateCwIcon />}
          onClick={() => setRotation((value) => value + 90)}
        />
        <IconButton
          label={messages.flipHorizontal}
          icon={<FlipHorizontalIcon />}
          onClick={() => setFlipX((value) => -value)}
        />
        <IconButton
          label={messages.flipVertical}
          icon={<FlipVerticalIcon />}
          onClick={() => setFlipY((value) => -value)}
        />
        <IconButton label={messages.resetView} icon={<RefreshCwIcon />} onClick={reset} />
      </div>
      <div
        ref={viewport}
        className="ec-image-viewer__viewport"
        style={{
          position: 'relative',
          display: 'grid',
          placeItems: 'center',
          height: 'min(55dvh,48rem)',
          overflow: 'hidden',
          background: 'var(--ec-color-surface-muted)',
          borderRadius: 'var(--ec-radius-md)',
          touchAction: 'none',
          userSelect: 'none',
        }}
        aria-label={image.alt}
        onPointerDown={down}
        onPointerMove={move}
        onPointerUp={up}
        onPointerCancel={(event) => {
          points.current.delete(event.pointerId);
        }}
        onLostPointerCapture={(event) => {
          points.current.delete(event.pointerId);
        }}
        onDoubleClick={() => {
          setZoom((value) => (value === 1 ? 2 : 1));
          setOffset({ x: 0, y: 0 });
        }}
      >
        {loading && !error ? (
          <div style={{ position: 'absolute' }}>
            <Spinner label={messages.loading} />
          </div>
        ) : null}
        {error ? (
          <Alert
            tone="danger"
            title={messages.loadFailed}
            action={
              <IconButton
                label={messages.retry}
                icon={<RefreshCwIcon />}
                onClick={() => {
                  setError(false);
                  setLoading(true);
                  setAttempt((value) => value + 1);
                }}
              />
            }
          />
        ) : (
          <img
            key={attempt}
            src={image.src}
            alt={image.alt}
            draggable={false}
            onLoad={() => setLoading(false)}
            onError={() => {
              setError(true);
              setLoading(false);
            }}
            style={{
              gridArea: '1 / 1',
              maxWidth: '100%',
              maxHeight: '100%',
              minWidth: 0,
              objectFit: 'contain',
              visibility: loading ? 'hidden' : undefined,
              transform: `translate(${offset.x}px, ${offset.y}px) rotate(${rotation}deg) scale(${zoom * flipX}, ${zoom * flipY})`,
            }}
          />
        )}
      </div>
    </div>
  );
}
