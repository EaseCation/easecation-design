import { useRef, useState, type DragEvent, type ReactNode } from 'react';
import { UploadIcon } from 'lucide-react';
import { FileButton } from '../FileButton';
import { useLocale } from '../../locale/LocaleProvider';

export interface FileDropzoneProps {
  onFilesSelected: (files: File[]) => void;
  accept?: string;
  multiple?: boolean;
  disabled?: boolean;
  label?: string;
  description?: ReactNode;
  className?: string;
}

/** File acquisition only. Validation, transfer and persistence belong to the caller. */
export function FileDropzone({
  onFilesSelected,
  accept,
  multiple = false,
  disabled = false,
  label,
  description,
  className,
}: FileDropzoneProps) {
  const { messages } = useLocale();
  const depth = useRef(0);
  const [dragging, setDragging] = useState(false);
  const hasFiles = (event: DragEvent) => Array.from(event.dataTransfer.types).includes('Files');
  const select = (files: File[]) => {
    if (!disabled && files.length) onFilesSelected(multiple ? files : files.slice(0, 1));
  };
  return (
    <section
      className={['ec-file-dropzone', className].filter(Boolean).join(' ')}
      aria-label={label ?? messages.chooseOrDropFiles}
      aria-disabled={disabled || undefined}
      style={{
        display: 'grid',
        justifyItems: 'center',
        gap: 'var(--ec-space-3)',
        padding: 'var(--ec-space-4)',
        border: `1px dashed var(${dragging && !disabled ? '--ec-color-focus' : '--ec-color-border'})`,
        borderRadius: 'var(--ec-radius-lg)',
        background: `var(${dragging && !disabled ? '--ec-color-accent' : '--ec-color-surface'})`,
        textAlign: 'center',
        minWidth: 0,
      }}
      data-dragging={(dragging && !disabled) || undefined}
      onDragEnter={(event) => {
        if (!hasFiles(event)) return;
        event.preventDefault();
        depth.current++;
        if (!disabled) setDragging(true);
      }}
      onDragOver={(event) => {
        if (!hasFiles(event)) return;
        event.preventDefault();
        event.dataTransfer.dropEffect = disabled ? 'none' : 'copy';
      }}
      onDragLeave={(event) => {
        if (!hasFiles(event)) return;
        event.preventDefault();
        depth.current = Math.max(0, depth.current - 1);
        if (!depth.current) setDragging(false);
      }}
      onDrop={(event) => {
        if (!hasFiles(event)) return;
        event.preventDefault();
        depth.current = 0;
        setDragging(false);
        select(Array.from(event.dataTransfer.files));
      }}
    >
      <FileButton
        variant="outline"
        accept={accept}
        multiple={multiple}
        disabled={disabled}
        leadingIcon={<UploadIcon />}
        onChange={(event) => {
          const files = Array.from(event.currentTarget.files || []);
          event.currentTarget.value = '';
          select(files);
        }}
      >
        {label ?? messages.chooseOrDropFiles}
      </FileButton>
      {description ? (
        <div
          className="ec-file-dropzone__description"
          style={{
            color: 'var(--ec-color-text-muted)',
            fontSize: 'var(--ec-font-size-sm)',
            overflowWrap: 'anywhere',
          }}
        >
          {description}
        </div>
      ) : null}
    </section>
  );
}
