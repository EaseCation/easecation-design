import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Field, NumberInput, Space } from '../src';
const meta = {
  title: 'Components/Form Controls/NumberInput',
  component: NumberInput,
} satisfies Meta<typeof NumberInput>;
export default meta;
export const Decimal: StoryObj<typeof meta> = {
  render: function DecimalExample() {
    const [value, setValue] = useState<number | null>(12.5);
    return (
      <Field label="Amount" help="Use arrow keys to step; blur or Enter confirms precision.">
        {(props) => (
          <NumberInput
            {...props}
            value={value}
            onValueChange={setValue}
            min={0}
            precision={2}
            step="0.01"
            prefix="$"
          />
        )}
      </Field>
    );
  },
};
export const States: StoryObj<typeof meta> = {
  render: () => (
    <Space direction="column">
      <NumberInput aria-label="Disabled" disabled defaultValue={12} />
      <NumberInput aria-label="Read only" readOnly defaultValue={12} />
      <Field label="Quantity" error="Enter a quantity">
        {(props) => <NumberInput {...props} status="error" min={1} precision={0} suffix="items" />}
      </Field>
    </Space>
  ),
};
export const PreciseString: StoryObj<typeof meta> = {
  args: {
    'aria-label': 'Precise decimal',
    stringMode: true,
    defaultValue: '9007199254740993.01',
    step: '0.01',
  },
};
