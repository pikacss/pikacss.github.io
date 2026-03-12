---
description: Understand what PikaCSS plugins can extend, how plugin hooks fit together, and where plugin authoring belongs in the docs journey.
---

# Plugin System Overview

PikaCSS plugins are the public extension mechanism for the engine. They let you add behavior without forking core, whether that means mutating config, registering selectors and shortcuts, emitting preflights, augmenting autocomplete, or transforming extracted style input before CSS is generated.

## Who this section is for

This chapter is for readers who want to extend PikaCSS itself rather than only consume it. Read it when you want to:

- build a custom plugin for one product or design system
- understand how official plugins are structured
- work with lifecycle hooks instead of only user-facing config

## Prerequisites

Before writing a plugin, you should have read and understood the following pages:

- [Static Constraints](/getting-started/static-arguments) — the static input model is the core constraint plugins operate within
- [Build-Time Engine](/concepts/build-time-engine) — how the engine processes source files
- [Core Features Overview](/guide/core-features-overview) — the public engine capabilities plugins can build on top of
- [Configuration](/guide/configuration) — the three config buckets and what the engine accepts

Skipping these means you are likely to reach for transform hooks when public engine APIs would be simpler and safer.

## Official plugin reference matrix

Use this table to pick an official plugin as a reference implementation before starting a new plugin:

| Use case | Reference plugin | Why |
| --- | --- | --- |
| Simple global resets or preflights | [Reset](/plugins/reset) | Shows minimal `configureEngine` usage with preflights |
| Collection resolution and build-time expansion | [Icons](/plugins/icons) | Shows async config resolution and build-time asset expansion |
| Provider abstraction and CSS imports | [Fonts](/plugins/fonts) | Shows `engine.appendCssImport()` and provider switching |
| Scoped variables and composable shortcuts | [Typography](/plugins/typography) | Shows variable scoping plus shortcut recipes working together |

Start with Reset if your plugin is small. Start with Typography if your plugin combines variables and shortcuts.

## What an engine plugin is

Plugins are plain objects declared with `defineEnginePlugin()`.

<<< @/.examples/plugin-system/overview-minimal-plugin.ts

The public interface is intentionally small: a plugin has a name, optional ordering, and optional hooks.

<<< @/.examples/plugin-system/overview-engine-plugin-interface.ts

## The plugin lifecycle in one sentence

Plugins can change raw config, react to resolved config, register behavior on the engine, transform extracted input, and observe downstream events such as preflight or autocomplete updates.

## How to think about hooks

- use `configureRawConfig` when you need to shape user config before defaults settle
- use `configureResolvedConfig` when you need the final resolved picture before acting
- use `configureEngine` when you want to call public engine APIs such as `engine.shortcuts.add()` or `engine.appendCssImport()`
- use transform hooks only when registration APIs are not enough
- use sync notification hooks when you only need observation, logging, or side effects

The hook choice matters because later hooks are easier to reason about. Most plugins stay simpler when they postpone intervention for as long as possible.

## Ordering rules

Plugins run in `pre`, default, then `post` order.

<<< @/.examples/plugin-system/overview-plugin-order.ts

That ordering only defines how user plugins relate to one another. It does not move your plugin ahead of core internals that have already been wired into the engine pipeline.

## What plugin authors need to know early

1. Core feature config and external plugins are different extension surfaces.
2. The public engine APIs cover many common plugin needs without custom transforms.
3. Preflights and CSS imports affect global output and deserve extra restraint.
4. Type augmentation is part of plugin design when users gain new config or autocomplete affordances.

## Recommended learning path

Start with [Create A Plugin](/plugin-system/create-plugin), then continue to [Hook Execution](/plugin-system/hook-execution). After that, inspect official plugins as reference implementations for real packaging and API design.

## Next

- [Create A Plugin](/plugin-system/create-plugin)
- [Hook Execution](/plugin-system/hook-execution)
- [Core Features Overview](/guide/core-features-overview)
