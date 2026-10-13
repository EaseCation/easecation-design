import fs from 'node:fs/promises';
import path from 'node:path';
import ts from 'typescript';
import prettier from 'prettier';

const root = path.resolve(import.meta.dirname, '..');
const source = await fs.readFile(path.join(root, 'dist/index.d.ts'), 'utf8');
const tree = ts.createSourceFile('index.d.ts', source, ts.ScriptTarget.Latest, true);
const declarations = new Map();
for (const statement of tree.statements) {
  if (ts.isVariableStatement(statement)) {
    for (const declaration of statement.declarationList.declarations)
      declarations.set(declaration.name.getText(tree), statement);
  } else if (statement.name) declarations.set(statement.name.getText(tree), statement);
}
const registry = JSON.parse(await fs.readFile(path.join(root, 'registry/components.json'), 'utf8'));
const entrypoints = JSON.parse(
  await fs.readFile(path.join(root, 'registry/api-docs.json'), 'utf8'),
);
const options = await prettier.resolveConfig(path.join(root, 'package.json'));
const heading = '## TypeScript 公开声明';
for (const { name } of registry.components) {
  const target = path.join(root, 'docs/components', `${name}.md`);
  const existing = await fs.readFile(target, 'utf8');
  const selected = new Set();
  function include(identifier) {
    const declaration = declarations.get(identifier);
    if (!declaration || selected.has(declaration)) return;
    selected.add(declaration);
    function visit(node) {
      if (ts.isIdentifier(node) && node !== declaration.name) include(node.text);
      ts.forEachChild(node, visit);
    }
    ts.forEachChild(declaration, visit);
  }
  if (!declarations.has(name)) throw new Error(`Missing public declaration for ${name}`);
  for (const identifier of entrypoints[name] ?? [name]) {
    if (!declarations.has(identifier))
      throw new Error(`Missing public declaration for ${identifier}`);
    include(identifier);
  }
  for (const identifier of declarations.keys()) {
    if (
      identifier.startsWith(name) &&
      !registry.components.some(
        (component) => component.name !== name && identifier.startsWith(component.name),
      )
    )
      include(identifier);
  }
  const snippet = await prettier.format(
    [...selected].map((declaration) => declaration.getText(tree)).join('\n\n'),
    { ...options, parser: 'typescript' },
  );
  const content = await prettier.format(
    `${existing.split(heading)[0].trimEnd()}\n\n${heading}\n\n` +
      '以下内容由 `pnpm docs:generate` 从构建后的 `index.d.ts` 提取；CI 会检查声明与文档是否一致。\n\n' +
      `<!-- generated-api:start -->\n\n\`\`\`ts\n${snippet}\`\`\`\n\n<!-- generated-api:end -->\n`,
    { ...options, parser: 'markdown' },
  );
  if (process.argv.includes('--check')) {
    if (existing.replace(/\r\n/g, '\n') !== content)
      throw new Error(`docs/components/${name}.md is stale; run pnpm docs:generate.`);
  } else await fs.writeFile(target, content);
}
console.log('Public API documentation matches the built declarations.');
