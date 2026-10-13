import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { createServer } from 'vite';
import react from '@vitejs/plugin-react';
import { chromium } from 'playwright';

const root = path.resolve(import.meta.dirname, '..');
const server = await createServer({
  root,
  cacheDir: path.join(root, 'node_modules/.vite/theme-composition'),
  optimizeDeps: { entries: ['tests/browser/index.html'] },
  resolve: {
    alias: [
      { find: /^\.\.\/\.\.\/src$/, replacement: path.join(root, 'dist/index.js') },
      { find: /^\.\.\/\.\.\/src\/compat$/, replacement: path.join(root, 'dist/compat.js') },
    ],
  },
  configFile: false,
  plugins: [react()],
  server: { host: '127.0.0.1', port: 0 },
});
let browser;
try {
  await server.listen();
  await fs.mkdir(path.join(root, 'output/playwright'), { recursive: true });
  browser = await chromium.launch();
  const page = await browser.newPage();
  page.setDefaultTimeout(10000);
  page.setDefaultNavigationTimeout(30000);
  const failures = [];
  page.on('pageerror', (error) => failures.push(error.message));
  await page.goto(`${server.resolvedUrls.local[0]}tests/browser/index.html`);
  await page.locator('#default .ec-theme-portal').count();
  await page.getByRole('button', { name: 'Action', exact: true }).first().waitFor();
  const computed = (locator) =>
    locator.evaluate((element) => {
      const style = getComputedStyle(element);
      return {
        height: element.getBoundingClientRect().height,
        background: style.backgroundColor,
        radius: style.borderRadius,
        font: style.fontFamily,
        minHeight: style.minHeight,
        overflow: style.overflow,
      };
    });
  const controlSelectors = [
    '.ec-button',
    '.ec-input-shell',
    '.ec-select__trigger',
    '.ec-combobox__control',
    '.ec-multi-select__control',
  ];
  for (const selector of controlSelectors) {
    assert.equal(
      (await computed(page.locator(`#default ${selector}`).first())).height,
      32,
      `Default ${selector}`,
    );
    assert.equal(
      (await computed(page.locator(`#override ${selector}`).first())).height,
      56,
      `Token height ${selector}`,
    );
    assert.equal(
      (await computed(page.locator(`#compact ${selector}`).first())).height,
      28,
      `Compact ${selector}`,
    );
  }
  const overridden = await computed(page.locator('#override .ec-button'));
  assert.equal(overridden.background, 'rgb(220, 38, 38)');
  assert.equal(overridden.radius, '12px');
  assert.equal(
    (await computed(page.locator('#override .ec-check__box'))).background,
    'rgb(220, 38, 38)',
  );
  assert.deepEqual(
    await computed(page.getByRole('button', { name: 'Inner light' })),
    await computed(page.locator('#default .ec-button')),
  );
  const provider = await computed(page.locator('#nested [data-ec-theme="light"]'));
  assert.equal(provider.minHeight, '0px');
  assert.equal(provider.overflow, 'visible');
  for (const [name, description] of [
    ['Field selection', 'Selection error'],
    ['Field search', 'Search error'],
    ['Field tags', 'Tags error'],
  ]) {
    const control = page.getByRole('combobox', { name, exact: true });
    assert.equal(await control.getAttribute('aria-required'), 'true');
    assert.equal(await control.getAttribute('aria-invalid'), 'true');
    const id = await control.getAttribute('aria-describedby');
    assert.equal(await page.locator(`[id="${id}"]`).textContent(), description);
    const controlId = await control.getAttribute('id');
    await page.locator(`label[for="${controlId}"]`).click();
    assert.equal(
      await page
        .locator(`[id="${controlId}"]`)
        .evaluate(
          (element) =>
            document.activeElement === element || element.getAttribute('aria-expanded') === 'true',
        ),
      true,
    );
    await page.keyboard.press('Escape');
  }
  for (const viewport of [
    { width: 1280, height: 800 },
    { width: 390, height: 844 },
  ]) {
    await page.setViewportSize(viewport);
    await page.reload();
    await page.getByRole('button', { name: 'Open modal', exact: true }).click();
    const dialog = page.getByRole('dialog', { name: 'Theme inheritance' });
    await dialog.waitFor();
    const action = page.getByRole('button', { name: 'Change color theme' });
    assert.equal((await computed(action)).font, 'monospace');
    assert.equal((await computed(dialog)).background, 'rgb(15, 23, 42)');
    const original = (await computed(action)).background;
    await action.click();
    await page.waitForFunction(
      (previous) =>
        getComputedStyle(
          [...document.querySelectorAll('button')].find(
            (el) => el.textContent === 'Change color theme',
          ),
        ).backgroundColor !== previous,
      original,
    );
    await page.getByRole('button', { name: 'Change tokens' }).click();
    await page.waitForFunction(
      () =>
        getComputedStyle(document.querySelector('[role="dialog"]')).backgroundColor ===
        'rgb(88, 28, 135)',
    );
    await page.waitForFunction(
      () =>
        getComputedStyle(
          [...document.querySelectorAll('button')].find(
            (element) => element.textContent === 'Change color theme',
          ),
        ).backgroundColor === 'rgb(220, 38, 38)',
    );
    assert.equal((await computed(action)).background, 'rgb(220, 38, 38)');
    for (const name of ['Modal search', 'Modal tags']) {
      const input = page.getByRole('combobox', { name });
      await input.click();
      const option = page.getByRole('option', { name: 'Second option', exact: true });
      await option.waitFor();
      await option.click({ trial: true });
      await page.screenshot({
        path: path.join(
          root,
          `output/playwright/${name.replaceAll(' ', '-')}-${viewport.width}.png`,
        ),
      });
      assert.equal(
        await option.evaluate((element) => {
          const bounds = element.getBoundingClientRect();
          return element.contains(
            document.elementFromPoint(bounds.x + bounds.width / 2, bounds.y + bounds.height / 2),
          );
        }),
        true,
        `${name} option must be visible and clickable`,
      );
      await option.click();
      if (name === 'Modal search') assert.equal(await input.inputValue(), 'Second option');
      else assert.equal(await page.getByRole('button', { name: 'Remove two' }).count(), 1);
      await input.click();
      await page.keyboard.press('Escape');
      assert.equal(await input.getAttribute('aria-expanded'), 'false');
      assert.equal(await dialog.count(), 1, 'Escape closes the menu first');
    }
    await page.screenshot({
      path: path.join(root, `output/playwright/theme-composition-${viewport.width}.png`),
    });
    await page.keyboard.press('Escape');
    await dialog.waitFor({ state: 'hidden' });
    await page.getByRole('button', { name: 'Open compat' }).click();
    assert.equal(
      (await computed(page.getByRole('button', { name: 'Compat action' }))).font,
      'monospace',
    );
    await page.keyboard.press('Escape');
  }
  assert.deepEqual(failures, []);
  console.log(
    'Browser checks passed: tokens, density, nested themes, Field, formal/compat portals, and modal menus at desktop and mobile widths.',
  );
} finally {
  await browser?.close();
  await server.close();
}
