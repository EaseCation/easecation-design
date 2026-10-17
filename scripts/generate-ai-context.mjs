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
  '## Development context',
  '- Admission and ownership: docs/guide/governance.md',
  '- Architecture: docs/ai/architecture.md',
  '- Release and upgrade guidance: docs/guide/upgrading.md',
  '- Component development: docs/ai/component-development.md',
  '- Consumer usage: docs/ai/usage.md',
  '- Integration and regression lessons: docs/ai/integration-lessons.md',
  '',
  '## Components',
  ...registry.components.map(
    (item) =>
      `- ${item.name} [${item.maturity}/${item.category}]: ${item.importPath}; platforms: ${item.platforms.join(', ')}`,
  ),
  '',
  '## Rules',
  '- Reuse registered components before creating new UI.',
  '- Follow docs/guide/governance.md for UI ownership, reuse and migration rules.',
  '- Keep APIs domain-neutral and SSR-safe.',
  '- Do not import EaseCation private APIs, URLs, logos or restricted assets.',
  '- Use `pnpm ai:validate` for fast validation; run required full library and consumer checks before delivery.',
  '- Verify source, published package, consumer resolution and website/Storybook versions separately.',
];
await fs.writeFile(new URL('../llms.txt', import.meta.url), lines.join('\n') + '\n');
console.log('Generated llms.txt.');
