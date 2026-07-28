import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import pixelmatch from 'pixelmatch';
import { PNG } from 'pngjs';
import { chromium } from 'playwright';

const scenes = [
  {
    name: 'components',
    sourceUrl: process.env.CONSOLE_NEO_REFERENCE_URL ?? 'http://127.0.0.1:8002/__design-reference',
    targetUrl:
      process.env.DESIGN_REFERENCE_URL ??
      'http://127.0.0.1:6006/iframe.html?id=migration-reference-harness--components&viewMode=story',
  },
  {
    name: 'patterns',
    sourceUrl:
      process.env.CONSOLE_NEO_PATTERN_REFERENCE_URL ??
      'http://127.0.0.1:8002/__design-pattern-reference',
    targetUrl:
      process.env.DESIGN_PATTERN_REFERENCE_URL ??
      'http://127.0.0.1:6006/iframe.html?id=migration-pattern-reference-harness--patterns&viewMode=story',
  },
  {
    name: 'overlay-menu',
    sourceUrl: 'http://127.0.0.1:8002/__design-overlay-reference?scene=menu',
    targetUrl:
      'http://127.0.0.1:6006/iframe.html?id=migration-overlay-reference-harness--menu&viewMode=story',
  },
  {
    name: 'overlay-dialog',
    sourceUrl: 'http://127.0.0.1:8002/__design-overlay-reference?scene=dialog',
    targetUrl:
      'http://127.0.0.1:6006/iframe.html?id=migration-overlay-reference-harness--dialog&viewMode=story',
  },
  {
    name: 'overlay-sheet',
    sourceUrl: 'http://127.0.0.1:8002/__design-overlay-reference?scene=sheet',
    targetUrl:
      'http://127.0.0.1:6006/iframe.html?id=migration-overlay-reference-harness--sheet&viewMode=story',
  },
  {
    name: 'overlay-popover',
    sourceUrl: 'http://127.0.0.1:8002/__design-overlay-reference?scene=popover',
    targetUrl:
      'http://127.0.0.1:6006/iframe.html?id=migration-overlay-reference-harness--popover-surface&viewMode=story',
  },
  {
    name: 'overlay-tooltip',
    sourceUrl: 'http://127.0.0.1:8002/__design-overlay-reference?scene=tooltip',
    targetUrl:
      'http://127.0.0.1:6006/iframe.html?id=migration-overlay-reference-harness--tooltip-surface&viewMode=story',
  },
  {
    name: 'scroll-area',
    sourceUrl: 'http://127.0.0.1:8002/__design-overlay-reference?scene=scroll',
    targetUrl:
      'http://127.0.0.1:6006/iframe.html?id=migration-overlay-reference-harness--scroll-surface&viewMode=story',
  },
  {
    name: 'toast',
    clickText: 'Show toast',
    sourceUrl: 'http://127.0.0.1:8002/__design-overlay-reference?scene=toast',
    targetUrl:
      'http://127.0.0.1:6006/iframe.html?id=migration-overlay-reference-harness--toast-surface&viewMode=story',
  },
  {
    name: 'app-shell',
    sourceUrl: 'http://127.0.0.1:8002/__design-shell-reference',
    targetUrl:
      'http://127.0.0.1:6006/iframe.html?id=migration-console-neo-app-shell--dashboard&viewMode=story',
  },
  {
    name: 'detail-workbench',
    sourceUrl: 'http://127.0.0.1:8002/__design-workbench-reference?scene=detail',
    targetUrl:
      'http://127.0.0.1:6006/iframe.html?id=migration-workbench-reference-harness--detail&viewMode=story',
  },
  {
    name: 'form-workbench',
    sourceUrl: 'http://127.0.0.1:8002/__design-workbench-reference?scene=form',
    targetUrl:
      'http://127.0.0.1:6006/iframe.html?id=migration-workbench-reference-harness--form&viewMode=story',
  },
  {
    name: 'inline-query-error',
    sourceUrl: 'http://127.0.0.1:8002/__design-workbench-reference?scene=error',
    targetUrl:
      'http://127.0.0.1:6006/iframe.html?id=migration-workbench-reference-harness--error&viewMode=story',
  },
  {
    name: 'datetime-picker',
    clickText: '2026-07-28 09:30',
    sourceUrl: 'http://127.0.0.1:8002/__design-filter-reference?scene=datetime',
    targetUrl:
      'http://127.0.0.1:6006/iframe.html?id=migration-filter-reference-harness--date-time&viewMode=story',
  },
  {
    name: 'filter-picker',
    clickText: 'Active',
    sourceUrl: 'http://127.0.0.1:8002/__design-filter-reference?scene=picker',
    targetUrl:
      'http://127.0.0.1:6006/iframe.html?id=migration-filter-reference-harness--picker&viewMode=story',
  },
  {
    name: 'filter-select',
    clickText: 'Active',
    clickSelector: '[role=combobox]',
    sourceUrl: 'http://127.0.0.1:8002/__design-filter-reference?scene=select',
    targetUrl:
      'http://127.0.0.1:6006/iframe.html?id=migration-filter-reference-harness--select&viewMode=story',
  },
  {
    name: 'query-data-table',
    sourceUrl: 'http://127.0.0.1:8002/__design-data-reference',
    targetUrl:
      'http://127.0.0.1:6006/iframe.html?id=migration-data-pattern-reference-harness--table&viewMode=story',
  },
  {
    name: 'responsive-dialog',
    clickText: 'Open responsive overlay',
    sourceUrl: 'http://127.0.0.1:8002/__design-data-reference',
    targetUrl:
      'http://127.0.0.1:6006/iframe.html?id=migration-data-pattern-reference-harness--overlay&viewMode=story',
  },
];
const requestedScenes = new Set((process.env.VISUAL_SCENES ?? '').split(',').filter(Boolean));
const activeScenes = requestedScenes.size
  ? scenes.filter((scene) => requestedScenes.has(scene.name))
  : scenes;
