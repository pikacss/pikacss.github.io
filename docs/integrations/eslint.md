---
description: Use ESLint to enforce PikaCSS static constraints before invalid authoring patterns spread through your codebase.
---

# ESLint

The ESLint integration exists to catch invalid `pika()` usage where it is cheapest to fix: in the editor, in review, and in CI before the build output becomes confusing.

Treat linting as onboarding, not cleanup. PikaCSS has one boundary teams must learn early, and that boundary is static input.

## Install

::: code-group
<<< @/.examples/integrations/eslint-install.sh [pnpm]
<<< @/.examples/integrations/eslint-install-npm.sh [npm]
<<< @/.examples/integrations/eslint-install-yarn.sh [yarn]
:::

## Recommended config

<<< @/.examples/integrations/eslint-recommended-config.mjs

Add the rule before PikaCSS spreads across many components. It is much easier to preserve good habits than to unwind dynamic styling patterns later.

## What this protects you from

The rule mainly blocks runtime CSS-in-JS habits from leaking into a build-time engine.

That usually means variable references, computed keys, conditional object values, and other shapes that only become knowable after the app runs.

## What valid usage looks like

<<< @/.examples/integrations/eslint-valid-example.pikainput.ts

## What invalid usage looks like

<<< @/.examples/integrations/eslint-invalid-example.pikainput.ts

## Why this is worth enforcing

Without linting, invalid style input often looks like a missing transform, a broken scan path, or a generated CSS bug. With linting, the real problem is named immediately and close to the source.

::: tip Team recommendation
Enable the rule in local development and CI. The cost is low, and it keeps the entire team aligned on the same authoring model.
:::

## Next

- [Installation](/getting-started/installation)
- [Static Constraints](/getting-started/static-arguments)
- [Generated Files](/guide/generated-files)
- [Configuration](/guide/configuration)
