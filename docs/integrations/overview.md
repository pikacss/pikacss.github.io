---
description: Learn how every PikaCSS integration shares the same build-time pipeline and choose the right setup path for your stack.
---

# Integrations Overview

PikaCSS keeps one engine model across every adapter. You still write static `pika()` calls, load one engine config, import the generated CSS entry, and let the integration keep generated files in sync.

This section exists to keep setup decisions small. Once the shared workflow is clear, choosing between Vite, Nuxt, or another unplugin-powered tool mostly becomes a question of registration and defaults.

## Choose your path

| If you are using | Go to |
| --- | --- |
| Vite | [Vite](/integrations/vite) |
| Nuxt | [Nuxt](/integrations/nuxt) |
| Another bundler powered by unplugin | [Vite](/integrations/vite) for the baseline mental model |
| CI/editor enforcement of static rules | [ESLint](/integrations/eslint) |

## One shared integration mental model

Every adapter has the same four jobs:

1. scan source files for supported `pika()` usage
2. resolve engine config from an inline object or `pika.config.*`
3. write generated CSS and generated TypeScript types
4. expose the `pika.css` virtual module so the app can load emitted styles

<<< @/.examples/integrations/plugin-options.ts

If those four pieces are working, the integration is working. Most setup issues come from one of them being missing rather than from advanced config.

## What changes by integration

- where the adapter is registered
- which files are scanned by default
- how the dev server reload path behaves
- whether framework conventions add an extra module layer

The engine itself does not become more dynamic or more framework-specific just because the adapter changes.

## Recommended first choice

Start with Vite when you have a choice. It exposes the cleanest mental model, the fewest framework abstractions, and the fastest path from source to generated output.

Choose Nuxt when the application is already Nuxt-shaped. It is the right adapter for a Nuxt app, but not the best place to learn the basics for the first time.

## What to verify on any integration

1. The adapter is actually registered in the bundler or framework config.
2. The application loads `pika.css` or the integration-specific equivalent.
3. Your `pika()` calls live in files matched by the scan config.
4. `pika.gen.css` and `pika.gen.ts` appear where you expect them.

## Next

- [Vite](/integrations/vite)
- [Nuxt](/integrations/nuxt)
- [ESLint](/integrations/eslint)
- [Configuration](/guide/configuration)
