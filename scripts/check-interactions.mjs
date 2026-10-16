/* global document, getComputedStyle */
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { createServer } from 'vite';
import react from '@vitejs/plugin-react';
import { chromium } from 'playwright';

const root = path.resolve(import.meta.dirname, '..');
const server = await createServer({
  root,
  cacheDir: path.join(root, 'node_modules/.vite/shared-interactions'),
  optimizeDeps: { entries: ['tests/browser/interactions.html'] },
  resolve: {
    alias: [{ find: /^\.\.\/\.\.\/src$/, replacement: path.join(root, 'dist/index.js') }],
  },
  configFile: false,
  plugins: [react()],
  server: { host: '127.0.0.1', port: 0 },
});
let browser;
const results = [];
try {
  await server.listen();
  browser = await chromium.launch();
  for (const width of [320, 390, 768, 1280]) {
    for (const theme of ['light', 'dark']) {
      const touch = width <= 768;
      const context = await browser.newContext({
        viewport: { width, height: 900 },
        hasTouch: touch,
        reducedMotion: 'no-preference',
        colorScheme: theme,
      });
      try {
        const page = await context.newPage();
        page.setDefaultTimeout(10000);
        const errors = [];
        page.on('pageerror', (error) => errors.push(error.message));
        await page.goto(
          `${server.resolvedUrls.local[0]}tests/browser/interactions.html?theme=${theme}`,
        );
        await page.getByTestId('press-button').waitFor();
        await page.waitForFunction(
          () => document.querySelector('[data-testid="motion"]')?.textContent === 'normal',
        );
        assert.equal(
          await page.locator('[data-ec-theme]').first().getAttribute('data-ec-theme'),
          theme,
        );
        assert.ok(
          await page.evaluate(
            () => document.documentElement.scrollWidth <= document.documentElement.clientWidth,
          ),
          `No horizontal overflow at ${width}/${theme}`,
        );

        for (const id of ['press-button', 'press-card']) {
          const surface = page.getByTestId(id);
          await surface.dispatchEvent('pointerdown', {
            pointerId: 1,
            clientX: 24,
            clientY: 24,
            button: 0,
          });
          await page.waitForFunction(
            (id) =>
              document.querySelector(`[data-testid="${id}"]`)?.classList.contains('is-pressing'),
            id,
          );
          await surface.dispatchEvent('pointercancel', { pointerId: 1 });
          assert.equal(
            await surface.evaluate((node) => node.classList.contains('is-pressing')),
            false,
            `${id} pointercancel`,
          );
          await surface.dispatchEvent('pointerdown', { pointerId: 1, button: 0 });
          await surface.dispatchEvent('lostpointercapture', { pointerId: 1 });
          assert.equal(
            await surface.evaluate((node) => node.classList.contains('is-pressing')),
            false,
            `${id} lost capture`,
          );
        }
        // Changing the OS setting while a pointer is held must clear stale press state.
        await page
          .getByTestId('press-card')
          .dispatchEvent('pointerdown', { pointerId: 1, button: 0 });
        await page.emulateMedia({ reducedMotion: 'reduce' });
        await page.waitForFunction(
          () => document.querySelector('[data-testid="motion"]')?.textContent === 'reduced',
        );
        for (const id of ['press-button', 'press-card']) {
          await page.getByTestId(id).dispatchEvent('pointerdown', { pointerId: 1, button: 0 });
          assert.equal(
            await page.getByTestId(id).evaluate((node) => node.classList.contains('is-pressing')),
            false,
            `${id} reduced motion`,
          );
          assert.equal(
            await page.getByTestId(id).evaluate((node) => getComputedStyle(node).transform),
            'none',
            `${id} has no reduced-motion tilt`,
          );
        }
        await page.emulateMedia({ reducedMotion: 'no-preference' });
        await page.waitForFunction(
          () => document.querySelector('[data-testid="motion"]')?.textContent === 'normal',
        );
        assert.equal(
          await page
            .getByTestId('press-card')
            .evaluate((node) => node.classList.contains('is-pressing')),
          false,
          'Re-enabling motion does not restore stale press',
        );

        for (const id of ['disabled-link', 'loading-link']) {
          const link = page.getByTestId(id);
          await link.dispatchEvent('click');
          await link.focus();
          await page.keyboard.press('Enter');
          await page.keyboard.press('Space');
        }
        assert.equal(
          await page.getByTestId('actions').textContent(),
          '0',
          'Disabled children never execute',
        );
        assert.ok(!page.url().includes('#unexpected'), 'Disabled link never navigates');
        const input = page.getByRole('textbox', { name: 'Search', exact: true });
        await input.fill('中文');
        await input.dispatchEvent('keydown', { key: 'Enter', isComposing: true });
        await input.dispatchEvent('keydown', { key: 'Enter', keyCode: 229 });
        assert.equal(
          await page.getByTestId('searches').textContent(),
          '0',
          'IME Enter never searches',
        );
        await input.press('Enter');
        assert.equal(await page.getByTestId('searches').textContent(), '1');

        await page.getByRole('button', { name: 'Open modal', exact: true }).click();
        const outer = page.getByRole('dialog', { name: 'Outer modal', exact: true });
        await outer.waitFor();
        if (touch)
          assert.equal(
            await outer.evaluate((node) => document.activeElement === node),
            true,
            'Touch focuses modal container without keyboard',
          );
        else
          assert.equal(
            await page
              .getByRole('textbox', { name: 'Modal input' })
              .evaluate((node) => document.activeElement === node),
            true,
          );
        await page.getByRole('button', { name: 'Open nested', exact: true }).click();
        const nested = page.getByRole('dialog', { name: 'Nested dialog', exact: true });
        await nested.waitFor();
        if (touch)
          assert.equal(
            await nested.evaluate((node) => document.activeElement === node),
            true,
            'Touch focuses responsive dialog container',
          );
        for (const key of ['Tab', 'Tab', 'Tab', 'Shift+Tab']) {
          await page.keyboard.press(key);
          assert.equal(
            await nested.evaluate((node) => node.contains(document.activeElement)),
            true,
            'Keyboard focus remains inside the top dialog',
          );
        }
        // Pending top layer consumes both host Back and Escape without closing its parent.
        await page.getByRole('button', { name: 'Lock', exact: true }).click();
        await page.keyboard.press('F8');
        await page.keyboard.press('Escape');
        assert.equal(await nested.isVisible(), true);
        assert.equal(await page.locator('[role="dialog"]').count(), 2);
        await page.getByRole('button', { name: 'Unlock', exact: true }).click();
        await page.keyboard.press('F8');
        await nested.waitFor({ state: 'hidden' });
        assert.equal(await outer.isVisible(), true, 'Host Back closes only the top overlay');
        await page.keyboard.press('F8');
        await outer.waitFor({ state: 'hidden' });
        assert.equal(
          await page
            .getByRole('button', { name: 'Open modal', exact: true })
            .evaluate((node) => document.activeElement === node),
          true,
          'Focus returns to launcher',
        );
        assert.deepEqual(errors, []);
        results.push({ width, theme, touch, status: 'passed' });
        console.log(
          `Interaction checks passed: ${width}px ${theme} ${touch ? 'touch' : 'pointer'}`,
        );
      } finally {
        await context.close();
      }
    }
  }
  await fs.mkdir(path.join(root, 'output/playwright'), { recursive: true });
  await fs.writeFile(
    path.join(root, 'output/playwright/shared-interactions.json'),
    `${JSON.stringify(results, null, 2)}\n`,
  );
} finally {
  await browser?.close();
  await server.close();
}
