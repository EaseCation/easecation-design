import { fireEvent, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { renderToString } from 'react-dom/server';
import { FileDropzone, ImageViewer, Button, LocaleProvider } from '../src';

it('acquires files through the native input, resets for re-selection, and blocks disabled drops', async () => {
  const selected = vi.fn(),
    user = userEvent.setup();
  const { container, rerender } = render(
    <FileDropzone onFilesSelected={selected} multiple accept="image/*" label="Photos" />,
  );
  const files = [
    new File(['a'], 'a.png', { type: 'image/png' }),
    new File(['b'], 'b.png', { type: 'image/png' }),
  ];
  const input = container.querySelector('input')!;
  await user.upload(input, files);
  expect(selected).toHaveBeenLastCalledWith(files);
  expect(input.value).toBe('');
  await user.upload(input, files);
  expect(selected).toHaveBeenCalledTimes(2);
  const target = screen.getByRole('region', { name: 'Photos' });
  fireEvent.dragEnter(target, { dataTransfer: { types: ['Files'] } });
  expect(target).toHaveAttribute('data-dragging');
  fireEvent.dragEnter(screen.getByRole('button', { name: 'Photos' }), {
    dataTransfer: { types: ['Files'] },
  });
  fireEvent.dragLeave(screen.getByRole('button', { name: 'Photos' }), {
    dataTransfer: { types: ['Files'] },
  });
  expect(target).toHaveAttribute('data-dragging');
  fireEvent.drop(target, { dataTransfer: { types: ['Files'], files } });
  expect(selected).toHaveBeenLastCalledWith(files);
  expect(target).not.toHaveAttribute('data-dragging');
  rerender(<FileDropzone onFilesSelected={selected} disabled label="Photos" />);
  fireEvent.drop(target, { dataTransfer: { types: ['Files'], files } });
  expect(selected).toHaveBeenCalledTimes(3);
  expect(screen.getByRole('button', { name: 'Photos' })).toBeDisabled();
  rerender(<FileDropzone onFilesSelected={selected} label="Photos" />);
  fireEvent.drop(target, { dataTransfer: { types: ['Files'], files } });
  expect(selected).toHaveBeenLastCalledWith([files[0]]);
  expect(renderToString(<FileDropzone onFilesSelected={() => {}} />)).toContain('type="file"');
});

function Gallery() {
  const [open, setOpen] = useState(false),
    [index, setIndex] = useState(0);
  return (
    <>
      <Button onClick={() => setOpen(true)}>Gallery</Button>
      <ImageViewer
        open={open}
        onOpenChange={setOpen}
        index={index}
        onIndexChange={setIndex}
        images={[
          { src: '/one.png', alt: 'First photo' },
          { src: '/two.png', alt: 'Second photo' },
        ]}
      />
    </>
  );
}
it('navigates with keys and resets transformations, reports failure/retries, and returns focus after close', async () => {
  const user = userEvent.setup();
  render(
    <LocaleProvider locale="en">
      <Gallery />
    </LocaleProvider>,
  );
  const trigger = screen.getByRole('button', { name: 'Gallery' });
  await user.click(trigger);
  const dialog = screen.getByRole('dialog', { name: 'Image preview' });
  const image = within(dialog).getByAltText('First photo');
  fireEvent.load(image);
  expect(within(dialog).getByRole('button', { name: 'Previous image' })).toBeDisabled();
  await user.click(within(dialog).getByRole('button', { name: 'Zoom in' }));
  expect(within(dialog).getByLabelText('Zoom level')).toHaveTextContent('120%');
  await user.click(within(dialog).getByRole('button', { name: 'Rotate right' }));
  expect(image).toHaveStyle({ transform: 'translate(0px, 0px) rotate(90deg) scale(1.2, 1.2)' });
  await user.click(within(dialog).getByRole('button', { name: 'Flip horizontally' }));
  expect(image.style.transform).toContain('scale(-1.2, 1.2)');
  await user.click(within(dialog).getByRole('button', { name: 'Reset view' }));
  expect(image.style.transform).toContain('rotate(0deg) scale(1, 1)');
  fireEvent.wheel(image, { deltaY: -10 });
  expect(within(dialog).getByLabelText('Zoom level')).toHaveTextContent('120%');
  await user.keyboard('{ArrowRight}');
  const second = within(dialog).getByAltText('Second photo');
  expect(second.style.transform).toContain('scale(1, 1)');
  expect(within(dialog).getByRole('button', { name: 'Next image' })).toBeDisabled();
  fireEvent.error(second);
  expect(within(dialog).getByRole('alert')).toHaveTextContent('Unable to load');
  await user.click(within(dialog).getByRole('button', { name: 'Retry' }));
  expect(within(dialog).getByAltText('Second photo')).toBeInTheDocument();
  await user.keyboard('{Escape}');
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  expect(trigger).toHaveFocus();
  await user.click(trigger);
  expect(screen.getByLabelText('Zoom level')).toHaveTextContent('100%');
  expect(
    renderToString(
      <ImageViewer
        open={false}
        onOpenChange={() => {}}
        index={0}
        onIndexChange={() => {}}
        images={[]}
      />,
    ),
  ).toBe('');
});
