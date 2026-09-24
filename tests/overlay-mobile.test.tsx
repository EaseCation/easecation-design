import { render, screen } from '@testing-library/react';
import { Drawer, Modal } from '../src';

it('labels titleless overlays and preserves drawer styles', () => {
  const modal = render(
    <Modal open onOpenChange={() => {}} ariaLabel="Quick preview">
      Preview
    </Modal>,
  );
  expect(screen.getByRole('dialog', { name: 'Quick preview' })).toBeInTheDocument();
  modal.unmount();

  render(
    <Drawer
      open
      onOpenChange={() => {}}
      ariaLabel="Navigation"
      placement="left"
      style={{ maxWidth: '20rem' }}
    >
      Links
    </Drawer>,
  );
  // 断言调用方传入的 style 原样落到元素的行内样式上。
  // 这里不能再用 toHaveStyle({ maxWidth: '20rem' })：toHaveStyle 读的是 getComputedStyle，
  // 而 jsdom 30 起会把 rem 解析成像素（20rem -> 320px），与字面量 '20rem' 不再相等。
  // 用行内样式断言既符合本用例「保留调用方样式」的意图，也不依赖根字号换算。
  expect(screen.getByRole('dialog', { name: 'Navigation' }).style.maxWidth).toBe('20rem');
});

it('uses the visual viewport to keep modal content above mobile keyboards', async () => {
  const listeners = new Map<string, EventListener>();
  const originalViewport = window.visualViewport;
  Object.defineProperty(window, 'visualViewport', {
    configurable: true,
    value: {
      height: 480,
      offsetTop: 12,
      addEventListener: (type: string, listener: EventListener) => listeners.set(type, listener),
      removeEventListener: (type: string) => listeners.delete(type),
    },
  });

  const { findByRole, unmount } = render(
    <Modal open onOpenChange={() => {}} title="Edit profile" fullScreenOnMobile>
      Form
    </Modal>,
  );
  expect(await findByRole('dialog', { name: 'Edit profile' })).toHaveStyle({
    '--ec-overlay-viewport-height': '480px',
    '--ec-overlay-viewport-offset-top': '12px',
  });

  unmount();
  expect(listeners).toHaveLength(0);
  Object.defineProperty(window, 'visualViewport', { configurable: true, value: originalViewport });
});
