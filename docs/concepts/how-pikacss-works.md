---
description: Follow the path from static source input to extracted class names and generated CSS so the build-time engine is easier to reason about.
---

# How PikaCSS Works

At a high level, PikaCSS turns statically analyzable style input into generated atomic CSS.

The important part is not just that CSS gets generated. The important part is that the engine understands the styling input before the application runs.

## 1. Source code provides static style input

You write `pika()` calls in supported files:

<<< @/.examples/principles/build-source.ts

The engine only succeeds when that input is readable from source. It is not evaluating live runtime state.

## 2. The integration extracts and rewrites calls

The integration scans source files, extracts the style input, and turns it into atomic class names.

<<< @/.examples/principles/build-compiled.ts

This is why the docs keep repeating static constraints. Extraction is the whole model.

## 3. The build emits generated CSS

Those class names point to generated CSS declarations:

<<< @/.examples/principles/build-generated.css

## 4. Atomic output is reused when reuse is safe

PikaCSS does not emit one class per component block. It breaks style content into reusable atomic declarations. When the same declaration appears again, the engine can reuse the same atomic class.

<<< @/.examples/principles/build-dedup-source.ts

<<< @/.examples/principles/build-dedup-output.css

## 5. Overlap changes the reuse decision

Reuse is not always safe.

When two declarations overlap in effect, the real winner is determined by stylesheet order, not by the order of tokens in markup. PikaCSS detects those collisions and keeps later overlapping declarations order-sensitive instead of blindly reusing one global atomic class.

Read [Atomic Order And Cascade](/concepts/atomic-order-and-cascade) for the full explanation.

## 6. Plugins extend what the engine can understand

Plugins can modify config, extend selectors, shortcuts, variables, keyframes, autocomplete, and preflights. They change what the engine understands before and during extraction.

That is why PikaCSS can stay relatively small for adopters while still supporting a richer ecosystem.

## What never reaches the browser

The application runtime receives class names and CSS files, not a styling engine that keeps interpreting style objects in the browser.

That is the payoff for the static boundary: runtime stays simple because the engine already finished its work.

## Next

- [Atomic Order And Cascade](/concepts/atomic-order-and-cascade)
- [Build-time Engine](/concepts/build-time-engine)
- [Generated Files](/guide/generated-files)
- [Plugin System Overview](/plugin-system/overview)
