import fs from 'node:fs/promises';
const registry = JSON.parse(
  await fs.readFile(new URL('../registry/components.json', import.meta.url), 'utf8'),
);
const lines = [
  '# EaseCation Design AI index',
  '',
  'Public package: `@easecation/design`',
  'Runtime has no Tailwind, Router, Capacitor or business API dependency.',
  '',
  '## Components',
  ...registry.components.map(
    (item) =>
      `- ${item.name} [${item.maturity}/${item.category}]: ${item.importPath}; platforms: ${item.platforms.join(', ')}`,
  ),
  '',
  '## Rules',
  '- Reuse registered components before creating new UI.',
  '- Keep APIs domain-neutral and SSR-safe.',
  '- Do not import EaseCation private APIs, URLs, logos or restricted assets.',
  '- Run `pnpm ai:validate` before review.',
];
await fs.writeFile(new URL('../llms.txt', import.meta.url), lines.join('\n') + '\n');
console.log('Generated llms.txt.');
