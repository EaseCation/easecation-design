import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Field, Form, Textarea } from '../src';
const meta = { title: 'Components/Form Controls/Textarea', component: Textarea } satisfies Meta<
  typeof Textarea
>;
export default meta;
export const ResizingAndCount: StoryObj<typeof meta> = {
  render: function ResizingExample() {
    const [value, setValue] = useState('A draft that grows as you type.');
    return (
      <Form>
        <Field label="Description" help="Up to 500 characters">
          {(props) => (
            <Textarea
              {...props}
              autoResize
              minRows={3}
              maxRows={8}
              showCount
              maxLength={500}
              value={value}
              onChange={(event) => setValue(event.target.value)}
            />
          )}
        </Field>
      </Form>
    );
  },
};
export const Disabled: StoryObj<typeof meta> = {
  args: {
    'aria-label': 'Description',
    disabled: true,
    defaultValue: 'Saved draft',
    showCount: true,
    maxLength: 500,
  },
};
export const Error: StoryObj<typeof meta> = {
  render: () => (
    <Field label="Description" error="Enter a description">
      {(props) => <Textarea {...props} status="error" showCount maxLength={500} rows={3} />}
    </Field>
  ),
};
