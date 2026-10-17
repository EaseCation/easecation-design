# EaseDesign agent context

Own the public, domain-neutral React component library. Business APIs, routing, auth policy,
credentials, private assets and product data stay in consumers.

## Sources and ownership

- Read [UI governance](docs/guide/governance.md) and [integration lessons](docs/ai/integration-lessons.md)
  before shared UI work. Extend an existing responsibility before adding a component or abstraction.
- `src/tokens` / `src/styles`: typed tokens and styles; `src/theme`: theme/density runtime;
  `src/components`: accessible components; `src/platform`: SSR-safe Web/WebView behavior;
  `src/adapters`: optional host capabilities. Capacitor remains optional.
- `registry`: component metadata and schema; `stories`: behavior/composition scenes;
  `docs/ai`: Agent context. Use formal component names and neutral example data.
- Preserve existing work. Inspect branch, upstream and dirty files; source, npm, consumer lockfiles,
  website snapshots and Storybook are independent release states.

## Implementation and verification

- Reuse public components and semantic tokens. Keep browser globals out of module initialization.
  Test keyboard/focus, responsive layouts, loading/failure/cancel and reduced motion as applicable.
- Use synthetic fixtures without business requests. Wait for actual browser content and settled
  interaction targets; `networkidle` or a screenshot of a skeleton is insufficient evidence.
- `pnpm check` is the complete library gate, including browser/workflow checks, docs, Storybook,
  package boundaries and size. Do not replace it with typechecking when reporting a full release.
  Use `pnpm generate:component Name` for scaffolding.
- Change generator inputs and regenerate API docs / `llms.txt`; do not hand-edit generated sections.
  A public behavior/API change ships with relevant stories, docs, checks and a changeset.
- Follow [upgrade guidance](docs/guide/upgrading.md): consume changesets for release, verify npm,
  then migrate consumers and retire patches only after the released replacement passes their checks.

Keep durable principles here and concrete evidence in linked docs. Update or merge an existing rule
before appending another; no session histories, speculative causes or extra approval gates.
