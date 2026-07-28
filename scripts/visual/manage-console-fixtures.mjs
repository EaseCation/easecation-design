import { copyFile, mkdir, readFile, rm, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const action = process.argv[2];
if (!['install', 'cleanup'].includes(action)) {
  throw new Error('Usage: node scripts/visual/manage-console-fixtures.mjs <install|cleanup>');
}
const designRoot = path.resolve(import.meta.dirname, '../..');
const consoleRoot = path.resolve(
  process.env.CONSOLE_NEO_ROOT ?? path.join(designRoot, '..', 'easecation-console-neo'),
);
const routesFile = path.join(consoleRoot, 'apps/console/app/routes.ts');
const routesDir = path.join(consoleRoot, 'apps/console/app/routes');
const fixtureDir = path.join(designRoot, 'migration/console-neo-reference-routes');
const backupFile = path.join(designRoot, 'output/playwright/routes.ts.original');
const fixtures = [
  ['__design-reference', 'design-reference.tsx'],
  ['__design-pattern-reference', 'design-pattern-reference.tsx'],
  ['__design-overlay-reference', 'design-overlay-reference.tsx'],
  ['__design-shell-reference', 'design-shell-reference.tsx'],
  ['__design-workbench-reference', 'design-workbench-reference.tsx'],
  ['__design-filter-reference', 'design-filter-reference.tsx'],
  ['__design-data-reference', 'design-data-reference.tsx'],
];

await stat(routesFile);
if (action === 'install') {
  await mkdir(path.dirname(backupFile), { recursive: true });
  try {
    await stat(backupFile);
  } catch {
    await copyFile(routesFile, backupFile);
  }
  for (const [, name] of fixtures)
    await copyFile(path.join(fixtureDir, name), path.join(routesDir, name));
  let routes = await readFile(routesFile, 'utf8');
  const anchor = '  route("login", "routes/user/login.tsx"),';
  const lines = fixtures.map(([routePath, name]) => `  route("${routePath}", "routes/${name}"),`);
  if (!routes.includes(lines[0])) routes = routes.replace(anchor, `${anchor}\n${lines.join('\n')}`);
  await writeFile(routesFile, routes, 'utf8');
  console.log(`Installed Console Neo visual fixtures in ${consoleRoot}`);
} else {
  await copyFile(backupFile, routesFile);
  for (const [, name] of fixtures) await rm(path.join(routesDir, name), { force: true });
  console.log(`Removed Console Neo visual fixtures from ${consoleRoot}`);
}
