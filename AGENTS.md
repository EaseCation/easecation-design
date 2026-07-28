# AGENTS.md

## Mission

EaseCation Design is a public, domain-neutral React design system initiated by EaseCation. Public components, examples, metadata, and documentation must remain independent from business APIs, private services, credentials, and industry-specific data models.

## Architecture

- `src/tokens` and `src/styles/tokens.css`: typed token contract and CSS custom properties.
- `src/theme`: theme, color theme, and density runtime.
- `src/components`: accessible public React components.
- `src/platform`: SSR-safe Web and WebView behavior.
- `src/adapters`: optional host capabilities; Capacitor must remain optional.
- `registry`: machine-readable component metadata and JSON Schema.
- `stories`: component behavior, states, and composition examples.
- `docs/ai`: authoritative AI development context.

## Commands

Run `pnpm registry:check`, `pnpm typecheck`, `pnpm lint`, `pnpm test`, `pnpm build`, `pnpm build:storybook`, and `pnpm pack:check` before review. Use `pnpm generate:component Name` for new component scaffolds.

## Rules

- Use formal component names in Storybook and documentation; internal migration terminology must not become public API or navigation labels.
- Keep component Props and example data domain-neutral.
- Do not add private URLs, credentials, business APIs, restricted assets, or hard-coded brand identifiers to runtime code.
- Do not access browser globals at module initialization; SSR imports must remain safe.
- Keep Capacitor and native capabilities behind optional adapters.
- Use Design Tokens instead of adding scattered magic values.
- AI-generated changes must pass deterministic checks and human review before release.
