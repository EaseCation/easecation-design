# Agent integration lessons

Use this context for shared UI changes and consumer migrations. Read
[governance](../guide/governance.md) first. These are checks prompted by observed regressions,
not a requirement to expand every task into a full application migration.

## Establish which version is being changed

A source checkout, a merged library commit, an npm release, a consumer lockfile, a website snapshot
and a deployed Storybook can all describe different versions. Inspect their actual state before
choosing an API or declaring a fix available.

- Check the branch, dirty files, upstream and other worktrees. Preserve unrelated work.
- Confirm the installed package's exports and declarations. Do not infer availability from current
  source or a newer Storybook. Check whether unreleased changesets still need publication.
- A temporary package patch must record its source, consumers, verification and removal condition.
  Retire it only after a released replacement is installed and verified in the affected consumers.
- Refresh generated documentation from the matching source and installed package. Do not edit
  generated snapshots, exported API files or `llms.txt` as independent sources of truth.

Evidence: the 0.18–0.20 releases and subsequent Alert/table/sidebar fixes reached source, packages,
consumer patches and the documentation website in different steps. A version number alone did
not establish that the same fixes were present everywhere.

## Verify the behavior around the shared component

| Trigger                                                | Corrective behavior                                                                           | Verification                                                                                                                      |
| ------------------------------------------------------ | --------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| A table scrolls horizontally but traps page scrolling  | Inspect the scroll container, overscroll policy and application layout together               | Use a non-empty, overflowing table; test horizontal movement and vertical wheel/touch chaining over the rows                      |
| One application has less sidebar motion                | Inspect mounting, controlled open state and conditional rendering, as well as shared CSS      | Test expand/collapse, interruption and keyboard focus; hidden persistent groups must be inert; unmounting can prevent exit motion |
| Status text looks wrong in one theme                   | Use semantic text tokens or the formal feedback component; keep text and fill colors distinct | Review text, icon, border and surface in light/dark themes; measure actual foreground/background contrast                         |
| Statistic cards contain excessive blank space          | Check inherited grid stretching and fixed/minimum heights before changing typography          | Compare short and long values in the real dashboard grid and narrow layout                                                        |
| A replacement looks the same but interacts differently | Inspect the existing consumer's event, focus, disabled and loading behavior                   | Test pending, failure, retry/cancel and focus restoration where applicable; do not port styling alone                             |

These checks follow regressions addressed by the shared statistic-card fix and the subsequent
[Alert, table and sidebar correction](https://github.com/EaseCation/easecation-design/commit/7e0d25ff696381b5f6ecd4c5d222e7ada767a1c6).
Applications still own the domain meaning of their state, route transitions and permissions.

## Make browser evidence describe a finished page

Wait for a semantic content target or the actual control under test. `networkidle` can occur while
a lazy route still displays a skeleton. Likewise, an empty table cannot demonstrate scroll behavior,
and reduced-motion-only screenshots cannot demonstrate normal motion.

Select checks appropriate to the change: 320/390/768/desktop widths, light/dark themes, normal and
reduced motion, keyboard/focus and touch where relevant. Use synthetic data. Never attach a real
business API to a public example or use production identities as test fixtures.

Record what was exercised and what was not. Source inspection, typechecking, interaction tests,
visual review and deployment checks establish different facts.

## Preserve the library/application boundary

`AccessGate` and hidden buttons are presentation, not server authorization. Generic loading,
confirmation and form primitives must not embed API permissions, user identity policies, routing,
login handoffs or business record access. Applications enforce these and sanitize server responses
before passing data into shared components.

A consumer's logout/account-choice or callback defect is not a reason to add authentication policy
to a shared navigation or loading component. Expose the generic visual state and callback needed;
leave its domain transitions with the consumer.

## Close the loop without growing permanent workarounds

1. Identify the real consumer and a concrete failure, not only a screenshot or a requested component name.
2. Change the existing shared responsibility; update meaningful tests, stories, docs, registry and
   changeset when its public behavior changes.
3. Run required library checks, then the affected consumer's prescribed checks with its actual
   dependency resolution. Inspect what CI executes instead of assuming the local aggregate command runs there.
4. Verify the installed/released behavior and remove the superseded local workaround when safe.
5. Update this document only for a reusable lesson with a trigger and a way to verify it.

Keep dated version/deployment inventories outside these durable rules. Delete obsolete lessons or
merge overlapping ones as the primary implementation and its automated checks improve. This
context does not add a separate approval gate or replace the user's existing authorization.
