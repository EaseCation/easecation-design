import fs from 'node:fs/promises';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const forbidden = [
  /easecation-console-neo/i,
  /https?:\/\/(?!example\.com)/i,
  /NPM_TOKEN|BEGIN (RSA |OPENSSH )?PRIVATE KEY/,
];
const extensions = new Set(['.ts', '.tsx', '.css', '.json']);

async function walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...(await walk(full)));
    else if (extensions.has(path.extname(entry.name))) files.push(full);
  }
  return files;
}

for (const file of await walk(path.join(root, 'src'))) {
  const content = await fs.readFile(file, 'utf8');
  for (const pattern of forbidden) {
    if (pattern.test(content)) {
      console.error(`Forbidden public-runtime content in ${path.relative(root, file)}: ${pattern}`);
      process.exit(1);
    }
  }
}
const pkg = JSON.parse(await fs.readFile(path.join(root, 'package.json'), 'utf8'));
const allowedDependencies = new Set([
  '@fontsource-variable/geist',
  '@tanstack/react-table',
  '@fontsource-variable/outfit',
  'lucide-react',
  'radix-ui',
  'sonner',
]);
const unreviewed = Object.keys(pkg.dependencies ?? {}).filter(
  (name) => !allowedDependencies.has(name),
);
if (unreviewed.length) {
  console.error(`Runtime dependencies require explicit review: ${unreviewed.join(', ')}`);
  process.exit(1);
}
console.log('Open-source boundary check passed.');
