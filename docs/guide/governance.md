# UI governance

Visual consistency is an ownership rule, not a request to avoid all CSS. Applications own layout
and domain composition. EaseCation Design owns the appearance and behavior of shared controls,
surfaces, feedback, navigation, and data-display patterns.

## Required order of implementation

1. Reuse a formal component from `@easecation/design`.
2. Express a supported visual state with component props.
3. Customize product identity with semantic ThemeProvider tokens.
4. Compose components with application-owned layout styles.
5. Extend the existing EaseCation Design API when a generic capability is missing; add a new component only when no existing responsibility fits.
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

## Admission and ownership

The default is to place reusable visual, interaction, and accessibility behavior in EaseDesign.
Sharing only markup or CSS while copying the behavior into each consumer is incomplete.

A capability belongs here when all of the following hold:

1. Its inputs and callbacks can use domain-neutral names and types.
2. It works without business APIs, credentials, authorization rules, application routing, or a particular persistence policy.
3. It has at least two concrete call sites, or directly completes an existing design-system responsibility such as accessible input, focus, motion, or responsive behavior. Do not wait for a second application to fix a shared accessibility defect.
4. Its public API stays small and its success, failure, pending, disabled, and cancellation behavior can be demonstrated and tested where applicable.

| EaseDesign owns                                                                                 | Applications own                                                                        |
| ----------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| Motion tokens, system preference subscription, press behavior and pointer cancellation          | Whether a business action is available and what it does                                 |
| Confirmation presentation, pending interaction lock, focus restoration and failure presentation | The mutation, permission check, error mapping and retry safety                          |
| Loading, error, empty and content presentation; table/mobile layout                             | Fetching, query keys, cache isolation, cancellation and response ordering               |
| Generic draft/apply/reset/cancel mechanics and form feedback                                    | Filter fields, query serialization, validation, partial-save reconciliation and storage |
| Unsaved-change confirmation presentation                                                        | Dirty-state meaning, route blocking, browser unload handling and draft persistence      |
| Date display with explicit locale/timezone inputs, if a shared display API is needed            | Selection of user or organization timezone and backend timestamp semantics              |

Prefer extending or composing formal components over adding a universal wrapper. A repeated
business workflow is not automatically a design component. Use documentation and composition
examples when existing primitives already express the desired behavior.

## Proposal and completion standard

For each extraction, record the current call sites, the duplicated behavior or defect, the existing
API considered, the smallest proposed change, the business responsibilities left behind, and
acceptance checks. Candidate names are proposals, not public APIs until implemented.

Check applicable light/dark themes, density, narrow/touch layouts, keyboard/focus behavior, SSR
hydration, normal/reduced motion including live preference changes, and slow/failed/cancelled
interactions. Network-dependent examples and tests use fixtures, never private business services.
Use tokens for both CSS and JavaScript motion; ensure preference changes and pointer cancellation
do not leave a pressed state behind.

Ship the library contract with its documentation, stories, registry metadata when applicable,
meaningful tests, and changeset. Then migrate real consumers, remove duplicate local code, verify
reproducible dependency installation, and run their required checks. A local shim or vendored
preview must record its source and removal condition; it is not the final shared solution.

A local exception must state its product-specific boundary, or explain the temporary API gap and
planned replacement. Record this in the relevant code or change description. Do not introduce
blanket lint exemptions or require extra user approval for routine implementation choices.

## Semantic text colors

Use `--ec-color-text-warning`, `--ec-color-text-success`, `--ec-color-text-info`, and
`--ec-color-text-danger` for standalone status text. The matching `--ec-color-warning`,
`--ec-color-success`, `--ec-color-info`, and `--ec-color-danger` tokens are fill colors,
not small-text colors. Text tokens follow the active palette and foreground overrides.
Use `StatusBadge` for labeled states and `Alert` for notices instead of custom color pairs.

## Package size budget

`pnpm pack:check` measures gzip (level 9) and Brotli (quality 11) bytes against
`scripts/package-size-baseline.json`. These deterministic measurements approximate
compressed delivery size, not an application's final tree-shaken bundle.
The named entry files and the sum of all runtime JS/CSS files are checked; shared
chunks are included in the total. Source maps and declarations are not runtime assets.

Growth above the larger of 256 bytes or 2% warns. Growth above the larger of 2 KiB
or 10% fails. Smaller changes and reductions pass. Both encodings are checked.
Package-content checks and broad archive/unpacked safety limits remain enforced.

The initial baseline comes from the released 0.16.0 archive. Normal checks never
rewrite it. For an accepted feature increase, include measured old/new sizes and
the reason in the review, then update the affected baseline values explicitly.
Do not rebaseline automatically on every build: incremental growth must accumulate.

## Loading feedback

Use shared skeletons or spinners without redundant visible “Loading” text. Keep loading labels in
accessible names (`label` / `aria-label`). Buttons retain their action name while `loading` shows
the shared spinner. Preserve meaningful progress, error messages, and domain statuses.
