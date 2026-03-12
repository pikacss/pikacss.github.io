---
description: Learn how to design a narrow PikaCSS plugin, choose the right first hook, and expose types that feel native to end users.
---

# Create A Plugin

Good PikaCSS plugins usually start small. The best first plugins solve one repeated problem cleanly instead of trying to reimplement half the engine in one package. A narrow plugin is easier to explain, easier to combine with other plugins, and much easier to debug once real projects depend on it.

## Minimal plugin factory

<<< @/.examples/plugin-system/minimal-plugin.ts

If a plugin needs options, export a factory instead of a singleton object. That keeps instance-specific choices explicit and makes config easier to review.

<<< @/.examples/plugin-system/plugin-with-options.ts

## The most useful hook for first plugins

Most first plugins should begin in `configureEngine`.

<<< @/.examples/plugin-system/hook-configure-engine.ts

`configureEngine` gives you access to the stable public APIs for selectors, shortcuts, variables, keyframes, preflights, CSS imports, and autocomplete. That is enough for a large share of plugin ideas.

Use `engine.appendAutocomplete()` as the single place to contribute autocomplete. It can register selectors, style item strings, extra properties, CSS property values, and pattern-based completions in one payload.

<<< @/.examples/plugin-system/autocomplete-api.ts

## When to use other hooks

Reach for earlier or deeper hooks only when `configureEngine` is no longer enough.

- use `configureRawConfig` to insert defaults or shape user input before resolution
- use `configureResolvedConfig` to react after config has been normalized
- use transform hooks when you must rewrite extracted selectors, style items, or style definitions directly

<<< @/.examples/plugin-system/hook-configure-raw-config.ts

<<< @/.examples/plugin-system/hook-configure-resolved-config.ts

## Add types for end users (advanced — only when your plugin adds config keys)

Most plugins do not need module augmentation. If a plugin only calls public engine APIs such as `engine.appendSelectors()`, `engine.appendVariables()`, or `engine.addPreflight()`, TypeScript already knows what is happening. Module augmentation is only needed when your plugin **introduces new top-level config keys** that end users put in `pika.config.ts`.

::: tip Skip this section if your plugin does not extend the config schema
If your plugin registers shortcuts, selectors, or variables using the public engine API, stop here. You do not need to augment any types.
:::

If your plugin does add new config keys, extend the engine's config interface so those keys appear in autocomplete and type-checking without requiring users to cast:

<<< @/.examples/plugin-system/module-augmentation.ts

<<< @/.examples/plugin-system/use-plugin-in-config.ts

## Preflights are powerful and global

Preflights are appropriate for global defaults, resets, tokens, and generated structural CSS. They are not a safe place for arbitrary component styling, because they affect the whole output.

::: warning Do not use preflights for component-level or page-specific styles
Preflights run before any component styles and cannot be conditionally applied. Placing component-specific rules in a preflight will apply those rules globally to every page, causing unexpected visual regressions in unrelated parts of the app.

Good candidates for preflights: CSS resets, `:root` token declarations, base typographic defaults, structural layout foundations.

Poor candidates: button styles, card layouts, modal overlays, page-specific rules.

<<< @/.examples/plugin-system/preflight-bad-example.ts
:::

Use `engine.appendCssImport()` for top-level `@import` rules such as hosted font stylesheets. Those imports must stay at the top of the generated CSS, so they should not be expressed as ordinary preflights.

<<< @/.examples/plugin-system/css-import-api.ts

<<< @/.examples/plugin-system/preflight-definition.ts

<<< @/.examples/plugin-system/preflight-with-layer.ts

<<< @/.examples/plugin-system/preflight-with-id.ts

## A practical first-plugin checklist

1. Give the plugin one clear responsibility.
2. Start in `configureEngine` unless a real limitation proves you need another hook.
3. Ship types when the plugin changes config or autocomplete.
4. Treat preflights and imports as global output decisions.
5. Compare the design against an official plugin before publishing it.

## Reference implementations

The official reset, fonts, icons, and typography plugins show different levels of complexity. Use them as implementation references, not as permission to make every plugin equally broad.

## Next

- [Hook Execution](/plugin-system/hook-execution)
- [Plugin System Overview](/plugin-system/overview)
- [Icons](/plugins/icons)
- [Reset](/plugins/reset)
