---
description: Install the main integration, verify one baseline setup, and understand which generated files belong to the build-time workflow.
---

# Installation

Most projects should start with the unplugin package. That path covers Vite, Rollup, Webpack, Rspack, Rolldown, and esbuild through one shared integration model.

::: code-group
<<< @/.examples/getting-started/install-unplugin.sh [pnpm]
<<< @/.examples/getting-started/install-unplugin-npm.sh [npm]
<<< @/.examples/getting-started/install-unplugin-yarn.sh [yarn]
:::

If you are using Nuxt, go straight to [Nuxt](/integrations/nuxt).

## Start with one working baseline

Start with Vite unless the project already runs on something else. The goal of the first setup is not to design the final architecture. The goal is to prove that the build sees `pika()` calls, rewrites them, and emits CSS you can inspect.

The smallest successful setup has three pieces:

1. Register the PikaCSS plugin in your bundler config.
2. Import the virtual module `pika.css` in your app entry.
3. Write a literal `pika()` call in a supported source file.

<<< @/.examples/integrations/vite-basic-config.ts

<<< @/.examples/integrations/import-pika-css.ts

## Supported build tools

- Vite
- Nuxt
- Rollup
- Webpack
- Rspack
- Rolldown
- esbuild

See [Integrations Overview](/integrations/overview) for the full matrix.

::: warning Read this before writing real styles
`pika()` arguments must be statically analyzable. Do not assume you can pass runtime values just because the API surface looks like normal JavaScript. Read [Static Constraints](/getting-started/static-arguments) before you spread usage across a codebase.
:::

## Add config when the project stops being trivial

PikaCSS automatically discovers config files named `pika.config.{js,ts,mjs,mts,cjs,cts}`. Zero-config is fine for a first pass, but most real projects should add a config file as soon as they need selectors, shortcuts, variables, plugins, or consistent layer control.

<<< @/.examples/getting-started/pika.config.ts

## Know which files are generated

The integration may generate:

- `pika.gen.ts` for autocomplete and type augmentation.
- `pika.gen.css` as the generated CSS output file on disk.
- The virtual module `pika.css`, which resolves to generated CSS at build time.

Read [Generated Files](/guide/generated-files) before editing anything that looks auto-created.

## Treat ESLint as setup, not cleanup

PikaCSS is easier to adopt when invalid `pika()` usage is blocked in editor and CI from day one.

Install the ESLint integration during onboarding, not after invalid patterns have already spread through the codebase.

Read [ESLint](/integrations/eslint) immediately after your first successful setup.

## First-run checklist

- Confirm the bundler plugin is registered.
- Confirm your app imports `pika.css`.
- Confirm one literal `pika()` call produces class names and generated CSS.
- Confirm you understand which files are generated and should not be edited.
- Confirm the team has read [Static Constraints](/getting-started/static-arguments) before broad adoption.
- **Install [ESLint](/integrations/eslint) now.** Do not wait until after invalid `pika()` usage has already spread through the codebase.

## Next

- [First Pika](/getting-started/first-pika)
- [Generated Files](/guide/generated-files)
- [ESLint](/integrations/eslint)
- [Vite](/integrations/vite)
