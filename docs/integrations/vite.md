---
description: Set up PikaCSS in Vite and use that workflow as the baseline mental model for every other integration.
---

# Vite

Vite is the clearest place to learn PikaCSS. The adapter surface is small, the feedback loop is fast, and the generated files are easy to inspect during development.

Even if your final bundler is different, the Vite path teaches the same build-time model you will use everywhere else.

## Install

::: code-group
<<< @/.examples/integrations/vite-install.sh [pnpm]
<<< @/.examples/integrations/vite-install-npm.sh [npm]
<<< @/.examples/integrations/vite-install-yarn.sh [yarn]
:::

## Minimal setup

<<< @/.examples/integrations/vite-basic-config.ts

<<< @/.examples/integrations/import-pika-css.ts

That is the whole baseline: register the plugin, import the virtual CSS module, and keep `pika()` usage inside scanned source files.

## Inline config vs config file

Inline config is useful for a sandbox, reproduction, or one-file demo.

<<< @/.examples/integrations/vite-inline-config.ts

For a real project, move engine config into `pika.config.ts`. That keeps selectors, variables, shortcuts, and plugins in one place instead of hiding them inside bundler config.

## Useful options

<<< @/.examples/integrations/vite-all-options.ts

Most teams only need a few of these. Start with defaults, then customize scan patterns, generated file paths, or function names when the project layout actually requires it.

## What to verify first

1. `pika.css` is imported from the application entry.
2. The Vite plugin is registered exactly once.
3. `pika()` calls remain static enough for build-time extraction.
4. Generated files are written to the expected location.

If any one of those checks fails, stop there and fix it. Adding more config on top of a broken baseline usually makes the problem harder to see.

## Next

- [First Pika](/getting-started/first-pika)
- [Integrations Overview](/integrations/overview)
- [Static Constraints](/getting-started/static-arguments)
- [Generated Files](/guide/generated-files)
