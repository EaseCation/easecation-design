# AGENTS.md

## Mission

EaseCation Design is a public, domain-neutral React design system migrated from Console Neo's visual language. The reference app is the visual source of truth, not a source of business APIs or runtime dependencies.

## Architecture

- `src/tokens` and `src/styles/tokens.css`: typed contract and CSS custom properties.
- `src/theme`: theme and density runtime.
- `src/components`: accessible public React components.
- `src/platform`: SSR-safe Web/WebView behavior.
- `src/adapters`: optional host capabilities; Capacitor must remain optional.
- `registry`: machine-readable component metadata and JSON Schema.
- `stories`: behavior and visual examples.
- `docs/ai`: authoritative AI development context.

## Commands

Run `pnpm registry:check`, `pnpm typecheck`, `pnpm lint`, `pnpm test`, `pnpm build`, `pnpm build:storybook`, and `pnpm pack:check` before review. Use `pnpm generate:component Name` for new component scaffolds.

## Non-negotiable rules

- Do not copy Tailwind, Radix, Ant Design, Material, shadcn or other library source.
- Do not add private URLs, credentials, authentication, permissions, router code or EaseCation business models.
- Do not ship logos, trademarks, proprietary illustrations or assets without a recorded license review.
- Do not access browser globals at module top level.
- Public APIs use domain-neutral names and support `className`, `style`, refs, keyboard use and ARIA.
- Core functionality cannot require hover, Capacitor or a native bridge.
- AI output never publishes npm packages or changes release credentials.