import fs from 'node:fs/promises';
import path from 'node:path';
import Ajv from 'ajv';
import { storyNameFromExport, toId } from 'storybook/internal/csf';
import ts from 'typescript';

const root = path.resolve(import.meta.dirname, '..');
const schema = JSON.parse(
  await fs.readFile(path.join(root, 'registry', 'component.schema.json'), 'utf8'),
);
const registry = JSON.parse(
  await fs.readFile(path.join(root, 'registry', 'components.json'), 'utf8'),
);
const ajv = new Ajv({ allErrors: true });
const validate = ajv.compile(schema);

if (!validate(registry)) {
  console.error(validate.errors);
  process.exit(1);
}

const names = registry.components.map((component) => component.name);
if (new Set(names).size !== names.length) {
  throw new Error('Registry contains duplicate component names.');
}

const tokenCss = await fs.readFile(path.join(root, 'src', 'styles', 'tokens.css'), 'utf8');
const declaredTokens = new Set(
  [...tokenCss.matchAll(/(--[a-z][a-z0-9-]*)(?=\s*:)/g)].map((match) => match[1]),
);

for (const component of registry.components) {
  const documentation = path.join(root, 'docs', 'components', `${component.name}.md`);
  try {
    await fs.access(documentation);
  } catch {
    throw new Error(`Missing component documentation: docs/components/${component.name}.md`);
  }

  for (const token of component.tokens) {
    if (!declaredTokens.has(token)) {
      throw new Error(`${component.name} references an undefined token: ${token}`);
    }
  }
}

const documentedComponents = (await fs.readdir(path.join(root, 'docs', 'components')))
  .filter((file) => file.endsWith('.md'))
  .map((file) => path.basename(file, '.md'));
for (const documented of documentedComponents) {
  if (!names.includes(documented)) {
    throw new Error(`Component documentation is not registered: docs/components/${documented}.md`);
  }
}

async function collectStoryFiles(directory) {
  const entries = await fs.readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await collectStoryFiles(fullPath)));
    } else if (/\.stories\.tsx?$/.test(entry.name)) {
      files.push(fullPath);
    }
  }
  return files;
}

function unwrapExpression(expression) {
  let current = expression;
  while (
    ts.isSatisfiesExpression(current) ||
    ts.isAsExpression(current) ||
    ts.isParenthesizedExpression(current)
  ) {
    current = current.expression;
  }
  return current;
}

function readMetaTitle(sourceFile) {
  const declarations = new Map();
  let defaultExport;

  for (const statement of sourceFile.statements) {
    if (ts.isVariableStatement(statement)) {
      for (const declaration of statement.declarationList.declarations) {
        if (ts.isIdentifier(declaration.name) && declaration.initializer) {
          declarations.set(declaration.name.text, declaration.initializer);
        }
      }
    } else if (ts.isExportAssignment(statement) && !statement.isExportEquals) {
      defaultExport = statement.expression;
    }
  }

  const metaExpression =
    defaultExport && ts.isIdentifier(defaultExport)
      ? declarations.get(defaultExport.text)
      : defaultExport;
  if (!metaExpression) return undefined;

  const meta = unwrapExpression(metaExpression);
  if (!ts.isObjectLiteralExpression(meta)) return undefined;
  const title = meta.properties.find(
    (property) =>
      ts.isPropertyAssignment(property) &&
      ((ts.isIdentifier(property.name) && property.name.text === 'title') ||
        (ts.isStringLiteral(property.name) && property.name.text === 'title')),
  );
  if (!title || !ts.isPropertyAssignment(title) || !ts.isStringLiteral(title.initializer)) {
    return undefined;
  }
  return title.initializer.text;
}

const storyIds = new Set();
for (const storyFile of await collectStoryFiles(path.join(root, 'stories'))) {
  const source = await fs.readFile(storyFile, 'utf8');
  const sourceFile = ts.createSourceFile(
    storyFile,
    source,
    ts.ScriptTarget.Latest,
    true,
    storyFile.endsWith('.tsx') ? ts.ScriptKind.TSX : ts.ScriptKind.TS,
  );
  const title = readMetaTitle(sourceFile);
  if (!title) {
    throw new Error(`Story file has no static meta title: ${path.relative(root, storyFile)}`);
  }

  for (const statement of sourceFile.statements) {
    if (
      !ts.isVariableStatement(statement) ||
      !statement.modifiers?.some((modifier) => modifier.kind === ts.SyntaxKind.ExportKeyword)
    ) {
      continue;
    }
    for (const declaration of statement.declarationList.declarations) {
      if (ts.isIdentifier(declaration.name)) {
        storyIds.add(toId(title, storyNameFromExport(declaration.name.text)));
      }
    }
  }
}

for (const component of registry.components) {
  for (const story of component.stories) {
    if (!storyIds.has(story)) {
      throw new Error(`${component.name} references an unknown Storybook ID: ${story}`);
    }
  }
}

console.log(
  `Registry valid: ${names.length} components, ${declaredTokens.size} tokens, ${storyIds.size} stories.`,
);
