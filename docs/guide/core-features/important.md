---
description: Control default and per-definition use of !important without confusing that choice with selector design or layer order.
---

# Important

`important` controls whether generated declarations include `!important` by default and whether a specific style definition can override that default.

It is a core feature because it changes CSS priority at emission time. It is not a plugin, and it is not a substitute for clear selectors or sane layer order.

## Configure the default

Use engine config when the project wants one consistent default rule.

<<< @/.examples/guide/config-important.ts

## Override per definition

Use `__important` when one style definition needs to opt in or opt out without changing the global default.

<<< @/.examples/guide/important-per-definition.ts

## When to use it

Reach for `important` when your team understands why forced priority is necessary and wants that rule applied intentionally.

Typical reasons include legacy CSS coexistence, controlled integration boundaries, or a narrowly defined utility layer that must always win.

## When not to use it

If `!important` keeps showing up everywhere, the underlying issue is usually elsewhere:

- selector aliases are too broad or too vague
- layer ordering is doing the wrong job
- local overrides are compensating for a design-system mismatch

In those cases, fix the structure first and keep `important` as the exception rather than the baseline.

## Relationship to the rest of the engine

`important` only changes output priority. It does not define reusable tokens, selectors, or recipes.

That is why many teams adopt `selectors`, `variables`, and `shortcuts` first, then decide later whether `important` belongs in their conventions.

## Next

- [Core Features Overview](/guide/core-features-overview)
- [Variables](/guide/core-features/variables)
- [Selectors](/guide/core-features/selectors)
- [Configuration](/guide/configuration)
