---
description: Define CSS variables as engine data so tokens, scoping, and runtime value changes stay compatible with PikaCSS build-time rules.
---

# Variables

`variables` turns CSS custom properties into structured engine config instead of leaving them as ad hoc strings scattered across component code.

This is the core feature that most directly connects build-time styling with runtime flexibility. The class shape stays static, while the actual value can still move through `var(--token)`.

## Define variables in config

<<< @/.examples/guide/config-variables.ts

Variables can also be scoped under selectors, which is the foundation for theme-aware tokens and context-specific overrides.

<<< @/.examples/guide/config-variables-transitive.ts

## Keep autocomplete meaningful

If a token belongs to a stable family such as color, length, or time, use `semanticType` so autocomplete stays attached to the properties where that token makes sense.

<<< @/.examples/guide/config-variables-semantic-type.ts

## Use variables in style definitions

<<< @/.examples/guide/variables.pikainput.ts

<<< @/.examples/guide/variables.pikaoutput.css

## What variables are good at

Use variables for design tokens, theme values, and any case where the value may change while the structure of the style definition should remain fixed.

That is why variables are often one of the first core features teams adopt when moving beyond trivial examples.

## What variables are not

Variables do not justify rebuilding arbitrary style objects at runtime.

They solve value variation, not structure variation. When the style shape itself changes, reach for variants, selectors, or shortcuts instead.

## Next

- [Core Features Overview](/guide/core-features-overview)
- [Selectors](/guide/core-features/selectors)
- [Dynamic Values With CSS Variables](/patterns/dynamic-values-with-css-variables)
- [Theming And Variables](/patterns/theming-and-variables)
