---
description: Add PikaCSS to a Nuxt app without losing the same static build-time workflow used by the lower-level integrations.
---

# Nuxt

Nuxt wraps the Vite adapter in a module, but it does not change PikaCSS fundamentals. The style authoring rules stay the same: keep `pika()` static, load the generated CSS entry, and move shared styling rules into engine config.

This page is for teams already committed to Nuxt. If you are still learning the engine model, read the Vite page first and then come back here for Nuxt-specific setup.

## Install

::: code-group
<<< @/.examples/integrations/install-nuxt.sh [pnpm]
<<< @/.examples/integrations/install-nuxt-npm.sh [npm]
<<< @/.examples/integrations/install-nuxt-yarn.sh [yarn]
:::

## Minimal setup

<<< @/.examples/integrations/nuxt.config.ts

The module takes care of wiring the Vite plugin and loading `pika.css` into the app. That keeps Nuxt setup short, but the generated files and static constraints still behave the same way.

## When to customize scanning

Nuxt defaults are a starting point, not a promise that every project layout will be discovered automatically.

<<< @/.examples/integrations/nuxt.config.scan-all.ts

Reach for custom scanning only when your source tree actually needs it, such as shared UI packages, unusual app directories, or extra file types.

## What usually goes wrong

- styles are authored in files outside the configured scan globs
- runtime values are pushed directly into `pika()`
- generated files are expected in a different place than the module writes them
- project-wide conventions are left in `nuxt.config.ts` instead of moved into `pika.config.ts`

## A good Nuxt workflow

1. Register the Nuxt module and confirm the app boots.
2. Verify one simple literal `pika()` call transforms as expected.
3. Inspect generated files before assuming the issue is Nuxt-specific.
4. Only then widen scanning or add shared engine config.

## Next

- [Static Constraints](/getting-started/static-arguments)
- [Integrations Overview](/integrations/overview)
- [Generated Files](/guide/generated-files)
- [Common Problems](/troubleshooting/common-problems)
