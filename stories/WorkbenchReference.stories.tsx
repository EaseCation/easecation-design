import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  Button,
  DetailWorkbench,
  FormWorkbench,
  InlineQueryError,
  Input,
  SectionCard,
  ThemeProvider,
} from '../src';
function Frame({ children, maxWidth = '64rem' }: { children: React.ReactNode; maxWidth?: string }) {
  return (
    <ThemeProvider>
      <main
        style={{
          minHeight: '100svh',
          background: 'var(--background)',
          padding: 'clamp(1rem,3vw,2rem)',
          color: 'var(--foreground)',
        }}
      >
        <div style={{ maxWidth, margin: '0 auto' }}>{children}</div>
      </main>
    </ThemeProvider>
  );
}
const meta = {
  title: 'Migration/Workbench Reference Harness',
  component: DetailWorkbench,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof DetailWorkbench>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Detail: Story = {
  args: {},
  render: () => (
    <Frame>
      <DetailWorkbench
        sidebar={
          <SectionCard title="Metadata">
            <p>Owner: Operations</p>
          </SectionCard>
        }
      >
        <SectionCard title="Record details">
          <p>Domain-neutral record content.</p>
        </SectionCard>
        <SectionCard title="History">
          <p>Latest activity is available.</p>
        </SectionCard>
      </DetailWorkbench>
    </Frame>
  ),
};
export const Form: Story = {
  args: {},
  render: () => (
    <Frame>
      <FormWorkbench
        aside={
          <SectionCard title="Guidance">
            <p>Complete the required fields.</p>
          </SectionCard>
        }
        footer={
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '.5rem' }}>
            <Button variant="outline">Cancel</Button>
            <Button>Save changes</Button>
          </div>
        }
      >
        <SectionCard title="General information">
          <div style={{ display: 'grid', gap: '.75rem' }}>
            <Input defaultValue="Quarterly report" />
            <Input defaultValue="Operations" />
          </div>
        </SectionCard>
      </FormWorkbench>
    </Frame>
  ),
};
export const Error: Story = {
  args: {},
  render: () => (
    <Frame maxWidth="48rem">
      <InlineQueryError
        title="Unable to load records"
        description="Check the connection and try again."
        onRetry={() => {}}
      />
    </Frame>
  ),
};
