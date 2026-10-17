import { readFileSync, readdirSync } from 'node:fs';
import { expect, it } from 'vitest';
import contract from '../src/tokens/contract.json';

it('component styles consume public tokens instead of bypassing ThemeProvider overrides', () => {
  const directory = `${process.cwd()}/src/styles/`;
  const aliases = new Set(Object.keys(contract.aliases));
  const bypasses: string[] = [];
  for (const file of readdirSync(directory).filter(
    (name) => name.endsWith('.css') && name !== 'tokens.css',
  )) {
    const css = readFileSync(directory + file, 'utf8');
    for (const match of css.matchAll(/var\((--[^),]+)/g)) {
      if (aliases.has(match[1])) bypasses.push(`${file}: ${match[1]}`);
    }
  }
  expect(bypasses).toEqual([]);
});
