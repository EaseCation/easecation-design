import { render, screen } from '@testing-library/react';
import { AccessGate, PermissionGate } from '../src';
it('renders allowed content or a domain-neutral fallback', () => {
  const { rerender } = render(
    <AccessGate allowed={false} fallback="Unavailable">
      Protected
    </AccessGate>,
  );
  expect(screen.getByText('Unavailable')).toBeInTheDocument();
  rerender(<PermissionGate allowed>Protected</PermissionGate>);
  expect(screen.getByText('Protected')).toBeInTheDocument();
});
