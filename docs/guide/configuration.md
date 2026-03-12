---
description: Learn how to separate engine config, external plugins, and integration options so PikaCSS stays predictable as a project grows.
---

# Configuration

PikaCSS configuration becomes much easier once you stop treating it as one flat object. There are three distinct buckets, and each one solves a different problem.

1. top-level engine config changes how styles are understood and emitted
2. the `plugins` array registers installable external plugins
3. integration options control scanning, generated files, and transform behavior

## When to add a config file

Zero-config works for a first validation build. Add a config file as soon as any of these signals appear:

- The same selector name, shortcut recipe, or variable token appears in two or more components.
- A second developer joins the project and needs to know which naming conventions to follow.
- The team wants consistent breakpoint aliases, shared theme tokens, or reusable shortcut recipes across the codebase.
- A plugin requires configuration that should be shared across all builds.

The earliest reliable signal is duplication: if you defined the same `screen-md` breakpoint in two places, move it into a shared config before it appears in a third.

## Engine config

Use engine config for styling behavior that should stay true no matter which bundler is loading the engine.

- plugins
- autocomplete
- selectors
- shortcuts
- variables
- keyframes
- layers
- cssImports
- preflights
- prefix and selector defaults

<<< @/.examples/guide/config-basic.ts

<<< @/.examples/guide/config-full-example.ts

Keep this file focused on shared styling rules. If a setting only exists to help the bundler find files or choose an output path, it belongs in the integration layer instead.

## Custom autocomplete

Use `autocomplete` when your design system has stable tokens, selectors, or style item strings that should feel native in editor suggestions.

Those additions merge with built-in engine autocomplete and plugin-provided autocomplete, then flow into `pika.gen.ts`.

<<< @/.examples/guide/config-autocomplete.ts

## Semantic variable autocomplete

Use `variables.*.semanticType` when a token belongs to a stable CSS value family and should only surface for matching properties.

Current built-in semantic families are:

- `color`
- `length`
- `time`
- `number`
- `easing`
- `font-family`

`semanticType` expands into the built-in property family first, then unions with any explicit `autocomplete.asValueOf` targets you add yourself.

<<< @/.examples/guide/config-variables-semantic-type.ts

## Core features are configured by top-level keys

Variables, keyframes, selectors, shortcuts, and `important` are part of the engine itself. They are not registered through the external `plugins` array.

Older references may call them built-in plugins, but the user-facing rule is simpler: if the config key is `variables`, `keyframes`, `selectors`, `shortcuts`, or `important`, keep it at the top level.

<<< @/.examples/guide/core-features-config.ts

| Core feature | Where to configure it |
| --- | --- |
| variables | `variables` |
| keyframes | `keyframes` |
| selectors | `selectors` |
| shortcuts | `shortcuts` |
| important | `important` |

## External plugins go in `plugins`

<<< @/.examples/guide/config-plugins.ts

::: warning Common misunderstanding
Official plugins such as reset, icons, fonts, and typography are installed modules. They do not replace top-level core feature config, and core feature config does not register them for you.
:::

## Build plugin options

Use integration options for file scanning, config path resolution, generated file paths, and alternate function names.

<<< @/.examples/integrations/plugin-options.ts

That separation matters because integration options are adapter-specific, while engine config should stay portable across adapters.

## Layers, CSS imports, preflights, and ordering

For larger systems, CSS order must be intentional. Layers make output precedence reviewable instead of accidental.

Use `cssImports` when top-level `@import` rules need to stay ahead of generated layers. Use layered preflights when resets or base rules need a stable slot in the output.

<<< @/.examples/guide/config-layers.ts

<<< @/.examples/guide/config-css-imports.ts

<<< @/.examples/guide/config-preflights-with-layer.ts

## Type helpers

PikaCSS exports identity helpers so config and extracted style objects stay typed without changing runtime behavior.

- `defineEngineConfig()`
- `defineStyleDefinition()`
- `defineSelector()`
- `defineShortcut()`
- `defineKeyframes()`
- `defineVariables()`
- `defineEnginePlugin()`

<<< @/.examples/guide/built-ins/style-definition-define-helper.ts

## What most teams should standardize

- shared selectors
- token variables
- shortcut naming
- plugin usage
- layer strategy
- ESLint enforcement for static inputs

## Next

- [Generated Files](/guide/generated-files)
- [Core Features Overview](/guide/core-features-overview)
- [Theming And Variables](/patterns/theming-and-variables)
- [Plugin System Overview](/plugin-system/overview)
