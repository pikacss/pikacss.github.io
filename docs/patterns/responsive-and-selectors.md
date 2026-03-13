---
description: Build a shared selector vocabulary for responsive rules, states, and context-driven styling so your team stops reinventing the same conditions in every component.
---

# Responsive And Selectors

Selectors are where PikaCSS starts to feel like a system instead of a helper. They let you name states, themes, and breakpoints once in config, then reuse those names everywhere.

The real value is not shorter syntax. The value is a shared vocabulary for structural styling conditions.

## Design your breakpoint vocabulary

Define all breakpoint aliases in engine config, not inside individual components. That keeps the naming consistent and allows teams to scan breakpoint usage across the entire codebase.

<<< @/.examples/guide/selectors-config.ts

Prefer boring, predictable names like `screen-sm`, `screen-md`, and `screen-lg`. If every developer invents a different naming convention, named selectors stop being shared language and turn back into local syntax noise.

## Use selectors in components

Once selectors are registered, use their names as keys in `pika()` style objects. Component files never need to know the raw media query or selector string.

<<< @/.examples/guide/selectors.pikainput.ts

<<< @/.examples/guide/selectors.pikaoutput.css

## Nested selector objects are still static

Nesting a style object under a selector key is declared in source, not computed at runtime. It remains fully compatible with the build-time model.

See [Selectors](/guide/core-features/selectors) for the full API, including the `$` placeholder and how expansion works.

## Combine selectors with shortcuts

When a selector-driven style combination repeats across many components, that is usually a sign it should become a shortcut.

Shortcuts capture the repeated static combination built on top of selectors, so the pattern becomes a named convention instead of a recurring pattern of keys.

See [Shortcuts](/guide/core-features/shortcuts) for how to define shortcut recipes.

## Split responsibilities cleanly

Selectors should describe structure: state, context, and breakpoints.

Variables should carry changing values.

Shortcuts should capture repeated static combinations built on top of those selectors.

## Recommended patterns

- Put breakpoint aliases in config, not in individual components.
- Keep selector names semantic enough for team-wide reuse.
- Use selectors for structural conditions and variables for changing values.
- Use shortcuts when a selector-driven pattern repeats.

::: warning Do not overload selectors
If one selector alias hides too many unrelated rules, review gets harder and local overrides become unpredictable. A selector should describe a stable condition, not an entire component contract.
:::

## Next

- [Component Styling](/patterns/component-styling)
- [Theming And Variables](/patterns/theming-and-variables)
- [Dynamic Values With CSS Variables](/patterns/dynamic-values-with-css-variables)
- [Configuration](/guide/configuration)
