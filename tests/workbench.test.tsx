import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderToString } from 'react-dom/server';
import { WorkbenchWelcome, WorkbenchSection, WorkbenchEntry } from '../src';

it('keeps router anchor semantics and keyboard activation when composing entries', async () => {
  const onClick = vi.fn((event) => event.preventDefault());
  render(
    <WorkbenchSection title="Workspace">
      <WorkbenchEntry asChild title="Projects" description="Open projects">
        <a href="/projects" onClick={onClick} />
      </WorkbenchEntry>
    </WorkbenchSection>,
  );
  const link = screen.getByRole('link', { name: 'Projects Open projects' });
  expect(link).toHaveAttribute('href', '/projects');
  expect(screen.getByRole('region', { name: 'Workspace' })).toContainElement(link);
  link.focus();
  await userEvent.setup().keyboard('{Enter}');
  expect(onClick).toHaveBeenCalledTimes(1);
});
it('drops a failed avatar and retries when its source changes', () => {
  const { container, rerender } = render(
    <WorkbenchWelcome name="Alex" avatarSrc="https://example.com/a.png" />,
  );
  fireEvent.error(container.querySelector('img')!);
  expect(container.querySelector('img')).toBeNull();
  expect(screen.getByText('Al')).toBeInTheDocument();
  rerender(<WorkbenchWelcome name="Sam" avatarSrc="https://example.com/b.png" />);
  expect(container.querySelector('img')).toHaveAttribute('src', 'https://example.com/b.png');
  expect(screen.queryByText('Al')).not.toBeInTheDocument();
});
it('supports nested profile headings and decorative artwork without browser globals', () => {
  const markup = renderToString(
    <WorkbenchWelcome
      name="Alex"
      headingLevel={2}
      backgroundImage="/art.png"
      greeting="Your account"
      summary="3 tasks"
    />,
  );
  expect(markup).toContain('<h2>');
  expect(markup).not.toContain('<h1>');
  expect(markup).toContain('data-ec-theme="dark"');
  expect(markup).toContain('aria-hidden="true"');
});
