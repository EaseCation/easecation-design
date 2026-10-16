import { render, screen } from '@testing-library/react';
import { expect, it } from 'vitest';
import { AccessDeniedState, LocaleProvider } from '../src';
it('localizes permission feedback while preserving host actions and contextual details', () => {
  const { rerender } = render(
    <LocaleProvider locale="zh-CN">
      <AccessDeniedState action={<a href="/home">返回首页</a>} />
    </LocaleProvider>,
  );
  expect(screen.getByRole('heading', { name: '无权访问' })).toBeInTheDocument();
  expect(screen.getByRole('link')).toHaveAttribute('href', '/home');
  rerender(
    <LocaleProvider locale="en">
      <AccessDeniedState description="Requires editor permission" embedded />
    </LocaleProvider>,
  );
  expect(screen.getByRole('heading', { name: 'Access denied' })).toBeInTheDocument();
  expect(screen.getByText('Requires editor permission')).toBeInTheDocument();
  expect(screen.queryByRole('link')).not.toBeInTheDocument();
});
