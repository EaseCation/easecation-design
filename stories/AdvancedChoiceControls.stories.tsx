import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Accordion, Combobox, MultiSelect, Surface, ThemeProvider } from '../src';

const options = [
  { value: 'alpha', label: 'Alpha workspace', description: 'Primary operations' },
  { value: 'beta', label: 'Beta workspace', description: 'Preview environment' },
  { value: 'archive', label: 'Archived workspace', disabled: true },
];

function AdvancedChoiceExample() {
  const [region, setRegion] = useState('alpha');
  const [reviewers, setReviewers] = useState<string[]>(['alpha']);
  return (
    <div style={{ display: 'grid', gap: '1.25rem' }}>
      <Combobox
        label="Workspace"
        options={options}
        value={region}
        onValueChange={setRegion}
        clearable
      />
      <MultiSelect
        label="Reviewers"
        options={options}
        value={reviewers}
        onValueChange={setReviewers}
        creatable
      />
      <Accordion
        type="multiple"
        defaultValue={['summary']}
        ariaLabel="Configuration sections"
        items={[
          {
            value: 'summary',
            title: 'Summary',
            description: 'Review the selected workspace and reviewers.',
            action: <button type="button">Reset</button>,
            content: (
              <p>
                Workspace: {region || 'None'}; reviewers: {reviewers.join(', ') || 'None'}.
              </p>
            ),
          },
          {
            value: 'delivery',
            title: 'Delivery settings',
            content: <p>Additional configuration can be composed inside an accordion item.</p>,
          },
        ]}
      />
    </div>
  );
}

const meta = {
  title: 'Components/Form Controls/Advanced Choices',
  component: Combobox,
  decorators: [
    (Story) => (
      <ThemeProvider>
        <div style={{ maxWidth: '42rem', minHeight: '38rem', padding: '2rem' }}>
          <Surface style={{ padding: '1.5rem' }}>
            <Story />
          </Surface>
        </div>
      </ThemeProvider>
    ),
  ],
} satisfies Meta<typeof Combobox>;

export default meta;
type Story = StoryObj<typeof meta>;
export const CompleteExample: Story = {
  args: { options: [] },
  render: () => <AdvancedChoiceExample />,
};

export const LongSearchableCatalog: Story = {
  args: { options: [] },
  render: () => (
    <Combobox
      label="Game mode"
      placeholder="Search by name, ID, or keyword"
      clearable
      options={Array.from({ length: 48 }, (_, index) => ({
        value: `bedwars-mode-${index + 1}`,
        label: `起床战争模式 ${index + 1}`,
        description: `bedwars-mode-${index + 1}`,
        keywords: [`mode-${index + 1}`, `模式${index + 1}`],
        disabled: index === 47,
      }))}
    />
  ),
};
