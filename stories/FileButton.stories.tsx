import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { FileButton, ThemeProvider } from '../src';

function FileButtonExample() {
  const [selection, setSelection] = useState('No file selected');
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.75rem' }}>
      <FileButton
        accept="application/json"
        onChange={(event) => setSelection(event.target.files?.[0]?.name ?? 'No file selected')}
      >
        Choose JSON file
      </FileButton>
      <span aria-live="polite">{selection}</span>
      <FileButton variant="outline" disabled>
        Upload unavailable
      </FileButton>
    </div>
  );
}

const meta = {
  title: 'Components/File Button',
  component: FileButton,
  decorators: [
    (Story) => (
      <ThemeProvider>
        <div style={{ width: 'min(32rem, 100%)', padding: '2rem' }}>
          <Story />
        </div>
      </ThemeProvider>
    ),
  ],
} satisfies Meta<typeof FileButton>;

export default meta;
type Story = StoryObj<typeof meta>;
export const States: Story = { render: () => <FileButtonExample /> };
