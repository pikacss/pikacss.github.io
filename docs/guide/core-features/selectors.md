---
description: Understand the `$` placeholder, learn how to define selector aliases for states, context, and media conditions, and see why named selectors make component code consistent at scale.
---

# Selectors

`selectors` lets you register named aliases in engine config for CSS conditions — pseudo states, parent contexts, at-rules, and dynamic patterns. Those names become the keys you use inside `pika()` style objects.

This is one of the most important scaling features in PikaCSS because it gives the whole codebase the same language for state, context, and responsive conditions.

::: warning Register conditions as named selectors — do not use raw CSS syntax as keys

A common mistake is writing raw CSS selector syntax such as `'&:hover'` directly as a key inside a `pika()` call. That produces a **CSS nesting rule**, not a flat atomic rule. Nesting rules are not deduplicated or shared across components the way atomic rules are.

Always register the condition as a named selector in config and use that name as the key:

Correct: use the registered selector name so the engine emits a flat atomic rule.

<<< @/.examples/guide/built-ins/selectors-nesting-correct.pikainput.ts

<<< @/.examples/guide/built-ins/selectors-nesting-correct.pikaoutput.css

Wrong: a raw CSS key such as `'&:hover'` renders a nesting rule instead.

<<< @/.examples/guide/built-ins/selectors-nesting-wrong.pikainput.ts

<<< @/.examples/guide/built-ins/selectors-nesting-wrong.pikaoutput.css

The `$` character you see in selector config values is a placeholder for the current default selector. By default that selector is `.%`, so `$` is the shorthand most users interact with. It is engine config syntax, not CSS syntax, and it never appears inside `pika()` calls.
:::

This warning is specifically about pseudo states and reusable context selectors. Wrapper at-rules such as `@media` can still be written directly as static object keys when you only need the wrapper itself. That is why onboarding pages may show direct at-rules first, then move to named selectors for hover, dark mode, and other shared conditions.

## Mental model: `$`, the default selector, and at-rules

There are two different places where selector logic happens:

- Inside `pika()`, you write selector names such as `hover`, `theme-dark`, or `screen-md` as static object keys.
- Inside selector config, you decide how those names expand into CSS conditions.

`$` means “insert the current default selector here.” With the default config, that selector is `.%`, so these rules eventually render atomic class names such as `.pk-a` in the final CSS.

That is why inline conditions need `$`, but wrapper conditions usually do not:

- `['hover', '$:hover']` positions the element selector inline.
- `['dark', '[data-theme="dark"] $']` positions the element selector inside a parent context.
- `['md', '@media (min-width: 768px)']` does not need `$` because the at-rule wraps the atomic selector instead of placing it inline.

If a selector chain only produces wrappers such as `@media` and does not place the atomic selector itself, the engine appends the default selector at the innermost level automatically.

## The `$` placeholder in config

When you define a selector that targets the element itself, use `$` as a placeholder in the pattern string to mark where the generated atomic class name appears in the final CSS rule.

<<< @/.examples/guide/built-ins/selectors-placeholder-pseudo.ts

The engine expands `$` through the current default selector and then renders the atomic class name at build time:

- `['hover', '$:hover']` → `.pk-a:hover { ... }`
- `['before', '$::before']` → `.pk-a::before { ... }`
- `['dark', '[data-theme="dark"] $']` → `[data-theme="dark"] .pk-a { ... }`

At-rules such as `@media` do not need `$`. The engine treats them as wrappers and nests the atomic selector automatically inside the at-rule block:

<<< @/.examples/guide/built-ins/selectors-at-rule.pikaoutput.css

## Define selectors in config

<<< @/.examples/guide/built-ins/selectors-config.ts

The config supports four forms:

- **Plain string** — registers an autocomplete-only hint with no expansion rule.
- **Static tuple** — maps a name to one or more CSS selector patterns, optionally containing `$` when the condition needs to place the element selector inline.
- **Dynamic regex tuple** — derives a selector pattern from a name that matches a regex.
- **Object form** — equivalent to the tuple forms, written as a named object.

## Multi-value selectors

A static selector can expand to multiple CSS selector patterns. Wrap the patterns in an array as the second element of the tuple.

<<< @/.examples/guide/built-ins/selectors-tuple-static.ts

## How selectors expand in pika()

Use a registered selector name as a key in any style object passed to `pika()`. The engine expands it into the corresponding CSS condition.

If the resolved selector pattern already uses `$`, that pattern decides exactly where the atomic selector lands. If the resolved selector pattern is only a wrapper such as `@media`, the engine appends the default selector inside that wrapper automatically.

<<< @/.examples/guide/built-ins/selectors.pikainput.ts

<<< @/.examples/guide/built-ins/selectors.pikaoutput.css

## Selector aliases

A selector value can reference another registered selector by name. The engine resolves the chain recursively.

<<< @/.examples/guide/built-ins/selectors-recursive.ts

## What selectors are good at

Use selectors for stable conditions: hover states, focus behavior, theme contexts, breakpoint aliases, and other reusable structural rules.

That keeps component code readable and prevents raw selector syntax or repeated media queries from spreading through the application.

If a condition should become shared team vocabulary, register it as a selector even when raw CSS syntax would technically work.

## What selectors are not

Selectors should not hide an entire component contract behind one vague name.

If an alias bundles too many unrelated concerns, reviews become harder and local overrides become less predictable.

## Next

- [Core Features Overview](/guide/core-features-overview)
- [Shortcuts](/guide/core-features/shortcuts)
- [Responsive And Selectors](/patterns/responsive-and-selectors)
- [Configuration](/guide/configuration)
