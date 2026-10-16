import { render, screen } from '@testing-library/react';
import { Combobox, Field, FilterSelect, Form, Input, MultiSelect, Select } from '../src';
it('connects field labels, descriptions and form disabled state', () => {
  render(
    <Form disabled>
      <Field label="名称" error="名称必填">
        {(props) => <Input {...props} />}
      </Field>
    </Form>,
  );
  const input = screen.getByLabelText('名称');
  expect(input).toBeDisabled();
  expect(input).toHaveAttribute('aria-describedby');
  expect(screen.getByRole('alert')).toHaveTextContent('名称必填');
});

it.each([Select, Combobox, MultiSelect])(
  'connects a choice control to the Field label, error, required and disabled state',
  (Control) => {
    render(
      <Form disabled>
        <Field label="Choice" required error="Choose a value">
          {(props) => <Control {...props} options={[{ value: 'one', label: 'One' }]} />}
        </Field>
      </Form>,
    );
    const control = screen.getByRole('combobox', { name: 'Choice' });
    expect(control).toHaveAccessibleDescription('Choose a value');
    expect(control).toHaveAttribute('aria-required', 'true');
    expect(control).toHaveAttribute('aria-invalid', 'true');
    expect(control).toBeDisabled();
  },
);

it.each([Select, Combobox, MultiSelect])('preserves a native aria-label', (Control) => {
  render(<Control aria-label="Standalone choice" options={[]} />);
  expect(screen.getByRole('combobox', { name: 'Standalone choice' })).toBeInTheDocument();
});

it('keeps an explicit field ID connected as errors change back to help', () => {
  const tree = (error?: string) => (
    <Field id="email" label="Email" help="Use your work address" error={error}>
      {(props) => <Input {...props} />}
    </Field>
  );
  const { rerender } = render(tree('Enter a valid address'));
  const input = screen.getByRole('textbox', { name: 'Email' });
  expect(input).toHaveAttribute('id', 'email');
  expect(input).toHaveAttribute('aria-invalid', 'true');
  expect(input).toHaveAccessibleDescription('Enter a valid address');
  rerender(tree());
  expect(input).not.toHaveAttribute('aria-invalid');
  expect(input).toHaveAccessibleDescription('Use your work address');
  expect(screen.queryByRole('alert')).not.toBeInTheDocument();
});

it('connects FilterSelect validation and forwards the focus ref to its trigger', () => {
  let trigger: HTMLButtonElement | null = null;
  render(
    <Field label="Application" required error="Choose an application">
      {(props) => (
        <FilterSelect
          {...props}
          ref={(element) => {
            trigger = element;
          }}
          value=""
          onValueChange={() => {}}
          options={[]}
        />
      )}
    </Field>,
  );
  const control = screen.getByRole('combobox', { name: 'Application' });
  expect(control).toHaveAccessibleDescription('Choose an application');
  expect(control).toHaveAttribute('aria-invalid', 'true');
  expect(control).toHaveAttribute('aria-required', 'true');
  expect(trigger).toBe(control);
});
