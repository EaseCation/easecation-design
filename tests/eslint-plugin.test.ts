import { Linter } from 'eslint';
import easeDesign from '../eslint.js';

function lint(code: string, rules: Record<string, Linter.RuleSeverity>) {
  const linter = new Linter({ configType: 'flat' });
  return linter.verify(
    code,
    [
      {
        files: ['**/*.jsx'],
        languageOptions: {
          ecmaVersion: 2022,
          sourceType: 'module',
          parserOptions: { ecmaFeatures: { jsx: true } },
        },
        plugins: { '@easecation/design': easeDesign },
        rules,
      },
    ],
    { filename: 'example.jsx' },
  );
}

it('rejects raw controls while allowing ordinary semantic markup', () => {
  const messages = lint(
    `export const Example = () => <section><button>Save</button><p>Ready</p></section>`,
    { '@easecation/design/no-raw-ui-elements': 'error' },
  );
  expect(messages).toHaveLength(1);
  expect(messages[0]?.message).toContain('Button or IconButton');
});

it('rejects visual overrides but permits layout classes on design components', () => {
  const messages = lint(
    `import { Button } from '@easecation/design';
     export const Example = () => <><Button className="ml-auto w-full">Save</Button><Button className="rounded-xl bg-red-500">Delete</Button></>`,
    { '@easecation/design/no-visual-overrides': 'error' },
  );
  expect(messages).toHaveLength(1);
  expect(messages[0]?.message).toContain('rounded-xl');
});

it('rejects compatibility imports only in strict migrations', () => {
  const messages = lint(
    `import { Button } from '@easecation/design/compat'; export const Example = () => <Button />`,
    { '@easecation/design/no-compat-imports': 'error' },
  );
  expect(messages).toHaveLength(1);
});
