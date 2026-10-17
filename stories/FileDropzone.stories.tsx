import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { FileDropzone } from '../src';
const meta = {
  title: 'Components/Form Controls/FileDropzone',
  component: FileDropzone,
} satisfies Meta<typeof FileDropzone>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Selection: Story = {
  args: {
    onFilesSelected: () => {},
    multiple: true,
    description: 'Choose multiple files or drop them here.',
  },
  render: function Preview(args) {
    const [names, setNames] = useState<string[]>([]);
    return (
      <>
        <FileDropzone
          {...args}
          onFilesSelected={(files) => setNames(files.map((file) => file.name))}
        />
        <p aria-live="polite">{names.join(', ')}</p>
      </>
    );
  },
};
export const Disabled: Story = {
  args: {
    onFilesSelected: () => {},
    disabled: true,
    description: 'File selection is unavailable.',
  },
};
