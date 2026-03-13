---
description: Get quick answers to common adoption questions about build-time behavior, atomic output, generated files, and where PikaCSS fits best.
---

# FAQ

## Is `pika()` a runtime function?

No. `pika()` is build-time input. The engine scans the call, extracts the style data it can understand statically, and generates CSS before the app runs.

## Why do static constraints matter so much?

Static input is what makes deterministic CSS generation, deduplication, and generated autocomplete possible. If the build cannot read the styling intent from source, the engine cannot safely produce the output you expect.

See [Static Constraints](/getting-started/static-arguments).

## What is the fastest way to know whether PikaCSS fits my project?

Ask whether most styling in the project can be expressed as static source input. If the answer is no, the mismatch is structural, not something a few helper utilities will hide.

## Is PikaCSS just another utility CSS framework?

No. The output is atomic CSS, but the authoring model is style-definition driven. You can write style objects, selectors, variables, shortcuts, and plugins instead of only choosing from a fixed utility dictionary.

<<< @/.examples/community/faq-atomic.pikainput.ts

<<< @/.examples/community/faq-atomic.pikaoutput.css

## Does class token order decide the final result?

Not by itself. In atomic CSS, equal-specificity declarations are still resolved by stylesheet order. PikaCSS tracks overlapping property effects so later overlapping declarations can remain locally meaningful when order actually affects the cascade.

See [Atomic Order And Cascade](/concepts/atomic-order-and-cascade).

## Can I use nested selectors?

Yes. Nested selectors are part of the normal style-definition model, not a separate escape hatch.

<<< @/.examples/community/faq-nested.pikainput.ts

## Should I keep zero-config forever?

Usually no. Zero-config is an onboarding convenience. Real projects should centralize naming, variables, selectors, shortcuts, and plugins in config as soon as patterns become shared.

## Should I edit `pika.gen.ts` or `pika.gen.css`?

No. Both files are generated artifacts. Fix the engine config, source usage, or integration wiring instead.

## When should I use the ESLint integration?

As early as possible. It prevents runtime-style habits from spreading before the codebase has strong conventions.

## What should I inspect when setup looks wrong?

Start with scan coverage, generated files, and whether the generated CSS is actually imported. Those three checks explain most setup failures much faster than speculative config changes.

## Next

- [Static Constraints](/getting-started/static-arguments)
- [Common Problems](/troubleshooting/common-problems)
- [Configuration](/guide/configuration)
- [Plugin System Overview](/plugin-system/overview)
