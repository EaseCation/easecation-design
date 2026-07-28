import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ActionBar, AppShell, DetailWorkbench, FormWorkbench, PageScaffold } from '../src';
it('renders the Console Neo shell and opens mobile navigation', async () => {
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
  await user.click(screen.getByRole('button', { name: '打开导航' }));
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
