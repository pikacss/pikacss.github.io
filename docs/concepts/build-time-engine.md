---
description: Understand why PikaCSS runs during the build, what the browser receives instead, and how to model dynamic needs without breaking extraction.
---

# Build-time Engine

PikaCSS is easiest to use when you remember one rule: the styling engine runs during the build, not in the browser.

## Zero runtime means the browser receives strings and CSS

Once transformed, the production bundle carries static class names and generated CSS. There is no client-side styling engine resolving style objects on page load.

<<< @/.examples/principles/zero-source.ts

<<< @/.examples/principles/zero-compiled.ts

<<< @/.examples/principles/zero-generated.css

## Why static inputs are non-negotiable

The build-time architecture enables:

- deterministic output
- atomic deduplication
- generated autocomplete
- plugin-controlled config resolution

It also means you must express variation through static shapes: variants, selectors, shortcuts, and variables.

This is not an arbitrary restriction. It is the condition that makes the rest of the system possible.

## Virtual modules and generated files are part of the contract

The import `pika.css` is a virtual module. It resolves to generated CSS at build time. On disk, the integration may also write files such as `pika.gen.ts` and `pika.gen.css`.

Read [Generated Files](/guide/generated-files) before treating any generated artifact as source code.

## Ask the right design question

Do not ask, "How do I make `pika()` accept this runtime value?"

Ask, "Which static representation of this styling problem should my project encode?"

That shift usually leads to a better result anyway.

## What teams usually encode instead

- variant switches instead of runtime-generated style objects
- selectors instead of repeated raw pseudo and media syntax
- variables instead of runtime-computed values inside `pika()`
- shortcuts instead of copied static style bundles

## Next

- [Static Constraints](/getting-started/static-arguments)
- [Generated Files](/guide/generated-files)
- [Responsive And Selectors](/patterns/responsive-and-selectors)
- [Theming And Variables](/patterns/theming-and-variables)
