---
description: Handle runtime values in PikaCSS by keeping style shape static and binding only the changing values through CSS variables.
---

# Dynamic Values With CSS Variables

PikaCSS does not ship a styling runtime. That is part of why it stays predictable and fast, but it also changes how dynamic styling should be modeled.

When a value must change at runtime, keep the style definition static inside `pika()` and bind the changing value through a CSS variable.

## Pick the right pattern for the job

| Need | Pattern | Why |
| --- | --- | --- |
| A finite set of visual states | Predeclare variants and switch class names at runtime. | PikaCSS can scan every style shape ahead of time. |
| A continuous or per-instance value | Use `var(--...)` inside `pika()` and bind the variable at runtime. | The style shape stays static while the value stays dynamic. |
| Shared theme tokens | Define variables in config and scope them with selectors. | The design system remains centralized and reusable. |

## What not to do

This is the runtime CSS-in-JS habit that usually causes the first mismatch with PikaCSS.

<<< @/.examples/patterns/dynamic-values-bad.tsx

`pika()` cannot safely extract that object because the style values only become knowable after the application runs.

## Bind runtime values through CSS variables

The fix is not to force more runtime logic into `pika()`. The fix is to let PikaCSS emit static declarations that reference CSS variables, then assign those variables from your framework or DOM code.

<<< @/.examples/patterns/dynamic-values-react.tsx

This works because PikaCSS only needs to emit declarations such as `width: var(--progress-width)` or `background-color: var(--progress-color)`. Your app still owns the runtime value assignment.

That boundary is the whole pattern: PikaCSS owns structure, the app owns changing values.

## Keep style shape static, switch variants separately

Many components need both forms of dynamism at once:

1. discrete states such as `solid` or `outline`
2. per-instance values such as a brand color from data

Handle those concerns separately.

<<< @/.examples/patterns/dynamic-values-variants.tsx

Choose the predeclared class string at runtime. Bind the changing value through a CSS variable.

## A useful migration mental model

If you are coming from runtime CSS-in-JS, the shift is straightforward:

1. Do not build style objects from runtime data.
2. Do choose among predeclared style objects at runtime.
3. Do push changing values into CSS variables.
4. Do let the app layer own variable assignment.

::: tip The boundary to remember
PikaCSS can generate `var(--accent)` references for you. It does not manage the runtime state of `--accent`.
:::

For shared tokens and theme switching, continue with [Theming And Variables](/patterns/theming-and-variables).

## Next

- [Static Constraints](/getting-started/static-arguments)
- [Theming And Variables](/patterns/theming-and-variables)
- [Component Styling](/patterns/component-styling)
- [Common Problems](/troubleshooting/common-problems)
