import fs from 'node:fs/promises';
import path from 'node:path';
import { createHash } from 'node:crypto';
const root = path.resolve(import.meta.dirname, '..');
const snapshot = JSON.parse(
  await fs.readFile(path.join(root, 'migration', 'console-neo.tokens.json'), 'utf8'),
);
const css = await fs.readFile(path.join(root, 'src', 'styles', 'tokens.css'), 'utf8');
function block(selector) {
  const marker = selector + ' {';
  const start = css.indexOf(marker);
  if (start < 0) throw new Error(`Missing selector ${selector}`);
  let index = start + marker.length,
    depth = 1;
  for (; index < css.length && depth; index += 1) {
    if (css[index] === '{') depth += 1;
    else if (css[index] === '}') depth -= 1;
  }
  const body = css.slice(start + marker.length, index - 1);
  return Object.fromEntries(
    [...body.matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g)].map((match) => [match[1], match[2].trim()]),
  );
}
const actual = {
  light: block("[data-ec-theme='light']"),
  dark: block("[data-ec-theme='dark']"),
  blackGold: block("[data-ec-color-theme='black-gold']"),
};
const normalizeCssValue = (value) =>
  value
    .replace(/-?(?:\d+\.\d+|\.\d+)/g, (number) => String(Number(number)))
    .replace(/\s+/g, ' ')
    .trim();
const errors = [];
for (const mode of ['light', 'dark', 'blackGold'])
  for (const [name, value] of Object.entries(snapshot[mode]))
    if (
      actual[mode][name] === undefined ||
      normalizeCssValue(actual[mode][name]) !== normalizeCssValue(value)
    )
      errors.push(
        `${mode} ${name}: expected ${value}, received ${actual[mode][name] ?? '<missing>'}`,
      );
const manifest = JSON.parse(
  await fs.readFile(path.join(root, 'migration', 'manifest.json'), 'utf8'),
);
const normalizeSource = (content) => content.replace(/\r\n/g, '\n');
const source = process.env.CONSOLE_NEO_ROOT ?? path.resolve(root, '..', 'easecation-console-neo');
const sourceTheme = path.join(source, 'packages', 'tokens', 'src', 'theme.css');
try {
  const content = normalizeSource(await fs.readFile(sourceTheme, 'utf8'));
  const hash = createHash('sha256').update(content).digest('hex');
  if (hash !== snapshot.sha256)
    errors.push('Console Neo token source changed; run migration sync before continuing.');
  for (const [name, relative] of Object.entries(manifest.componentSources)) {
    const content = normalizeSource(await fs.readFile(path.join(source, relative), 'utf8'));
    const hash = createHash('sha256').update(content).digest('hex');
    if (hash !== manifest.componentHashes[name])
      errors.push(`Console Neo ${name} source changed; review migration status.`);
  }
} catch (error) {
  if (error.code !== 'ENOENT') throw error;
}
if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}
console.log(
  `Visual migration valid: ${Object.keys(snapshot.light).length} light, ${Object.keys(snapshot.dark).length} dark, ${Object.keys(snapshot.blackGold).length} black-gold tokens.`,
);
