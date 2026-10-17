# Table content and status color size review

QueryDataTable inherited `white-space: nowrap`, allowing text in width-constrained custom cells to
paint over adjacent columns. Its existing `meta.wrap` option was considered; wrapping now becomes
the safe default, with explicit `false` retaining single-line, clipped text. Applications still own
column widths, address truncation and mobile record composition.

StatusBadge lacked a brand tone, so consumers had to select an unrelated semantic color or override
component appearance. The additive `primary` tone completes the existing component, uses the
theme's readable text token, and keeps long labels inside the available width. Outline borders tint
the selected tone with transparency rather than mixing it with a differently hued border token.

CSS measured with gzip level 9 and Brotli quality 11:

| Source                                      |     gzip |   Brotli |
| ------------------------------------------- | -------: | -------: |
| Original 0.16.0 CSS baseline                | 21,125 B | 17,852 B |
| Existing main 7e0d25f before this fix       | 23,230 B | 19,463 B |
| With table containment and primary statuses | 23,321 B | 19,522 B |
| This fix                                    |    +91 B |    +59 B |

The previous main already consumed almost the entire CSS allowance through the intervening shared
components and styles. Only its CSS baseline is recorded here; the new 91/59 bytes remain measured
as growth. Named JavaScript budgets, the aggregate runtime baseline, and all thresholds stay as
configured. This measured baseline adjustment is part of the release review.

Acceptance covers painted text boundaries for long prose, unbroken identifiers, names and URLs;
wrapped status groups; sticky action hit targets; native auto and fixed table layouts; mobile
cards; light/dark gold token overrides; and status text contrast on real rendered surfaces.
