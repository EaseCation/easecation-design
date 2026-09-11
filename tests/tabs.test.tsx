import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Tabs, TabsContent, TabsList, TabsRoot, TabsTrigger } from '../src';
it('changes tab with keyboard', async () => {
  const user = userEvent.setup();
  render(
    <Tabs
      items={[
        { value: 'a', label: '概览', content: 'A' },
        { value: 'b', label: '设置', content: 'B' },
      ]}
    />,
  );
  const first = screen.getByRole('tab', { name: '概览' });
  first.focus();
  await user.keyboard('{ArrowRight}');
  expect(screen.getByRole('tab', { name: '设置' })).toHaveAttribute('aria-selected', 'true');
  expect(screen.getByRole('tabpanel')).toHaveTextContent('B');
});

it('supports composable tabs with a finite list variant', async () => {
  const user = userEvent.setup();
  render(
    <TabsRoot defaultValue="summary">
      <TabsList variant="line">
        <TabsTrigger value="summary">Summary</TabsTrigger>
        <TabsTrigger value="history">History</TabsTrigger>
      </TabsList>
      <TabsContent value="summary">Summary panel</TabsContent>
      <TabsContent value="history">History panel</TabsContent>
    </TabsRoot>,
  );

  expect(screen.getByRole('tablist')).toHaveAttribute('data-variant', 'line');
  await user.click(screen.getByRole('tab', { name: 'History' }));
  expect(screen.getByRole('tabpanel')).toHaveTextContent('History panel');
});

it('selects overflowed composable tabs from the more menu', async () => {
  const clientWidth = vi
    .spyOn(HTMLElement.prototype, 'clientWidth', 'get')
    .mockImplementation(function (this: HTMLElement) {
      return this.classList.contains('ec-tab-list') ? 170 : 0;
    });
  const offsetWidth = vi
    .spyOn(HTMLElement.prototype, 'offsetWidth', 'get')
    .mockImplementation(function (this: HTMLElement) {
      if (this.hasAttribute('data-overflow-measure-item')) return 80;
      if (this.hasAttribute('data-overflow-measure-trigger')) return 32;
      return 0;
    });
  const user = userEvent.setup();

  try {
    render(
      <TabsRoot defaultValue="summary">
        <TabsList>
          <TabsTrigger value="summary">Summary</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        <TabsContent value="summary">Summary panel</TabsContent>
        <TabsContent value="history">History panel</TabsContent>
        <TabsContent value="settings">Settings panel</TabsContent>
      </TabsRoot>,
    );

    expect(screen.queryByRole('tab', { name: 'Settings' })).not.toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'More tabs' }));
    await user.click(screen.getByRole('menuitemradio', { name: 'Settings' }));

    expect(screen.getByRole('tab', { name: 'Settings' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Settings panel');
  } finally {
    clientWidth.mockRestore();
    offsetWidth.mockRestore();
  }
});
