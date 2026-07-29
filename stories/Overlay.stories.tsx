import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button, Drawer, Flex, Modal, ThemeProvider, ToastProvider, useToast } from '../src';
import { useStoryTranslations } from '../.storybook/story-locale';

const translations = {
  en: {
    openModal: 'Open modal',
    openDrawer: 'Open drawer',
    showToast: 'Show toast',
    synced: 'Sync complete',
    saved: 'All content has been saved safely.',
    publish: 'Publish changes',
    publishDescription: 'This action updates the current workspace.',
    cancel: 'Cancel',
    confirm: 'Confirm publish',
    confirmDescription: 'Please confirm that the changes have passed review.',
    filters: 'Filter options',
    filterContent: 'Place a domain-neutral filter form here.',
  },
  'zh-CN': {
    openModal: '打开对话框',
    openDrawer: '打开抽屉',
    showToast: '显示提示',
    synced: '同步完成',
    saved: '所有内容已安全保存。',
    publish: '发布变更',
    publishDescription: '此操作会更新当前工作区。',
    cancel: '取消',
    confirm: '确认发布',
    confirmDescription: '请确认变更内容已经通过审核。',
    filters: '筛选条件',
    filterContent: '这里可以放置领域中立的筛选表单。',
  },
} as const;

function Demo() {
  const [modal, setModal] = useState(false);
  const [drawer, setDrawer] = useState(false);
  const toast = useToast();
  const copy = useStoryTranslations(translations);
  return (
    <Flex wrap>
      <Button onClick={() => setModal(true)}>{copy.openModal}</Button>
      <Button variant="secondary" onClick={() => setDrawer(true)}>
        {copy.openDrawer}
      </Button>
      <Button
        variant="outline"
        onClick={() => toast.show({ title: copy.synced, description: copy.saved, tone: 'success' })}
      >
        {copy.showToast}
      </Button>
      <Modal
        open={modal}
        onOpenChange={setModal}
        title={copy.publish}
        description={copy.publishDescription}
        footer={
          <>
            <Button variant="ghost" onClick={() => setModal(false)}>
              {copy.cancel}
            </Button>
            <Button>{copy.confirm}</Button>
          </>
        }
      >
        {copy.confirmDescription}
      </Modal>
      <Drawer open={drawer} onOpenChange={setDrawer} title={copy.filters} placement="right">
        {copy.filterContent}
      </Drawer>
    </Flex>
  );
}
const meta = {
  title: 'Components/Modal Drawer and Toast',
  component: Modal,
  decorators: [
    (Story) => (
      <ThemeProvider>
        <ToastProvider>
          <div style={{ padding: '2rem' }}>
            <Story />
          </div>
        </ToastProvider>
      </ThemeProvider>
    ),
  ],
} satisfies Meta<typeof Modal>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Interactive: Story = {
  args: { open: false, onOpenChange: () => {}, children: null },
  render: () => <Demo />,
};
