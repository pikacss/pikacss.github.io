---
description: Understand what PikaCSS actually provides, where its build-time model fits, and where it is intentionally restrictive.
---

# What Is PikaCSS?

PikaCSS is a build-time atomic CSS-in-JS engine. You author style definitions in JavaScript or TypeScript, the integration scans supported source files for `pika()` calls, and the build rewrites those calls into class names plus generated CSS.

The useful distinction is not that the API happens to look like CSS-in-JS. The useful distinction is that style input is treated as build input, not runtime logic.

That makes PikaCSS a good fit for teams that want:

- CSS-in-JS authoring without runtime styling cost.
- TypeScript autocomplete for style definitions and engine-provided extensions.
- Selectors, shortcuts, variables, and keyframes in the same authoring model.
- Generated output that can be inspected instead of guessed at.

It is a poor fit if the design system depends on computing style objects from arbitrary runtime expressions. PikaCSS is opinionated on purpose: the engine only works when it can understand the styling input during the build.

::: tip When PikaCSS shines
PikaCSS is strongest when styles are known from source code structure: component variants, responsive rules, theme selectors, design tokens, and reusable shortcuts.
:::

## What you actually author

You still write style objects, nested selectors, and composition in source files. The difference is that the browser never receives that object model as a styling engine. PikaCSS extracts what it can understand during the build, emits atomic CSS, and leaves runtime with class-name output.

Class selectors are the default output shape, not the only one. If a project needs a different selector shell, engine config can change the default selector template without changing the static authoring model itself.

<<< @/.examples/getting-started/pika-basic.pikainput.ts

## Why teams choose it

Teams usually adopt PikaCSS for a combination of four reasons:

1. They want styling output with no client-side style engine.
2. They still want to author styles in TypeScript with autocomplete.
3. They want to extend the engine through selectors, shortcuts, variables, and plugins instead of inventing utility vocabularies for everything.
4. They want overlapping atomic declarations to preserve local author intent instead of depending on incidental stylesheet order.

That fourth point is one of the real differentiators. PikaCSS does not maximize utility reuse at the expense of correct local cascade behavior.

## Where it stops on purpose

PikaCSS only works because `pika()` is build input. The integration has to understand the argument shape from source code alone.

That means the adoption question is not whether the syntax feels convenient. The adoption question is whether your team can express most styling as statically analyzable input.

If the answer is yes, PikaCSS gives you static CSS output, generated files, autocomplete, and a more predictable atomic cascade story. If the answer is no, the restrictions are telling you the model is the wrong fit.

## How it differs from other styling tools

Most CSS-in-JS tools optimize for runtime flexibility. Most utility-first tools optimize for predefined utility vocabularies. PikaCSS sits in a different place:

- You still author style objects directly.
- Production ships generated CSS, not runtime style injection.
- The engine stays extensible through hooks instead of forcing every workflow into utility naming conventions.

## Core features and external plugins solve different jobs

The docs use core features for selectors, shortcuts, variables, keyframes, and `important`. These are engine capabilities configured through top-level config keys.

External plugins such as icons, reset, typography, and fonts belong in the `plugins` array.

That distinction matters because it tells the team whether it is configuring the engine itself or installing an extra package on top of it.

## When PikaCSS is a poor fit

PikaCSS has a hard static boundary. These situations are poor fits and proceeding anyway will cause friction, not just inconvenience:

- **Styles computed from runtime data** — if the color, size, or layout values come from an API response, user profile, or runtime calculation, PikaCSS cannot extract them at build time.
- **Projects without a build step** — PikaCSS requires a bundler integration. CDN-only or script-tag projects have no extraction pipeline.
- **Tailwind-committed teams without migration budget** — switching from Tailwind means replacing utility class names with `pika()` calls and engine config. Teams with no capacity for that migration should evaluate PikaCSS in a future cycle.
- **Projects requiring broad IE support** — PikaCSS emits modern CSS including custom properties, which do not polyfill cleanly in older browsers.
- **Teams that need arbitrary CSS expression power at scale** — if the design system deliberately mixes runtime-computed styles with static ones, the static extractor becomes a bottleneck, not an enabler.

When one of these conditions applies to most of the codebase, stop evaluating PikaCSS and adopt a tool that matches the actual constraints.

## Evaluate the model before the syntax

PikaCSS does not promise that any valid JavaScript expression can become style input. If the engine cannot analyze an expression up front, it cannot safely transform it.

::: warning Do not evaluate PikaCSS like a runtime API
If you judge PikaCSS by trying dynamic function calls, mutable state, ternaries that depend on runtime data, or computed member access inside `pika()`, you are testing the wrong model.
:::

## Who should keep reading

- Teams evaluating the tradeoffs should read [Static Constraints](/getting-started/static-arguments) immediately after this page.
- New adopters should continue to [Installation](/getting-started/installation) once the constraints look acceptable.
- Plugin authors should skip ahead to [Plugin System Overview](/plugin-system/overview).

## Next

- [Static Constraints](/getting-started/static-arguments)
- [Installation](/getting-started/installation)
- [How PikaCSS Works](/concepts/how-pikacss-works)
- [Core Features Overview](/guide/core-features-overview)
