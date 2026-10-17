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
  // Check text colors on real browser-rendered surfaces in both themes.
  const semanticContrast = await page.evaluate(() => {
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = 1;
    const context = canvas.getContext('2d');
    const rgb = (color, under = 'transparent') => {
      context.clearRect(0, 0, 1, 1);
      context.fillStyle = under;
      context.fillRect(0, 0, 1, 1);
      context.fillStyle = color;
      context.fillRect(0, 0, 1, 1);
      return [...context.getImageData(0, 0, 1, 1).data].slice(0, 3);
    };
    const luminance = (color, under) =>
      rgb(color, under).reduce((sum, value, index) => {
        const channel = value / 255;
        return (
          sum +
          (channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4) *
            [0.2126, 0.7152, 0.0722][index]
        );
      }, 0);
    const results = [];
    for (const theme of ['light', 'dark']) {
      const root = document.createElement('div');
      root.className = 'ec-root';
      root.dataset.ecTheme = theme;
      document.body.append(root);
      for (const surface of ['bg', 'panel', 'surface-muted']) {
        root.style.backgroundColor = `var(--ec-color-${surface})`;
        for (const tone of ['primary', 'warning', 'success', 'info', 'danger']) {
          const text = document.createElement('span');
          text.style.color = `var(--ec-color-text-${tone})`;
          root.append(text);
          const foreground = luminance(getComputedStyle(text).color);
          const background = luminance(getComputedStyle(root).backgroundColor);
          results.push({
            theme,
            surface,
            tone,
            ratio:
              (Math.max(foreground, background) + 0.05) / (Math.min(foreground, background) + 0.05),
          });
          text.remove();
          for (const appearance of ['outline', 'soft']) {
            const badge = document.createElement('span');
            badge.className = 'ec-status-badge';
            badge.dataset.tone = tone;
            badge.dataset.appearance = appearance;
            badge.textContent = 'Status';
            root.append(badge);
            const style = getComputedStyle(badge);
            const foreground = luminance(style.color);
            const background = luminance(
              style.backgroundColor,
              getComputedStyle(root).backgroundColor,
            );
            results.push({
              theme,
              surface,
              tone: `${tone} ${appearance}`,
              ratio:
                (Math.max(foreground, background) + 0.05) /
                (Math.min(foreground, background) + 0.05),
            });
            badge.remove();
          }
        }
      }
      root.remove();
    }
    return results;
  });
  assert.deepEqual(
    semanticContrast.filter(({ ratio }) => ratio < 4.5),
    [],
    'Status text and badges must meet 4.5:1 contrast on their rendered surfaces',
  );
  // Check painted text, not only element boxes: nowrap text can escape a correctly sized span.
  for (const width of [1440, 768, 390, 320]) {
    await page.setViewportSize({ width, height: 900 });
    for (const theme of ['light', 'dark']) {
      const section = page.locator(`#table-${theme}`);
      assert.equal(
        await section.locator('[data-ec-theme]').first().getAttribute('data-ec-theme'),
        theme,
      );
      if (width >= 768) {
        for (const layout of ['auto', 'fixed']) {
          await section.locator('table').evaluate((table, layout) => {
            table.style.tableLayout = layout;
          }, layout);
          const escaped = await section.locator('table').evaluate((table) => {
            const failures = [];
            for (const cell of table.querySelectorAll('th, td')) {
              const bounds = cell.getBoundingClientRect();
              for (const control of cell.querySelectorAll('.ec-status-badge, button')) {
                const rect = control.getBoundingClientRect();
                if (rect.left < bounds.left - 1 || rect.right > bounds.right + 1) {
                  failures.push(control.textContent.slice(0, 40));
                }
              }
              const walker = document.createTreeWalker(cell, NodeFilter.SHOW_TEXT);
              while (walker.nextNode()) {
                const text = walker.currentNode;
                // Truncation is allowed only when an ancestor actually clips the text.
                let clipped = false;
                for (let el = text.parentElement; el && el !== cell; el = el.parentElement) {
                  if (['hidden', 'clip'].includes(getComputedStyle(el).overflowX)) clipped = true;
                }
                if (clipped || getComputedStyle(cell).overflowX === 'hidden') continue;
                const range = document.createRange();
                range.selectNodeContents(text);
                for (const rect of range.getClientRects()) {
                  if (rect.left < bounds.left - 1 || rect.right > bounds.right + 1) {
                    failures.push(text.textContent.slice(0, 40));
                  }
                }
              }
            }
            return failures;
          });
          assert.deepEqual(
            escaped,
            [],
            `${theme} ${width} ${layout}: text must stay in its column`,
          );
          const address = section.locator('tbody tr').first().locator('td').nth(2).locator('span');
          assert.equal(await address.getAttribute('title'), await address.textContent());
          assert.ok(await address.evaluate((el) => el.scrollWidth > el.clientWidth));
        }
        // Force horizontal scrolling and verify pinned actions remain visible and operable.
        await section.locator('table').evaluate((table) => {
          table.style.tableLayout = 'auto';
          table.style.minWidth = '1400px';
        });
        await section.scrollIntoViewIfNeeded();
        for (const end of [false, true]) {
          await section.locator('.ec-query-table__scroll').evaluate((el, end) => {
            el.scrollLeft = end ? el.scrollWidth : 0;
          }, end);
          const edit = section.getByRole('button', { name: 'Edit', exact: true }).first();
          await edit.click({ trial: true });
          await edit.focus();
          assert.equal(await edit.evaluate((el) => el === document.activeElement), true);
        }
        await section.locator('table').evaluate((table) => {
          table.style.minWidth = '';
        });
      } else {
        await section.locator('[data-query-layout="cards"]').waitFor();
        assert.equal(await section.locator('table').count(), 0);
      }
      const badge = section.locator('.ec-status-badge[data-tone="primary"]').first();
      const colors = await badge.evaluate((el) => {
        const probe = document.createElement('span');
        probe.style.color = 'var(--ec-color-text-primary)';
        el.append(probe);
        const expected = getComputedStyle(probe).color;
        probe.remove();
        return {
          text: getComputedStyle(el).color,
          expected,
          background: getComputedStyle(el).backgroundColor,
        };
      });
      assert.equal(colors.text, colors.expected, `${theme}: primary badge uses theme text token`);
      assert.equal(colors.background, 'rgba(0, 0, 0, 0)');
      assert.ok(
        await section
          .locator('[data-long-status] .ec-status-badge')
          .evaluate((el) => el.getBoundingClientRect().width <= 80),
      );
      await section.screenshot({
        path: path.join(root, `output/playwright/table-${theme}-${width}.png`),
      });
    }
    assert.equal(
      await page.evaluate(() => document.documentElement.scrollWidth > innerWidth),
      false,
    );
  }
  // A live token override must update brand states.
  // ThemeProvider's root carries the token scope (avoid depending on its element name).
  const scope = page.locator('#table-light [data-ec-theme]').first();
  await scope.evaluate((el) => el.style.setProperty('--ec-color-text-primary', 'rgb(120 50 20)'));
  assert.equal(
    await page
      .locator('#table-light .ec-status-badge[data-tone="primary"]')
      .first()
      .evaluate((el) => getComputedStyle(el).color),
    'rgb(120, 50, 20)',
  );
  await scope.evaluate((el) => el.style.removeProperty('--ec-color-text-primary'));
  await page.setViewportSize({ width: 1280, height: 800 });
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
      // The menu now has an exit animation. Wait for its layer to leave before
      // sending Escape to the containing modal.
      await page.getByRole('listbox', { name, exact: true }).waitFor({ state: 'detached' });
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
    'Browser checks passed: tokens, density, nested themes, Field, portals, modal menus, long table content, sticky actions, and brand badges at desktop and mobile widths.',
  );
} finally {
  await browser?.close();
  await server.close();
}
