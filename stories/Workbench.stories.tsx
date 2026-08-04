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
import { useStoryTranslations } from '../.storybook/story-locale';

const translations = {
  en: {
    metadata: 'Metadata',
    owner: 'Owner: Operations',
    details: 'Record details',
    recordContent: 'Domain-neutral record content.',
    history: 'History',
    latestActivity: 'Latest activity is available.',
    guidance: 'Guidance',
    guidanceText: 'Complete the required fields.',
    cancel: 'Cancel',
    save: 'Save changes',
    general: 'General information',
    report: 'Quarterly report',
    operations: 'Operations',
    error: 'Unable to load records',
    errorDescription: 'Check the connection and try again.',
  },
  'zh-CN': {
    metadata: '元数据',
    owner: '负责人：运营团队',
    details: '记录详情',
    recordContent: '领域中立的记录内容。',
    history: '历史记录',
    latestActivity: '已有最新活动记录。',
    guidance: '填写指引',
    guidanceText: '请完成所有必填字段。',
    cancel: '取消',
    save: '保存变更',
    general: '基本信息',
    report: '季度报告',
    operations: '运营管理',
    error: '无法加载记录',
    errorDescription: '检查网络连接后重试。',
  },
} as const;

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
function DetailExample() {
  const copy = useStoryTranslations(translations);
  return (
    <Frame>
      <DetailWorkbench
        sidebar={
          <SectionCard title={copy.metadata}>
            <p>{copy.owner}</p>
          </SectionCard>
        }
      >
        <SectionCard title={copy.details}>
          <p>{copy.recordContent}</p>
        </SectionCard>
        <SectionCard title={copy.history}>
          <p>{copy.latestActivity}</p>
        </SectionCard>
      </DetailWorkbench>
    </Frame>
  );
}
function FormExample() {
  const copy = useStoryTranslations(translations);
  return (
    <Frame>
      <FormWorkbench
        aside={
          <SectionCard title={copy.guidance}>
            <p>{copy.guidanceText}</p>
          </SectionCard>
        }
        footer={
          <div className="ec-form-actions">
            <Button variant="outline" pressable={false}>
              {copy.cancel}
            </Button>
            <Button pressable={false}>{copy.save}</Button>
          </div>
        }
      >
        <SectionCard title={copy.general}>
          <div style={{ display: 'grid', gap: '0.75rem' }}>
            <Input defaultValue={copy.report} />
            <Input defaultValue={copy.operations} />
          </div>
        </SectionCard>
      </FormWorkbench>
    </Frame>
  );
}
function ErrorExample() {
  const copy = useStoryTranslations(translations);
  return (
    <Frame maxWidth="48rem">
      <InlineQueryError title={copy.error} description={copy.errorDescription} onRetry={() => {}} />
    </Frame>
  );
}

const meta = {
  title: 'Patterns/Workbench',
  component: DetailWorkbench,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof DetailWorkbench>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Detail: Story = { args: {}, render: () => <DetailExample /> };
export const Form: Story = { args: {}, render: () => <FormExample /> };
export const Error: Story = { args: {}, render: () => <ErrorExample /> };
