import { useRef, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button, Field, FilterSelect, Form, Input } from '../src';

function ValidationExample() {
  const [name, setName] = useState('');
  const [region, setRegion] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const nameRef = useRef<HTMLInputElement>(null);
  const regionRef = useRef<HTMLButtonElement>(null);
  return (
    <Form
      noValidate
      onSubmit={(event) => {
        event.preventDefault();
        setSubmitted(true);
        if (!name.trim()) nameRef.current?.focus();
        else if (!region) regionRef.current?.focus();
      }}
    >
      <Field
        id="validation-name"
        label="Workspace name"
        required
        help="Visible to your team"
        error={submitted && !name.trim() ? 'Enter a workspace name' : undefined}
      >
        {(props) => (
          <Input
            {...props}
            ref={nameRef}
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
        )}
      </Field>
      <Field label="Region" required error={submitted && !region ? 'Choose a region' : undefined}>
        {(props) => (
          <FilterSelect
            {...props}
            ref={regionRef}
            value={region}
            onValueChange={setRegion}
            options={[
              { value: 'eu', label: 'Europe' },
              { value: 'ap', label: 'Asia Pacific' },
            ]}
          />
        )}
      </Field>
      <Button type="submit">Save</Button>
    </Form>
  );
}
const meta = { title: 'Components/Form Controls/Validation', component: Form } satisfies Meta<
  typeof Form
>;
export default meta;
export const CorrectableErrors: StoryObj<typeof meta> = { render: () => <ValidationExample /> };
