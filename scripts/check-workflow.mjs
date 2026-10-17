import path from 'node:path';
import { createServer } from 'vite';
import react from '@vitejs/plugin-react';
import { chromium } from 'playwright';
import { checkRecordWorkflow } from '../tests/browser/check-record-workflow.mjs';
const root = path.resolve(import.meta.dirname, '..');
const server = await createServer({
  root,
  configFile: false,
  plugins: [react()],
  cacheDir: path.join(root, 'node_modules/.vite/workflow'),
  optimizeDeps: { entries: ['tests/browser/workflow.html'] },
  resolve: {
    alias: [{ find: /^\.\.\/\.\.\/src$/, replacement: path.join(root, 'dist/index.js') }],
  },
  server: { host: '127.0.0.1', port: 0 },
});
let browser;
try {
  await server.listen();
  browser = await chromium.launch();
  for (const width of [390, 1280])
    for (const theme of ['light', 'dark']) {
      const page = await browser.newPage({
        viewport: { width, height: 900 },
        hasTouch: width === 390,
        colorScheme: theme,
      });
      page.setDefaultTimeout(10000);
      await page.route('**/*', (route) =>
        new URL(route.request().url()).hostname === '127.0.0.1' ? route.continue() : route.abort(),
      );
      await page.goto(`${server.resolvedUrls.local[0]}tests/browser/workflow.html?theme=${theme}`);
      await checkRecordWorkflow(page);
      await page.close();
      console.log(`Workflow passed: ${width}px ${theme}`);
    }
} finally {
  await browser?.close();
  await server.close();
}
