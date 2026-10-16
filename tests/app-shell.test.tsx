import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ActionBar, AppShell, DetailWorkbench, FormWorkbench, PageScaffold } from '../src';
it('keeps decorative title icons out of the heading name and omits empty icon space', () => {
  const { container, rerender } = render(
    <PageScaffold title="Reports" titleIcon={<svg role="img" aria-label="Chart" />} />,
  );
  expect(screen.getByRole('heading', { name: 'Reports', level: 1 })).toBeInTheDocument();
  expect(screen.queryByRole('img')).not.toBeInTheDocument();
  expect(container.querySelector('.ec-page-scaffold__icon')).toHaveAttribute('aria-hidden', 'true');
  rerender(<PageScaffold title="Reports" />);
  expect(container.querySelector('.ec-page-scaffold__icon')).not.toBeInTheDocument();
});

it('renders the application shell and opens mobile navigation', async () => {
  const user = userEvent.setup();
  render(
    <AppShell
      brand="Acme"
      sidebar={
        <nav>
          <a href="#reports">Reports</a>
        </nav>
      }
    >
      <PageScaffold title="Dashboard">
        <div>Content</div>
      </PageScaffold>
    </AppShell>,
  );
  expect(screen.getByText('Dashboard')).toBeInTheDocument();
  await user.click(screen.getByRole('button', { name: 'Open navigation' }));
  expect(screen.getByRole('dialog')).toHaveTextContent('Reports');
  await user.click(screen.getByRole('link', { name: 'Reports' }));
});
it('renders action and workbench compositions', () => {
  render(
    <>
      <ActionBar>Actions</ActionBar>
      <DetailWorkbench sidebar="Details">Main</DetailWorkbench>
      <FormWorkbench aside="Help" footer="Save">
        Form
      </FormWorkbench>
    </>,
  );
  expect(screen.getByText('Actions')).toBeInTheDocument();
  expect(screen.getByText('Details')).toBeInTheDocument();
  expect(screen.getByText('Save')).toBeInTheDocument();
});
