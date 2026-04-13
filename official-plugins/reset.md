---
url: /official-plugins/reset.md
description: Inject community CSS reset stylesheets as preflight using the reset plugin.
---

# Reset

Inject a community CSS reset stylesheet as preflight CSS.

The reset plugin injects a CSS reset as preflight, ensuring a consistent baseline across browsers. It supports several well-known community resets and creates a dedicated `reset` layer at order `-1`, which places reset styles ahead of the default `preflights` and `utilities` layers unless you define an even lower layer order.

::: code-group

```sh [pnpm]
pnpm add -D @pikacss/plugin-reset
```

```sh [npm]
npm install -D @pikacss/plugin-reset
```

```sh [yarn]
yarn add -D @pikacss/plugin-reset
```

:::

```ts
import { defineEngineConfig } from '@pikacss/core'
import { reset } from '@pikacss/plugin-reset'

export default defineEngineConfig({
	plugins: [reset()],
})
```

`reset()` takes no arguments. Choose the preset with the top-level `reset` engine config option rather than by passing options to the plugin call. The plugin always creates the `reset` layer at order `-1`, so the injected preflight stays ahead of the default `preflights` and `utilities` layers unless your config assigns an even lower layer weight elsewhere.

:::tip Quick rules

* Call `reset()` with no arguments.
* Choose the preset with the top-level `reset` engine config key.
* The plugin creates a dedicated `reset` layer at order `-1`, so it runs before the default `preflights` and `utilities` layers unless you define an even lower custom layer.
  :::

## Config

| Property | Description |
|---|---|
| reset | CSS reset preset to inject. Options: `'andy-bell'`, `'eric-meyer'`, `'modern-normalize'`, `'normalize'`, `'the-new-css-reset'`. Default: `'modern-normalize'`. |

Example:

```ts
import { defineEngineConfig } from '@pikacss/core'
import { reset } from '@pikacss/plugin-reset'

export default defineEngineConfig({
	reset: 'andy-bell',
	plugins: [reset()],
})
```

> See [API Reference — Plugin Reset](/api/plugin-reset) for full type signatures and defaults.

## Next

* [Typography](/official-plugins/typography) — semantic prose styling.
* [Icons](/official-plugins/icons) — icon integration via Iconify.
