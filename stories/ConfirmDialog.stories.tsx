import type { Meta, StoryObj } from '@storybook/react-vite';
import { useRef, useState } from 'react';
import { Button } from '../src/components/Button';
import { ConfirmDialog } from '../src/components/ConfirmDialog';
import { useStoryTranslations } from '../.storybook/story-locale';

function Demo({ failFirst = false }: { failFirst?: boolean }) {
  const [open, setOpen] = useState(false);
  const attempts = useRef(0);
  const copy = useStoryTranslations({
    en: {
      open: 'Archive item',
      title: 'Archive this item?',
      description: 'You can restore it from the archive later.',
      confirm: 'Archive',
      cancel: 'Cancel',
      error: 'The item could not be archived. Please retry.',
    },
    'zh-CN': {
      open: '归档项目',
      title: '归档此项目？',
      description: '之后可以从归档中恢复。',
      confirm: '归档',
      cancel: '取消',
      error: '归档失败，请重试。',
    },
  });
  return (
    <>
      <Button
        variant="outline"
        onClick={() => {
          attempts.current = 0;
          setOpen(true);
        }}
      >
        {copy.open}
      </Button>
      <ConfirmDialog
        open={open}
        onOpenChange={setOpen}
        title={copy.title}
        description={copy.description}
        confirmLabel={copy.confirm}
        cancelLabel={copy.cancel}
        errorMessage={copy.error}
        onConfirm={async () => {
          await new Promise((resolve) => setTimeout(resolve, 1200));
          attempts.current += 1;
          if (failFirst && attempts.current === 1) throw new Error('Fixture failure');
        }}
      />
    </>
  );
}

const meta = {
  title: 'Components/ConfirmDialog',
  component: ConfirmDialog,
  args: {
    open: false,
    title: 'Confirm action',
    onOpenChange: () => undefined,
    onConfirm: () => undefined,
  },
  parameters: { layout: 'centered' },
} satisfies Meta<typeof ConfirmDialog>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Pending: Story = { render: () => <Demo /> };
export const RetryAfterFailure: Story = { render: () => <Demo failFirst /> };