const outputDir = path.resolve(
  process.env.VISUAL_OUTPUT_DIR ?? 'output/playwright/visual-regression',
);
const viewports = [
  { name: 'desktop', width: 1440, height: 1000 },
  { name: 'mobile', width: 390, height: 844 },
];

async function waitForReference(page, url, scene) {
  const response = await page.goto(url, { waitUntil: 'networkidle', timeout: 30_000 });
  if (!response?.ok())
    throw new Error(`Reference page returned ${response?.status() ?? 'no response'}: ${url}`);
  await page.evaluate(async () => {
    if ('fonts' in globalThis.document) await globalThis.document.fonts.ready;
  });
  await page.addStyleTag({
    content: `*,*::before,*::after{animation-delay:0s!important;animation-duration:1ms!important;transition-duration:1ms!important;caret-color:transparent!important}`,
  });
  if (scene.clickSelector || scene.clickText) {
    const trigger = scene.clickSelector
      ? page.locator(scene.clickSelector).first()
      : page.getByRole(scene.clickRole ?? 'button', { name: scene.clickText });
    await trigger.click();
    await page.waitForTimeout(150);
  } else {
    await page.waitForTimeout(100);
  }
}

function compare(source, target) {
  if (source.width !== target.width || source.height !== target.height) {
    throw new Error(
      `Image dimensions differ: ${source.width}x${source.height} vs ${target.width}x${target.height}`,
    );
  }
  const diff = new PNG({ width: source.width, height: source.height });
  const pixels = source.width * source.height;
  let absolute = 0;
  let squared = 0;
  let pixelsGt8 = 0;
  let pixelsGt24 = 0;
  for (let index = 0; index < source.data.length; index += 4) {
    let max = 0;
    for (let channel = 0; channel < 3; channel += 1) {
      const delta = Math.abs(source.data[index + channel] - target.data[index + channel]);
      absolute += delta;
      squared += delta * delta;
      max = Math.max(max, delta);
    }
    if (max > 8) pixelsGt8 += 1;
    if (max > 24) pixelsGt24 += 1;
  }
  const changedPixels = pixelmatch(
    source.data,
    target.data,
    diff.data,
    source.width,
    source.height,
    {
      threshold: 0.1,
      includeAA: true,
      diffColor: [255, 40, 40],
      diffColorAlt: [255, 130, 0],
      alpha: 0.7,
    },
  );
  return {
    diff,
    metrics: {
      mae: absolute / (pixels * 3),
      rmse: Math.sqrt(squared / (pixels * 3)),
      pixelsGt8: pixelsGt8 / pixels,
      pixelsGt24: pixelsGt24 / pixels,
      pixelmatchRatio: changedPixels / pixels,
    },
  };
}

await mkdir(outputDir, { recursive: true });
const browser = await chromium.launch({ headless: true });
const results = {};
try {
  for (const scene of activeScenes) {
    results[scene.name] = {};
    for (const viewport of viewports) {
      const context = await browser.newContext({
        viewport: { width: viewport.width, height: viewport.height },
        deviceScaleFactor: 1,
        colorScheme: 'light',
        reducedMotion: 'reduce',
      });
      const sourcePage = await context.newPage();
      await waitForReference(sourcePage, scene.sourceUrl, scene);
      const sourcePath = path.join(outputDir, `source-${scene.name}-${viewport.name}.png`);
      await sourcePage.screenshot({ path: sourcePath, animations: 'disabled' });

      const targetPage = await context.newPage();
      await waitForReference(targetPage, scene.targetUrl, scene);
      const targetPath = path.join(outputDir, `target-${scene.name}-${viewport.name}.png`);
      await targetPage.screenshot({ path: targetPath, animations: 'disabled' });

      const source = PNG.sync.read(
        await import('node:fs/promises').then(({ readFile }) => readFile(sourcePath)),
      );
      const target = PNG.sync.read(
        await import('node:fs/promises').then(({ readFile }) => readFile(targetPath)),
      );
      const { diff, metrics } = compare(source, target);
      await writeFile(
        path.join(outputDir, `diff-${scene.name}-${viewport.name}.png`),
        PNG.sync.write(diff),
      );
      results[scene.name][viewport.name] = Object.fromEntries(
        Object.entries(metrics).map(([key, value]) => [key, Number(value.toFixed(6))]),
      );
      await context.close();
    }
  }
} finally {
  await browser.close();
}

const report = {
  generatedAt: new Date().toISOString(),
  scenes: activeScenes,
  viewports,
  results,
};
await writeFile(
  path.join(outputDir, 'metrics.json'),
  `${JSON.stringify(report, null, 2)}\n`,
  'utf8',
);
console.log(JSON.stringify(report, null, 2));

if (process.env.VISUAL_ENFORCE === '1') {
  const failed = Object.entries(results).flatMap(([scene, viewportsResult]) =>
    Object.entries(viewportsResult)
      .filter(([, metrics]) => metrics.pixelsGt24 > 0.02)
      .map(([viewport]) => `${scene}/${viewport}`),
  );
  if (failed.length) {
    console.error(`Visual threshold exceeded: ${failed.join(', ')}`);
    process.exitCode = 1;
  }
}
