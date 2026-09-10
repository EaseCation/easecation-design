import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '../src/components/Button';
import { Alert } from '../src/components/Alert';
import { ThemeProvider } from '../src/theme/ThemeProvider';

const meta = {
  title: 'Components/Alert',
  component: Alert,
  decorators: [
    (Story) => (
      <ThemeProvider>
        <div style={{ display: 'grid', gap: '0.75rem', maxWidth: '44rem', padding: '2rem' }}>
          <Story />
        </div>
      </ThemeProvider>
    ),
  ],
} satisfies Meta<typeof Alert>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Tones: Story = {
  render: () => (
    <>
      <Alert tone="neutral" title="Draft saved">
        Only workspace members can view this draft.
      </Alert>
      <Alert tone="info" title="Update available">
        Refresh when you are ready.
      </Alert>
      <Alert tone="success" title="Published">
        The latest version is now available.
      </Alert>
      <Alert tone="warning" title="Review required">
        Two settings need attention.
      </Alert>
      <Alert tone="danger" title="Upload failed">
        Check the file and try again.
      </Alert>
    </>
  ),
};

export const ResponsiveWithAction: Story = {
  render: () => (
    <Alert
      tone="warning"
      title="Review required"
      action={<Button variant="outline">Review settings</Button>}
      onDismiss={() => {}}
      dismissLabel="Dismiss notice"
    >
      Two settings need attention before this workspace can be published.
    </Alert>
  ),
};
