---
description: Understand what PikaCSS generates, why those artifacts exist, and how to use them to debug setup problems.
---

# Generated Files

PikaCSS generates files on purpose. They are not incidental build noise, and understanding them early makes the engine much easier to debug.

For a new adopter, these artifacts are also the fastest proof that scanning, config loading, and CSS emission are actually happening.

## `pika.css`

`pika.css` is a virtual module. You import it from the app entry, but you never edit it as a source file.

<<< @/.examples/integrations/import-pika-css.ts

Think of it as the bundler-facing handle for generated CSS, not as a real file you maintain by hand.

## `pika.gen.ts`

`pika.gen.ts` contains generated TypeScript support. It is how editor autocomplete learns about selectors, shortcuts, variables, plugins, and any custom tokens coming from your engine config.

When autocomplete looks incomplete or out of date, this file is one of the first places to inspect.

## `pika.gen.css`

`pika.gen.css` is the generated CSS written to disk by the integration.

::: warning Do not edit generated files
Generated files are overwritten. If the output is wrong, fix the source style definition, engine config, or integration setup instead of patching the generated artifact.
:::

By default, integrations write `pika.gen.ts` and `pika.gen.css` in the project root. If the integration config overrides `tsCodegen` or `cssCodegen`, treat those configured paths as the real artifact locations instead.

## When generated files are useful

Generated files are excellent diagnostics:

- confirm that a `pika()` call was extracted
- inspect emitted declarations and selector expansion
- verify that expected tokens and autocomplete entries were generated

When setup behaves unexpectedly, generated files usually tell you whether the problem is extraction, config resolution, or integration wiring.

They are also part of the normal daily workflow, not only emergency debugging. Check them when you add a new selector family, change shared config, or are unsure whether a new `pika()` call was extracted the way you expected.

## When generated files are not the solution

- They are not where design tokens should be customized.
- They are not where selector aliases should be fixed.
- They are not where plugins or preflights should be added.

Those changes belong in source or config, not in generated output.

## Output helpers and preview variants

The generated files help explain why PikaCSS exposes multiple output helpers.

- `pika()` follows the integration's configured output format.
- `pika.str()` always forces a string result.
- `pika.arr()` always forces an array result.
- `pikap()` and its `.str()` / `.arr()` variants keep the same output-shape rules while preserving preview-oriented workflows.

If a call site expects one exact output shape, use the matching helper and then inspect generated output once to confirm the build emitted what you expected.

See [First Pika](/getting-started/first-pika) for the basic output-shape examples.

## A simple daily workflow

1. Import `pika.css` once from the application entry.
2. Keep one literal `pika()` call nearby while the integration is being verified.
3. Check `pika.gen.css` when you need to confirm extraction or selector expansion.
4. Check `pika.gen.ts` when autocomplete, selectors, shortcuts, or variables look incomplete.
5. Return to source or config for fixes instead of editing generated output.

## A simple debugging order

1. Confirm the source file contains a supported static `pika()` call.
2. Confirm the application imports `pika.css`.
3. Inspect `pika.gen.ts` and `pika.gen.css` to see what the build emitted.
4. If output is still missing, check config discovery and ESLint warnings next.

If the problem is still unclear after those four checks, continue with [Common Problems](/troubleshooting/common-problems) instead of changing multiple config knobs at once.

## Next

- [ESLint](/integrations/eslint)
- [How PikaCSS Works](/concepts/how-pikacss-works)
- [Configuration](/guide/configuration)
- [Common Problems](/troubleshooting/common-problems)
