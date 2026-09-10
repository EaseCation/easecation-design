import { createRef } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FileButton } from '../src';

it('opens a native file picker and forwards selected files', async () => {
  const user = userEvent.setup();
  const ref = createRef<HTMLInputElement>();
  const onChange = vi.fn();
  const { container } = render(
    <FileButton ref={ref} accept="application/json" onChange={onChange}>
      Import file
    </FileButton>,
  );
  const input = container.querySelector('input[type="file"]') as HTMLInputElement;
  const click = vi.spyOn(input, 'click');

  await user.click(screen.getByRole('button', { name: 'Import file' }));
  expect(click).toHaveBeenCalledOnce();
  expect(ref.current).toBe(input);
  expect(input).toHaveAttribute('accept', 'application/json');

  const file = new File(['{}'], 'settings.json', { type: 'application/json' });
  fireEvent.change(input, { target: { files: [file] } });
  expect(onChange).toHaveBeenCalledOnce();
});

it('keeps both the trigger and file input disabled', () => {
  const { container } = render(<FileButton disabled>Upload</FileButton>);

  expect(screen.getByRole('button', { name: 'Upload' })).toBeDisabled();
  expect(container.querySelector('input[type="file"]')).toBeDisabled();
});
