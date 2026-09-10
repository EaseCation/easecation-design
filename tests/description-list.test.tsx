import { render, screen } from '@testing-library/react';
import { DescriptionList } from '../src';

it('renders native description semantics with responsive layout metadata', () => {
  const { container } = render(
    <DescriptionList
      aria-label="Workspace details"
      columns={2}
      appearance="bordered"
      items={[
        { term: 'Owner', description: 'Avery' },
        { term: 'Region', description: 'East' },
        { term: 'Endpoint', description: 'service.example.test', span: 2 },
      ]}
    />,
  );

  const list = container.querySelector('dl');
  expect(list).toHaveAttribute('data-columns', '2');
  expect(list).toHaveAttribute('data-appearance', 'bordered');
  expect(screen.getByText('Owner').tagName).toBe('DT');
  expect(screen.getByText('Avery').tagName).toBe('DD');
  expect(screen.getByText('Endpoint').parentElement).toHaveAttribute('data-span', '2');
});
