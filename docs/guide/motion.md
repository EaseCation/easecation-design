# Motion

Button and pressable Card share physical press feedback. Pointer cancellation, lost capture,
leaving the surface and disabling the interaction clear the effect. Calling preventDefault
in onPointerDown cancels feedback for that gesture. Reduced motion disables the tilt and
responds to preference changes without a reload.

Use `useReducedMotion()` from `@easecation/design` for product-specific visualizations that
cannot use a shared component. It returns a boolean, subscribes to the system preference,
and is safe to render on the server. Use CSS motion tokens for timing, not independent
product-specific constants. Prefer shared components before introducing a custom effect.
