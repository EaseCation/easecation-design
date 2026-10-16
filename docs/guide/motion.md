# Motion

Button and pressable Card share physical press feedback. Quick taps retain their visual press
for at least `--ec-motion-fast` from pointerdown, without delaying the click action. Normal touch
release does not cancel this feedback; interrupted gestures still clear immediately. Pointer cancellation, lost capture,
leaving the surface and disabling the interaction clear the effect. Calling preventDefault
in onPointerDown cancels feedback for that gesture. Reduced motion disables the tilt and
responds to preference changes without a reload.

Use `useReducedMotion()` from `@easecation/design` for product-specific visualizations that
cannot use a shared component. It returns a boolean, subscribes to the system preference,
and is safe to render on the server. Use CSS motion tokens for timing, not independent
product-specific constants. Prefer shared components before introducing a custom effect.

## Floating surfaces

Select, Combobox, MultiSelect, DropdownMenu, Popover and Tooltip share an entrance and
exit: `--ec-motion-fast` to open, three quarters of that duration to close. Motion follows
the resolved side after collision detection and scales from the trigger/arrow origin.
Closing surfaces ignore pointer input while Radix completes their exit and restores focus.
The Select chevron follows the open state. Overlays use `--ec-motion-base` to enter and
`--ec-motion-fast` to exit; mobile overlays use the same timing tokens.

Button keyboard and assistive-technology activation receives centered press feedback without
synthesizing a click, delaying the action, or changing native Enter/Space semantics. Pointer
feedback is clamped at the surface edge. Blur cancels a held gesture but lets completed taps
finish when focus moves into a menu. Disable and reduced motion clear pending feedback.
