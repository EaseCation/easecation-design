import { render, screen } from '@testing-library/react';
import { useEffect } from 'react';
import { describe, expect, it } from 'vitest';
import { ToastProvider, useToast, LocaleProvider } from '../src';

function Trigger() {
  const toast = useToast();
  useEffect(() => {
    toast.show({ title: 'Saved', description: 'Changes are available.', duration: 0 });
  }, [toast]);
  return null;
}

describe('ToastProvider', () => {
  it('renders a Sonner notification and removes owned notifications on unmount', async () => {
    const view = render(
      <ToastProvider>
        <Trigger />
      </ToastProvider>,
    );
    expect(await screen.findByText('Saved')).toBeInTheDocument();
    view.unmount();
    expect(screen.queryByText('Saved')).not.toBeInTheDocument();
  });
});

it('provides a localized close action by default', async () => {
  render(
    <LocaleProvider locale="zh-CN">
      <ToastProvider>
        <Trigger />
      </ToastProvider>
    </LocaleProvider>,
  );
  expect(await screen.findByRole('button', { name: '关闭' })).toBeInTheDocument();
});
