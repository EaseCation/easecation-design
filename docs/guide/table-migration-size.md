# Shared Table size review

The requested HR migration moves 52 Ant Table instances to the formal shared Table. It adds local sorting, multi-value filters, selection, detail expansion, explicit server pagination and pinned columns using existing shared controls and TanStack.

Runtime JS/CSS, measured with the package gate compression settings:

| Measurement                                  |     gzip |   Brotli |
| -------------------------------------------- | -------: | -------: |
| Original 0.16.0 baseline                     | 84,553 B | 72,587 B |
| Existing HR preview before this Table change | 92,158 B | 78,540 B |
| After shared Table interactions              | 94,258 B | 80,292 B |
| This change                                  | +2,100 B | +1,752 B |

Only the aggregate feature baseline is updated. Named entry budgets and warning/failure thresholds remain unchanged. HR's build output drops from approximately 6,736 KB to 6,537 KB as Ant Table is removed; this is an application build measurement, not the library budget.

Source maps retain mappings but no longer duplicate embedded source text, keeping the archive under its existing unpacked-size limit. Debuggers need the repository source files to display original sources.
