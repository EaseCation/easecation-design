import { execSync } from 'node:child_process';
import fs from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const root = path.resolve(import.meta.dirname, '..');
const packageJson = JSON.parse(await fs.readFile(path.join(root, 'package.json'), 'utf8'));
const registry = JSON.parse(
  await fs.readFile(path.join(root, 'registry', 'components.json'), 'utf8'),
);

const output = execSync('npm pack --dry-run --json', {
  cwd: root,
  encoding: 'utf8',
});
const info = JSON.parse(output)[0];
const packedFiles = new Map(info.files.map((file) => [file.path, file]));

if (info.size > 350_000) {
  throw new Error(`Packed package is ${info.size} bytes; the limit is 350000 bytes.`);
}
if (info.unpackedSize > 1_200_000) {
  throw new Error(`Unpacked package is ${info.unpackedSize} bytes; the limit is 1200000 bytes.`);
}

const requiredFiles = [
  'dist/index.js',
  'dist/index.d.ts',
  'dist/compat.js',
  'dist/compat.d.ts',
  'dist/antd-compat.js',
  'dist/antd-compat.d.ts',
  'dist/tokens.js',
  'dist/tokens.d.ts',
  'dist/style.css',
  'README.md',
  'LICENSE',
  'NOTICE',
  'TRADEMARKS.md',
];

for (const required of requiredFiles) {
  if (!packedFiles.has(required)) {
    throw new Error(`Missing packed file: ${required}`);
  }
}

for (const forbidden of ['src/', 'tests/', '.env']) {
  if ([...packedFiles.keys()].some((name) => name.startsWith(forbidden))) {
    throw new Error(`Forbidden packed path: ${forbidden}`);
  }
}

function collectExportTargets(value) {
  if (typeof value === 'string') return [value];
  if (!value || typeof value !== 'object') return [];
  return Object.values(value).flatMap(collectExportTargets);
}

for (const target of collectExportTargets(packageJson.exports)) {
  const packedPath = target.replace(/^\.\//, '');
  if (!packedFiles.has(packedPath)) {
    throw new Error(`Package export points to a missing file: ${target}`);
  }
}

const fileSizeLimits = {
  'dist/index.js': 75_000,
  'dist/compat.js': 110_000,
  'dist/antd-compat.js': 75_000,
  'dist/tokens.js': 15_000,
  'dist/style.css': 130_000,
};

for (const [file, limit] of Object.entries(fileSizeLimits)) {
  const size = packedFiles.get(file).size;
  if (size > limit) {
    throw new Error(`${file} is ${size} bytes; the limit is ${limit} bytes.`);
  }
}

const publicApi = await import(pathToFileURL(path.join(root, 'dist', 'index.js')));
const antdCompat = await import(pathToFileURL(path.join(root, 'dist', 'antd-compat.js')));

for (const component of registry.components) {
  if (!(component.name in publicApi)) {
    throw new Error(`Registry component is missing from the package root: ${component.name}`);
  }
}

for (const symbol of ['Alert', 'ConfigProvider', 'AntButton']) {
  if (symbol in publicApi) {
    throw new Error(`Ant Design compatibility symbol leaked into the package root: ${symbol}`);
  }
}

for (const symbol of ['Alert', 'ConfigProvider', 'Button']) {
  if (!(symbol in antdCompat)) {
    throw new Error(`Ant Design compatibility entry is missing: ${symbol}`);
  }
}

const rootTypes = await fs.readFile(path.join(root, 'dist', 'index.d.ts'), 'utf8');
for (const component of ['Button', 'Input', 'Modal', 'Select']) {
  const anyDeclaration = new RegExp(`export declare (?:const|function) ${component}[^;]*\\bany\\b`);
  if (anyDeclaration.test(rootTypes)) {
    throw new Error(`Public declaration degraded to any: ${component}`);
  }
}

const style = await fs.readFile(path.join(root, 'dist', 'style.css'), 'utf8');
if (/@font-face|data:font\//i.test(style)) {
  throw new Error('Public CSS must not embed or load a font.');
}

console.log(
  `Package dry-run valid: ${info.files.length} files, ${info.size} bytes; public API and size budgets passed.`,
);
