# Upgrading EaseDesign

Use the release matching your installed package. [CHANGELOG.md](../../CHANGELOG.md) records
published API and behavior changes; source changesets describe work that has not shipped yet.
The website's release manifest identifies its source commit, package version and generated assets.
A newer Storybook does not establish that an application's dependency has been upgraded.

## From 0.18 to 0.20.1

- 0.19 adds Table pagination, sorting, filtering, selection, expansion and pinned columns;
  QueryDataTable tree expansion; ExpandableText; bounded auto-resizing Textarea; and workbench
  compositions. Server pagination must be explicit: never slice an already paginated API response.
- 0.19.1 makes StatCard height follow its content. Remove application min-height/blank-icon
  workarounds after checking the actual dashboard grid.
- 0.20 adds NumberInput, Progress, FileDropzone, ImageViewer and Watermark, plus precise time inputs
  and custom MultiSelect matching. Uploads, authorization, exact finance arithmetic and business
  date/time semantics remain application responsibilities.
- 0.20.1 corrects Alert tints and semantic text colors, lets vertical gestures pass through horizontal
  tables, and shares expandable sidebar motion. These are behavior fixes; existing component APIs
  remain available. No database migration is involved.

## Upgrade a consumer

### From 0.20.1 to 0.21

QueryDataTable now wraps headers, prose and unbroken identifiers within their columns by default.
Use column `size` and table `minWidth` to preserve readable widths; set `meta.wrap: false` only for
single-line columns. Custom non-wrapping cells still need bounded widths and truncation. Review all
columns together with long content, including pinned actions and mobile cards.

Use `StatusBadge tone="primary"` for brand-colored states; `info` retains its informational color.
Soft and outline appearances use semantic text tokens, and outline borders keep the selected hue.

### Verification steps

1. Install the selected published version and commit the manifest and lockfile together. Use that
   repository's pinned package manager and verify a frozen/immutable installation.
2. Compare public declarations and [generated component docs](../components/Table.md) before
   using a new API. Do not infer prop signatures from another UI library.
3. For temporary CSS/package patches, compare their original source with the released code. Remove
   the patch only after the installed package reproduces its fixes; remove superseded local skins.
4. Keep expandable sidebar groups mounted with `ec-sidebar-group-content` and its inner wrapper.
   Set `data-expanded`, `inert` and `aria-hidden` from the same state. Conditional unmounting prevents
   exit transitions; hidden children must leave the focus order. See [Sidebar](../components/SidebarNavItem.md).
5. Review populated tables in narrow layouts: horizontal scrolling and vertical page chaining,
   pinned actions, keyboard focus and touch targets. Check Alert tones in the active theme and
   sidebar motion with normal and reduced-motion preferences.
6. Run the consumer's prescribed checks; verify its deployed commit and changed behavior through
   synthetic fixtures. The shared library gate does not validate an application's routing or policy.

## Complete workflow and regression scene

`examples/record-workflow/RecordWorkflow.tsx` composes existing public controls without introducing
another runtime abstraction. Storybook's `Patterns/RecordWorkflow/Complete` and the documentation
website use this same source. Its fake service has no network access and demonstrates:

- navigation, draft/apply/reset filters, populated and empty results;
- loading, cancellation that preserves results, failure and explicit retry;
- superseding stale queries, details with focus restoration, confirmation pending lock and retry;
- sidebar motion/inert content, compact statistics and table scroll chaining.

Run `pnpm test:workflow` after building the library. The website runs the same browser assertions
against its installed package and generated example. Keep request caching, permissions, mutation
idempotency and real data in applications; cancellation of a request does not prove a server write
was rolled back.
