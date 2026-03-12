---
description: Learn the static input rules that make PikaCSS work and use them as the main adoption filter before rollout.
---

# Static Constraints

This page contains the rule that decides whether PikaCSS fits your project.

`pika()` is evaluated from source code at build time. That means the integration needs to understand the argument shape without running your application. If the style input depends on runtime state, PikaCSS cannot reliably transform it.

## Adoption decision tree

Use this checklist before setting up the project:

| Question | If yes | If no |
| --- | --- | --- |
| Can most styles be expressed as literal objects, strings, or statically composed values? | Continue to Installation | Stop here — PikaCSS is not the right tool |
| Can theme values move into CSS variables instead of being computed at runtime? | Continue | Evaluate whether dynamic theming is more important than static output |
| Can state differences be expressed as named selector aliases instead of inline logic? | Continue | Consider a runtime CSS-in-JS approach |
| Can the team add the ESLint integration to CI before broad adoption? | You are ready to adopt | Address the enforcement gap before rollout |

If the answer to the first question is no for more than a small minority of the codebase, reject PikaCSS before investing setup time.

## Treat static input as the product boundary

Do not treat static constraints as an awkward limitation to patch over later. They are the boundary that makes the engine useful.

If the team can keep style input statically analyzable, PikaCSS can generate CSS, types, and predictable output ahead of time. If the design system depends on computing style objects from runtime data, the model is wrong for the project.

## What the extractor can read

Literal objects, arrays, strings, nested static structures, and stable composition are the happy path.

<<< @/.examples/community/faq-static-ok.ts

## What breaks the build-time model

Runtime function calls, mutable state, computed member access, or arbitrary expressions inside `pika()` break the build-time model.

<<< @/.examples/community/faq-static-bad.ts

<<< @/.examples/integrations/eslint-invalid-example.ts

## Why the restriction pays for itself

PikaCSS gets its value from this boundary:

- It can transform source into deterministic atomic CSS.
- It can deduplicate declarations because it knows the style content up front.
- It can generate autocomplete types and plugin-defined tokens.
- It keeps runtime bundles free of styling work.

If the engine accepted arbitrary runtime values, those guarantees would collapse.

## Better replacements for runtime style generation

When you think you need runtime style logic, pick one of these patterns first:

1. Predeclare variants and switch class names at runtime.
2. Move repeated combinations into shortcuts.
3. Move theme values or per-instance dynamic values into CSS variables.
4. Move state differences into selectors such as `hover`, `focus`, or custom aliases.
5. Compute which static style block to use, not the contents of the block itself.

::: tip A good mental model
Choose between static style definitions at runtime. Do not compute style definitions at runtime.
:::

If the value itself still has to change at runtime, read [Dynamic Values With CSS Variables](/patterns/dynamic-values-with-css-variables).

## Enforce the rule before rollout

Use the ESLint integration so mistakes are caught in editor and CI instead of only during build output inspection.

<<< @/.examples/integrations/eslint-valid-example.ts

## Practical do and do not

| Do | Do not |
| --- | --- |
| Predeclare a `primary`, `secondary`, and `danger` style variant. | Build a style object from API data inside `pika()`. |
| Use CSS variables for theme values. | Read a runtime theme object directly from the call. |
| Use selectors and shortcuts to encode recurring patterns. | Rebuild the same logic with ad hoc computed objects in each component. |

## Next

- [What Is PikaCSS?](/getting-started/what-is-pikacss)
- [Installation](/getting-started/installation)
- [ESLint](/integrations/eslint)
- [Dynamic Values With CSS Variables](/patterns/dynamic-values-with-css-variables)
