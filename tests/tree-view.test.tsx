import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TreeView } from '../src';

const items = [
  {
    value: 'workspace',
    label: 'Workspace',
    children: [
      { value: 'active', label: 'Active projects' },
      { value: 'archive', label: 'Archive', disabled: true },
    ],
  },
  { value: 'settings', label: 'Settings', description: 'Organization defaults' },
];

it('selects and expands a branch with native pointer activation', async () => {
  const user = userEvent.setup();
  let selected = '';
  let expanded: string[] = [];
  const { rerender } = render(
    <TreeView
      ariaLabel="Navigation tree"
      items={items}
      selectedValue={selected}
      expandedValues={expanded}
      onSelectedValueChange={(value) => {
        selected = value;
      }}
      onExpandedValuesChange={(values) => {
        expanded = values;
      }}
    />,
  );

  const workspace = screen.getByRole('treeitem', { name: 'Workspace' });
  await user.click(workspace);
  expect(selected).toBe('workspace');
  expect(expanded).toEqual(['workspace']);

  rerender(
    <TreeView
      ariaLabel="Navigation tree"
      items={items}
      selectedValue={selected}
      expandedValues={expanded}
    />,
  );
  expect(workspace).toHaveAttribute('aria-expanded', 'true');
  expect(workspace).toHaveAttribute('aria-selected', 'true');
  expect(screen.getByRole('treeitem', { name: 'Active projects' })).toBeVisible();
  expect(screen.getByRole('treeitem', { name: 'Archive' })).toBeDisabled();
});

it('implements roving focus and standard tree arrow navigation', async () => {
  const user = userEvent.setup();
  render(
    <TreeView ariaLabel="Keyboard tree" items={items} defaultExpandedValues={['workspace']} />,
  );

  const workspace = screen.getByRole('treeitem', { name: 'Workspace' });
  const active = screen.getByRole('treeitem', { name: 'Active projects' });
  const settings = screen.getByRole('treeitem', { name: /Settings/ });
  workspace.focus();

  await user.keyboard('{ArrowRight}');
  expect(active).toHaveFocus();
  await user.keyboard('{ArrowDown}');
  expect(settings).toHaveFocus();
  await user.keyboard('{Home}');
  expect(workspace).toHaveFocus();
  await user.keyboard('{ArrowLeft}');
  expect(workspace).toHaveAttribute('aria-expanded', 'false');
});

it('renders an explicit empty state', () => {
  render(<TreeView ariaLabel="Empty tree" items={[]} emptyText="Nothing here" />);
  expect(screen.getByRole('tree', { name: 'Empty tree' })).toHaveTextContent('Nothing here');
});
