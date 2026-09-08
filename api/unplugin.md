---
url: /api/unplugin.md
description: >-
  Generated API reference for @pikacss/unplugin-pikacss from exported surface
  and JSDoc.
---

# Unplugin API reference

* Package: `@pikacss/unplugin-pikacss`
* Generated from the exported surface and JSDoc in `packages/unplugin/src/index.ts`.
* Public entries: `@pikacss/unplugin-pikacss`, `@pikacss/unplugin-pikacss/rolldown`, `@pikacss/unplugin-pikacss/rollup`, `@pikacss/unplugin-pikacss/rspack`, `@pikacss/unplugin-pikacss/vite`, `@pikacss/unplugin-pikacss/webpack`
* Source files: `packages/unplugin/src/index.ts`, `packages/unplugin/src/rolldown.ts`, `packages/unplugin/src/rollup.ts`, `packages/unplugin/src/rspack.ts`, `packages/unplugin/src/types.ts`, `packages/unplugin/src/vite.ts`, `packages/unplugin/src/webpack.ts`

## Package summary

Bundler adapters for the Rollup and Webpack families. Re-exports the public surface of [`@pikacss/integration`](/api/integration).

Use [Unplugin integration](/integrations/unplugin) when you need conceptual usage guidance instead of exact symbol lookup.

## Constants

### unpluginFactory {#const-unpluginfactory}

Shared factory primitive for the five officially supported bundler hosts.

**Remarks:**

The public structural type intentionally does not expose Unplugin's all-host
factory type. Supported adapter subpaths bind this implementation back to
Unplugin internally; root authoring/Typegen consumers therefore do not acquire
type dependencies on unsupported bundler hosts.

## Types

### PluginOptions {#interface-pluginoptions}

User-facing bootstrap options for the PikaCSS bundler adapters.

| Property | Type | Description | Default |
|---|---|---|---|
| `config?` | `string` | Explicit path to the project config, resolved relative to `cwd`. | — |
| `cwd?` | `string` | Project root used by the host adapter when one is not supplied by the bundler. | — |

**Remarks:**

Project semantics come from the file-based (or automatically discovered)
project config. The adapter only uses these options to locate that project
and, optionally, select the config file explicitly.

## Public subpath: `@pikacss/unplugin-pikacss/rolldown`

Import this entry as `@pikacss/unplugin-pikacss/rolldown`.

### default(options?) {#subpath-rolldown-function-default-options}

PikaCSS plugin factory for Rolldown.

Wraps the shared PikaCSS unplugin factory into a Rolldown-compatible
plugin. Accepts optional PluginOptions to select the project config
and root.

| Parameter | Type | Description |
|---|---|---|
| `options?` | `PluginOptions` | Optional project config path and host project root. |

**Returns:** `RolldownPlugin<any> \| RolldownPlugin<any>[]`

```ts
import pikacss from '@pikacss/unplugin-pikacss/rolldown'

export default {
  plugins: [pikacss()],
}
```

## Public subpath: `@pikacss/unplugin-pikacss/rollup`

Import this entry as `@pikacss/unplugin-pikacss/rollup`.

### default(options?) {#subpath-rollup-function-default-options}

PikaCSS plugin factory for Rollup.

Wraps the shared PikaCSS unplugin factory into a Rollup-compatible
plugin. Accepts optional PluginOptions to select the project config
and root.

| Parameter | Type | Description |
|---|---|---|
| `options?` | `PluginOptions` | Optional project config path and host project root. |

**Returns:** `RollupPlugin<any> \| RollupPlugin<any>[]`

```ts
import pikacss from '@pikacss/unplugin-pikacss/rollup'

export default {
  plugins: [pikacss()],
}
```

## Public subpath: `@pikacss/unplugin-pikacss/rspack`

Import this entry as `@pikacss/unplugin-pikacss/rspack`.

### default(options?) {#subpath-rspack-function-default-options}

PikaCSS plugin factory for Rspack.

Wraps the shared PikaCSS unplugin factory into an Rspack-compatible
plugin. Accepts optional PluginOptions to select the project config
and root.

| Parameter | Type | Description |
|---|---|---|
| `options?` | `PluginOptions` | Optional project config path and host project root. |

**Returns:** `RspackPluginInstance`

```ts
import pikacss from '@pikacss/unplugin-pikacss/rspack'

module.exports = {
  plugins: [pikacss()],
}
```

## Public subpath: `@pikacss/unplugin-pikacss/vite`

Import this entry as `@pikacss/unplugin-pikacss/vite`.

### default(options?) {#subpath-vite-function-default-options}

PikaCSS plugin factory for Vite.

Wraps the shared PikaCSS unplugin factory into a Vite-compatible plugin.
Accepts optional PluginOptions to select the project config and
root. Returns a standard Vite `Plugin`.
The plugin declares `enforce: 'pre'`, so PikaCSS template transforms run
before framework compiler plugins regardless of the user's `plugins` order.

| Parameter | Type | Description |
|---|---|---|
| `options?` | `PluginOptions` | Optional project config path and host project root. |

**Returns:** `Plugin<any>`

```ts
import pikacss from '@pikacss/unplugin-pikacss/vite'

export default defineConfig({
  plugins: [pikacss()],
})
```

## Public subpath: `@pikacss/unplugin-pikacss/webpack`

Import this entry as `@pikacss/unplugin-pikacss/webpack`.

### default(options?) {#subpath-webpack-function-default-options}

PikaCSS plugin factory for webpack.

Wraps the shared PikaCSS unplugin factory into a webpack-compatible
plugin. Accepts optional PluginOptions to select the project config
and root.

| Parameter | Type | Description |
|---|---|---|
| `options?` | `PluginOptions` | Optional project config path and host project root. |

**Returns:** `WebpackPluginInstance`

```ts
import pikacss from '@pikacss/unplugin-pikacss/webpack'

module.exports = {
  plugins: [pikacss()],
}
```

## Next

* [Unplugin integration](/integrations/unplugin)
* [Nuxt API reference](/api/nuxt)
* [API reference overview](/api/)
