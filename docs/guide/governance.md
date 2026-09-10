# UI governance

Visual consistency is an ownership rule, not a request to avoid all CSS. Applications own layout
and domain composition. EaseCation Design owns the appearance and behavior of shared controls,
surfaces, feedback, navigation, and data-display patterns.

## Required order of implementation

1. Reuse a formal component from `@easecation/design`.
2. Express a supported visual state with component props.
3. Customize product identity with semantic ThemeProvider tokens.
4. Compose components with application-owned layout styles.
5. Add a domain-neutral component or variant to EaseCation Design when the pattern repeats.
6. Use a documented local exception only for genuinely product-specific visualization.

Application code may use layout utilities for placement, width, grid, flex, overflow, and responsive
composition. It must not restyle a design component's color, border, radius, shadow, focus treatment,
or surface. A wrapper is preferred when a component needs external spacing or positioning.

## ESLint

The package provides flat-config presets:

```js
import easeDesign from '@easecation/design/eslint';

export default [
  easeDesign.configs.recommended,
  {
    files: ['src/**/*.{js,jsx,ts,tsx}'],
    rules: {
      // Enable after compatibility imports have been migrated.
      '@easecation/design/no-compat-imports': 'error',
    },
  },
];
```

`recommended` rejects raw button/input/select/textarea/table elements and appearance overrides on
imported design components. `strict` also rejects compatibility imports. Exceptions must be narrow,
local ESLint disables with a reason; directory-wide disables are not acceptable.

## Review standard

Every new public component needs typed props, semantic tokens, keyboard and focus behavior where
interactive, light/dark coverage, 320/390/768/desktop responsive review, tests, Storybook states,
registry metadata, documentation, and a changeset. Repeated consumer overrides are treated as a
missing API signal, not as permanent application CSS.
