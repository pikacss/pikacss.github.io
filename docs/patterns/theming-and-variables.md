---
description: Build theming around selectors and variables so token changes stay centralized instead of spreading through component branches.
---

# Theming And Variables

If theme logic keeps turning into repeated color branches inside components, the missing piece is usually token architecture, not more runtime styling logic.

PikaCSS works best when selectors describe context and variables carry the values that change across that context.

## Define variables in config

<<< @/.examples/guide/config-variables.ts

You can scope variable definitions under selectors to express theme-specific token values.

<<< @/.examples/guide/config-variables-transitive.ts

If a token belongs to a stable value family such as color or length, add `semanticType` so autocomplete stays attached to the right CSS properties.

<<< @/.examples/guide/config-variables-semantic-type.ts

## Use variables in components

<<< @/.examples/guide/variables.pikainput.ts

<<< @/.examples/guide/variables.pikaoutput.css

If a value has to change per instance at runtime, continue with [Dynamic Values With CSS Variables](/patterns/dynamic-values-with-css-variables).

## A practical theming strategy

1. Use selectors to describe theme context such as light, dark, or brand-specific containers.
2. Use variables to carry the actual token values for that context.
3. Keep component style definitions focused on semantic token usage.

That split is easier to maintain than duplicating full component objects per theme, and it keeps the theme system reviewable in one place.

## Do and do not

| Do | Do not |
| --- | --- |
| Store theme values in CSS variables. | Duplicate entire components for each theme without reason. |
| Scope variable definitions with selectors. | Put theme logic into runtime object construction. |
| Keep component objects semantic. | Hardcode every token in every component. |

## Next

- [Dynamic Values With CSS Variables](/patterns/dynamic-values-with-css-variables)
- [Responsive And Selectors](/patterns/responsive-and-selectors)
- [Configuration](/guide/configuration)
- [Static Constraints](/getting-started/static-arguments)
