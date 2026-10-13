import { render, screen } from '@testing-library/react';
import { Combobox, Field, Form, Input, MultiSelect, Select } from '../src';
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
