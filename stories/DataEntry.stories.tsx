import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  Button,
  Checkbox,
  Field,
  Form,
  Input,
  Select,
  Surface,
  Switch,
  ThemeProvider,
} from '../src';
import { useStoryTranslations } from '../.storybook/story-locale';

const translations = {
  en: {
    workspaceName: 'Workspace name',
    workspaceHelp: 'Used to identify the workspace within the team.',
    workspacePlaceholder: 'For example: East operations center',
    dataRegion: 'Data region',
    dataRegionPlaceholder: 'Select region',
    east: 'East region',
    west: 'West region',
    legacy: 'Legacy region',
    lowLatency: 'Low-latency region',
    weeklySummary: 'Receive weekly summary',
    weeklySummaryDescription: 'Send an operations summary every Monday.',
    autoSync: 'Automatic sync',
    autoSyncDescription: 'Update data automatically when changes are detected.',
    save: 'Save configuration',
  },
  'zh-CN': {
    workspaceName: '工作区名称',
    workspaceHelp: '用于团队内部识别。',
    workspacePlaceholder: '例如：华东运营中心',
    dataRegion: '数据区域',
    dataRegionPlaceholder: '选择区域',
    east: '华东',
    west: '华西',
    legacy: '旧区域',
    lowLatency: '低延迟区域',
    weeklySummary: '接收每周摘要',
    weeklySummaryDescription: '每周一发送运营数据摘要。',
    autoSync: '自动同步',
    autoSyncDescription: '检测到变更后自动更新数据。',
    save: '保存配置',
  },
} as const;

function CompleteFormExample() {
  const copy = useStoryTranslations(translations);
  return (
    <Form onSubmit={(event) => event.preventDefault()}>
      <Field label={copy.workspaceName} required help={copy.workspaceHelp}>
        {(props) => <Input {...props} placeholder={copy.workspacePlaceholder} />}
      </Field>
      <Field label={copy.dataRegion}>
        {(props) => (
          <Select
            {...props}
            label={copy.dataRegion}
            placeholder={copy.dataRegionPlaceholder}
            options={[
              { value: 'east', label: copy.east, description: copy.lowLatency },
              { value: 'west', label: copy.west },
              { value: 'legacy', label: copy.legacy, disabled: true },
            ]}
          />
        )}
      </Field>
      <Checkbox label={copy.weeklySummary} description={copy.weeklySummaryDescription} />
      <Switch label={copy.autoSync} description={copy.autoSyncDescription} />
      <Button type="submit">{copy.save}</Button>
    </Form>
  );
}

const meta = {
  title: 'Components/Form Controls',
  component: Select,
  decorators: [
    (Story) => (
      <ThemeProvider>
        <div style={{ maxWidth: '36rem', padding: '2rem' }}>
          <Surface style={{ padding: '1.5rem' }}>
            <Story />
          </Surface>
        </div>
      </ThemeProvider>
    ),
  ],
} satisfies Meta<typeof Select>;
export default meta;
type Story = StoryObj<typeof meta>;
export const CompleteForm: Story = {
  args: { options: [] },
  render: () => <CompleteFormExample />,
};
