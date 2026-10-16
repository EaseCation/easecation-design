/* global document, getComputedStyle, DOMMatrix */
import assert from 'node:assert/strict';
import path from 'node:path';
import { createServer } from 'vite';
import react from '@vitejs/plugin-react';
import { chromium } from 'playwright';

const root = path.resolve(import.meta.dirname, '..');
const server = await createServer({
  root,
  cacheDir: path.join(root, 'node_modules/.vite/shared-motion'),
  optimizeDeps: { entries: ['tests/browser/motion.html'] },
  resolve: {
    alias: [{ find: /^\.\.\/\.\.\/src$/, replacement: path.join(root, 'dist/index.js') }],
  },
  configFile: false,
  plugins: [react()],
  server: { host: '127.0.0.1', port: 0 },
});
let browser;
const selectors = {
  select: '.ec-select__menu',
  combo: '.ec-combobox__menu',
  multi: '.ec-multi-select__menu',
  menu: '.ec-dropdown-content',
  popover: '.ec-popover-content',
  tooltip: '.ec-tooltip-content',
};
try {
  await server.listen();
  browser = await chromium.launch();
  for (const width of [390, 1280]) {
    for (const theme of ['light', 'dark']) {
      const context = await browser.newContext({
        viewport: { width, height: 900 },
        hasTouch: width === 390,
        reducedMotion: 'no-preference',
        colorScheme: theme,
      });
      const page = await context.newPage();
      page.setDefaultTimeout(5000);
      const errors = [];
      page.on('pageerror', (error) => errors.push(error.message));
      for (const side of width === 1280 ? ['top', 'bottom', 'left', 'right'] : ['top', 'bottom']) {
        for (const [control, selector] of Object.entries(selectors)) {
          if (control === 'tooltip' && width === 390) continue;
          if (
            (side === 'left' || side === 'right') &&
            ['select', 'combo', 'multi'].includes(control)
          )
            continue;
          console.log('Checking', width, theme, side, control);
          await page.goto(
            `${server.resolvedUrls.local[0]}tests/browser/motion.html?theme=${theme}&side=${side}&control=${control}`,
          );
          const trigger =
            control === 'select'
              ? page.getByRole('combobox', { name: 'Select', includeHidden: true })
              : control === 'combo'
                ? page.getByRole('combobox', { name: 'Combo', includeHidden: true })
                : control === 'multi'
                  ? page.getByRole('combobox', { name: 'Multi', includeHidden: true })
                  : page.getByRole('button', {
                      name:
                        control === 'menu' ? 'Menu' : control === 'popover' ? 'Popover' : 'Tooltip',
                      exact: true,
                      includeHidden: true,
                    });
          if (control === 'tooltip') await trigger.hover();
          else if (width === 390) await trigger.tap();
          else await trigger.click();
          const surface = page.locator(selector);
          await surface.waitFor({ state: 'visible' });
          const animation = await surface.evaluate((node) => {
            const style = getComputedStyle(node);
            return {
              name: style.animationName,
              duration: style.animationDuration,
              side: node.dataset.side,
              x: style.getPropertyValue('--ec-float-x').trim(),
              y: style.getPropertyValue('--ec-float-y').trim(),
              origin: style.transformOrigin,
            };
          });
          assert.equal(animation.name, 'ec-float-in', `${control} entrance`);
          assert.equal(animation.side, side, `${control} collision placement`);
          assert.equal(animation.duration, '0.18s');
          // Assert the rendered keyframe translation, not only data attributes.
          await surface.evaluate((node) => {
            const animation = node.getAnimations()[0];
            if (animation) {
              animation.pause();
              animation.currentTime = 0;
            }
          });
          const translation = await surface.evaluate((node) => {
            const matrix = new DOMMatrix(getComputedStyle(node).transform);
            return { x: matrix.m41, y: matrix.m42 };
          });
          assert.ok(
            side === 'top'
              ? translation.y > 0
              : side === 'bottom'
                ? translation.y < 0
                : side === 'left'
                  ? translation.x > 0
                  : translation.x < 0,
            `${control}/${side}: starts toward trigger`,
          );
          await surface.evaluate((node) =>
            node.getAnimations().forEach((animation) => animation.finish()),
          );
          if (control === 'select') {
            assert.equal(await trigger.getAttribute('data-state'), 'open');
            await page.waitForFunction(
              () =>
                new DOMMatrix(
                  getComputedStyle(document.querySelector('.ec-select__chevron')).transform,
                ).a < -0.99,
            );
          }
          // Record close lifecycle synchronously; do not rely on a screenshot of a short exit.
          await page.evaluate((selector) => {
            document.body.dataset.motionExit = '';
            document.querySelector(selector).addEventListener('animationstart', (event) => {
              if (event.animationName === 'ec-float-out') {
                document.body.dataset.motionExit = `${getComputedStyle(event.target).animationDuration}/${getComputedStyle(event.target).pointerEvents}`;
              }
            });
          }, selector);
          await page.keyboard.press('Escape');
          await page.waitForFunction(() => document.body.dataset.motionExit !== '');
          assert.equal(
            await page.evaluate(() => document.body.dataset.motionExit),
            '0.135s/none',
            `${control} exit`,
          );
          await surface.waitFor({ state: 'detached' });
          if (control !== 'tooltip')
            assert.equal(
              await trigger.evaluate((node) => node === document.activeElement),
              true,
              `${control} focus returns`,
            );
          // Reopen during an exit; no stale closing state or orphan portal may survive.
          if (control !== 'tooltip') {
            await trigger.click();
            await surface.waitFor({ state: 'visible' });
            await page.keyboard.press('Escape');
            await trigger.press(control === 'popover' ? 'Enter' : 'ArrowDown');
            await page.waitForFunction(
              (selector) => document.querySelector(selector)?.dataset.state === 'open',
              selector,
            );
            assert.equal(await surface.count(), 1);
            await page.emulateMedia({ reducedMotion: 'reduce' });
            await page.waitForFunction(
              () => document.querySelector('main').dataset.reducedMotion === 'true',
            );
            assert.equal(
              await surface.evaluate((node) => getComputedStyle(node).animationDuration),
              '0.001s',
            );
            await page.keyboard.press('Escape');
            await surface.waitFor({ state: 'detached' });
            await page.emulateMedia({ reducedMotion: 'no-preference' });
          }
        }
      }
      await page.goto(
        `${server.resolvedUrls.local[0]}tests/browser/motion.html?theme=${theme}&control=keyboard`,
      );
      const button = page.getByTestId('keyboard');
      await button.focus();
      for (const [index, key] of ['Enter', 'Space'].entries()) {
        await button.press(key);
        assert.equal(await button.textContent(), `Action ${index + 1}`);
        await page.waitForFunction(
          () =>
            new DOMMatrix(
              getComputedStyle(document.querySelector('[data-testid="keyboard"]')).transform,
            ).a < 0.99,
        );
        await page.waitForFunction(
          () =>
            !document.querySelector('[data-testid="keyboard"]').classList.contains('is-pressing'),
        );
      }
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.waitForFunction(
        () => document.querySelector('main').dataset.reducedMotion === 'true',
      );
      await button.press('Enter');
      assert.equal(await button.textContent(), 'Action 3');
      assert.equal(await button.evaluate((node) => node.classList.contains('is-pressing')), false);
      assert.deepEqual(errors, []);
      console.log(`Motion passed: ${width}px ${theme}`);
      await context.close();
    }
  }
} finally {
  await browser?.close();
  await server.close();
}
