import { render, screen } from '@testing-library/react';
import { Field, Form, Input } from '../src';
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
