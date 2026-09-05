import fs from 'node:fs/promises';
import path from 'node:path';
const raw = process.argv[2];
if (!raw || !/^[A-Z][A-Za-z0-9]+$/.test(raw)) {
  console.error('Usage: pnpm generate:component ComponentName');
  process.exit(1);
}
const root = path.resolve(import.meta.dirname, '..');
const dir = path.join(root, 'src', 'components', raw);
try {
  await fs.access(dir);
  console.error(`${raw} already exists.`);
  process.exit(1);
} catch {
  /* The target directory is available. */
}
await fs.mkdir(dir, { recursive: true });
await fs.writeFile(
  path.join(dir, `${raw}.tsx`),
  `import { forwardRef, type HTMLAttributes } from 'react';\nexport interface ${raw}Props extends HTMLAttributes<HTMLDivElement> {}\nexport const ${raw} = forwardRef<HTMLDivElement, ${raw}Props>(function ${raw}({ className, ...props }, ref) {\n  return <div ref={ref} className={['ec-${raw.toLowerCase()}', className].filter(Boolean).join(' ')} {...props} />;\n});\n`,
);
await fs.writeFile(
  path.join(dir, `${raw}.test.tsx`),
  `import { render, screen } from '@testing-library/react';\nimport { ${raw} } from './${raw}';\nit('renders', () => { render(<${raw}>content</${raw}>); expect(screen.getByText('content')).toBeInTheDocument(); });\n`,
);
await fs.writeFile(
  path.join(dir, `${raw}.stories.tsx`),
  `import type { Meta, StoryObj } from '@storybook/react-vite';\nimport { ${raw} } from './${raw}';\nconst meta = { title: 'Experimental/${raw}', component: ${raw} } satisfies Meta<typeof ${raw}>;\nexport default meta;\ntype Story = StoryObj<typeof meta>;\nexport const Default: Story = { args: { children: '${raw}' } };\n`,
);
await fs.writeFile(path.join(dir, 'index.ts'), `export * from './${raw}';\n`);
await fs.mkdir(path.join(root, 'docs', 'components'), { recursive: true });
await fs.writeFile(
  path.join(root, 'docs', 'components', `${raw}.md`),
  `# ${raw}\n\n> Experimental. Complete API, accessibility, responsive behavior and tests before promotion.\n`,
);
const registryPath = path.join(root, 'registry', 'components.json');
const registry = JSON.parse(await fs.readFile(registryPath, 'utf8'));
registry.components.push({
  name: raw,
  importPath: '@easecation/design',
  category: 'display',
  maturity: 'experimental',
  platforms: ['web', 'ssr'],
  accessibility: [],
  tokens: [],
  stories: [`Experimental/${raw}`],
  deprecated: false,
});
await fs.writeFile(registryPath, JSON.stringify(registry, null, 2) + '\n');
console.log(`Generated ${raw}. Add its export to src/index.ts before use.`);
