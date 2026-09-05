import { render, screen } from '@testing-library/react';
import { Alert } from '../src/antd-compat';

it('tracks alert slots so empty columns do not affect content spacing', () => {
  const { rerender } = render(<Alert message="Heads up" showIcon={false} />);
  const simpleAlert = screen.getByRole('alert');

  expect(simpleAlert).toHaveAttribute('data-show-icon', 'false');
  expect(simpleAlert).toHaveAttribute('data-has-description', 'false');
  expect(simpleAlert).toHaveAttribute('data-has-action', 'false');
  expect(simpleAlert.querySelector('.ec-alert-action')).not.toBeInTheDocument();

  rerender(
    <Alert message="Heads up" description="Review the details." action={<button>Undo</button>} />,
  );
  const actionAlert = screen.getByRole('alert');

  expect(actionAlert).toHaveAttribute('data-show-icon', 'true');
  expect(actionAlert).toHaveAttribute('data-has-description', 'true');
  expect(actionAlert).toHaveAttribute('data-has-action', 'true');
  expect(screen.getByRole('button', { name: 'Undo' })).toBeInTheDocument();
});
