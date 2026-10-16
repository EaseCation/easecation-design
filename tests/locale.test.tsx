import { render, screen } from '@testing-library/react';
import { expect, it } from 'vitest';
import { LocaleProvider, useLocale } from '../src/locale/LocaleProvider';
function Labels() {
  const { messages } = useLocale();
  return (
    <p>
      {messages.close}/{messages.cancel}/{messages.retry}
    </p>
  );
}
it('inherits nested messages and changes languages without leaking previous labels', () => {
  const tree = (locale: 'en' | 'zh-CN') => (
    <LocaleProvider locale={locale} messages={{ retry: 'Again' }}>
      <LocaleProvider messages={{ close: 'Dismiss' }}>
        <Labels />
      </LocaleProvider>
    </LocaleProvider>
  );
  const { rerender } = render(tree('zh-CN'));
  expect(screen.getByText('Dismiss/取消/Again')).toBeInTheDocument();
  rerender(tree('en'));
  expect(screen.getByText('Dismiss/Cancel/Again')).toBeInTheDocument();
});
