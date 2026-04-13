---
url: /plugin-development/create-a-plugin.md
description: Learn how to create a PikaCSS engine plugin with defineEnginePlugin.
---

# Create a Plugin

Build custom PikaCSS engine plugins to extend the engine with new capabilities.

## Structure

A PikaCSS plugin is a function that returns an `EnginePlugin` object. The recommended pattern:

```ts
import { defineEnginePlugin } from '@pikacss/core'

export function myPlugin() {
	return defineEnginePlugin({
		name: 'my-plugin',
		configureRawConfig: (config) => {
			config.layers ??= {}
			config.layers['my-layer'] = 5
		},
		configureEngine: async (engine) => {
			engine.addPreflight('/* my-plugin preflight */')
		},
	})
}

```

## defineEnginePlugin

The `defineEnginePlugin` helper provides type inference for the plugin object. It accepts an object with:

* `name` — a unique string identifying the plugin.
* `order` — optional execution order: `'pre'`, `'post'`, or omit for default.
* Hook methods — functions called at specific points in the engine lifecycle.

The example above uses `defineEnginePlugin()` directly so the `config` and `engine` hook parameters stay inferred without additional helper types.

## order

Plugin execution order determines when a plugin's hooks run relative to other plugins:

| Value | Behavior |
|-------|----------|
| `'pre'` | Runs before default-order plugins |
| *(omitted)* | Default order — runs in registration order |
| `'post'` | Runs after default-order plugins |

Within the same order group, plugins run in the order they appear in the `plugins` array.

## Next

* [Available Hooks](/plugin-development/available-hooks) — all lifecycle hooks you can implement.
* [Type Augmentation](/plugin-development/type-augmentation) — extend PikaCSS types for your plugin.
* [Define Helpers](/plugin-development/define-helpers) — identity helpers for type inference.
