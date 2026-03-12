---
description: Structure PikaCSS component styling around static composition, explicit variants, and shared recipes that remain easy to review.
---

# Component Styling

The most durable PikaCSS components are built from small static pieces. The goal is not cleverness. The goal is a styling shape that remains easy to review, easy to reuse, and compatible with build-time extraction.

When component styling becomes difficult, the usual cause is not missing power. It is too many responsibilities collapsed into one object.

## Start with composition, not conditionals

Base styles, variant styles, and local overrides should usually be separate arguments.

<<< @/.examples/getting-started/first-pika-multiple-args.vue

That pattern scales because each piece keeps one job:

- base styles define structure
- variant styles define intent
- local overrides solve narrow context needs

When those roles collapse into one giant object, review gets harder and reuse gets weaker.

## Use shortcuts for shared recipes

When the same style bundle appears across several components, move it into a shortcut instead of copying the object from file to file.

<<< @/.examples/guide/config-shortcuts.ts

<<< @/.examples/guide/shortcuts-usage.ts

<<< @/.examples/guide/shortcuts-output.css

Shortcuts are a good home for shared static recipes. They are not a place to hide runtime decisions.

## Prefer explicit variants

For states such as `primary`, `secondary`, `danger`, or `compact`, create separate static style blocks and let runtime code choose between them.

::: tip Good runtime usage
Runtime code should choose among predeclared class strings. Runtime code should not construct the style content itself.
:::

## Push changing values into variables

If a component still needs per-instance values such as width, accent color, or user-driven data, keep the structural style block static and move the changing value into CSS variables.

That preserves the build-time model without giving up runtime flexibility where it actually belongs.

## Recommended review checklist

| Ask this | Why it matters |
| --- | --- |
| Can this repeated block become a shortcut? | It reduces duplication and sharpens intent. |
| Is this variant stable enough to name? | Named variants are easier to review than ad hoc overrides. |
| Is theme data actually a CSS variable problem? | Variables usually age better than repeated color branches. |
| Is this local override still static? | If not, the build-time model will fight you. |

## Do and do not

| Do | Do not |
| --- | --- |
| Compose `pika(base, primary, localOverride)`. | Put every possible branch in one inline expression. |
| Move shared recipes into shortcuts. | Copy the same large object across files. |
| Keep variants stable and named. | Invent new dynamic shape rules per component. |

## Next

- [Responsive And Selectors](/patterns/responsive-and-selectors)
- [Dynamic Values With CSS Variables](/patterns/dynamic-values-with-css-variables)
- [Theming And Variables](/patterns/theming-and-variables)
- [Configuration](/guide/configuration)
