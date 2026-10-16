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
  configFile: false,
  plugins: [react()],
  cacheDir: path.join(root, 'node_modules/.vite/pagination'),
  optimizeDeps: { entries: ['tests/browser/pagination.html'] },
  server: { host: '127.0.0.1', port: 0 },
});
let browser;
const results = [];
try {
  await server.listen();
  browser = await chromium.launch();
  for (const width of [320, 390, 768, 1280])
    for (const theme of ['light', 'dark']) {
      const context = await browser.newContext({
        viewport: { width, height: 900 },
        hasTouch: width < 768,
        colorScheme: theme,
      });
      try {
        const page = await context.newPage();
        const errors = [];
        page.on('pageerror', (error) => errors.push(error.message));
        await page.goto(
          `${server.resolvedUrls.local[0]}tests/browser/pagination.html?theme=${theme}`,
        );
        const known = page.getByTestId('known');
        await known.getByRole('button', { name: '下一页' }).click();
        await known.getByRole('button', { name: '第 2 页' }).waitFor({ state: 'visible' });
        const jump = known.getByRole('spinbutton', { name: '跳至页码' });
        await jump.fill('12');
        await jump.press('Enter');
        assert.equal(
          await known.getByRole('button', { name: '第 12 页' }).getAttribute('aria-current'),
          'page',
        );
        await known.getByRole('combobox', { name: '每页条数' }).click();
        await page.getByRole('option', { name: '50 条/页' }).click();
        assert.equal(
          await known.getByRole('button', { name: '第 1 页' }).getAttribute('aria-current'),
          'page',
        );
        const cursor = page.getByTestId('cursor');
        await cursor.getByRole('button', { name: '下一页' }).click();
        await page.getByRole('button', { name: 'Toggle pending' }).click();
        assert.ok(await cursor.getByRole('button', { name: '下一页' }).isDisabled());
        assert.ok(await cursor.getByRole('button', { name: '上一页' }).isDisabled());
        assert.equal(await cursor.locator('.ec-pagination__total').count(), 0);
        assert.equal(
          await page
            .locator('table[aria-label="Records"] tbody tr')
            .evaluate((el) => getComputedStyle(el).display),
          width < 768 ? 'grid' : 'table-row',
        );
        assert.ok(
          await page.evaluate(
            () => document.documentElement.scrollWidth <= document.documentElement.clientWidth,
          ),
          `overflow ${width}/${theme}`,
        );
        assert.equal(
          await page.getByTestId('query-cards').locator('.ec-section-card').count(),
          width < 768 ? 1 : 0,
        );
        const panel = page.getByTestId('embedded-cards');
        const background = await panel.evaluate((el) => getComputedStyle(el).backgroundColor);
        assert.equal(
          background === 'rgba(0, 0, 0, 0)',
          width < 768,
          `panel surface ${width}/${theme}`,
        );
        if (width < 768) {
          const cards = panel.locator('.ec-section-card');
          assert.equal(await cards.count(), 2);
          const first = await cards.nth(0).boundingBox();
          const second = await cards.nth(1).boundingBox();
          assert.ok(second.y - first.y - first.height >= 12, 'record cards need a visible gap');
          assert.notEqual(
            await cards.nth(0).evaluate((el) => getComputedStyle(el).backgroundColor),
            background,
          );
          assert.ok(
            await cards
              .nth(0)
              .locator('h2')
              .evaluate((el) => el.scrollWidth <= el.clientWidth),
            'long card title must wrap',
          );
        }
        assert.deepEqual(errors, []);
        results.push({ width, theme, passed: true });
      } finally {
        await context.close();
      }
    }
  await fs.mkdir(path.join(root, 'output/playwright'), { recursive: true });
  await fs.writeFile(
    path.join(root, 'output/playwright/pagination.json'),
    JSON.stringify(results, null, 2),
  );
  console.log(`Pagination and mobile cards: ${results.length} combinations passed`);
} finally {
  await browser?.close();
  await server.close();
}
