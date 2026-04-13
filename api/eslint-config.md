---
url: /api/eslint-config.md
description: >-
  Generated API reference for @pikacss/eslint-config from exported surface and
  JSDoc.
---

# ESLint Config API reference

* Package: `@pikacss/eslint-config`
* Generated from the exported surface and JSDoc in `packages/eslint-config/src/index.ts`.
* Source files: `packages/eslint-config/src/index.ts`

## Package summary

ESLint flat config for PikaCSS

Use [ESLint setup](/getting-started/eslint-config) when you need conceptual usage guidance instead of exact symbol lookup.

## Functions

### default(options?) {#function-default-options}

Default export that returns the recommended PikaCSS ESLint flat-config.

| Parameter | Type | Description |
|---|---|---|
| `options?` | `PikacssConfigOptions` | Configuration options to customise which function name the rules detect. |

**Returns:** `Linter.Config` - A flat-config entry identical to what `recommended()` produces.

**Remarks:**

This is a convenience alias for `recommended()` so consumers can write a
simple default import.

```ts
import pikacss from '@pikacss/eslint-config'
export default [pikacss()]
```

### recommended(options?) {#function-recommended-options}

Returns the recommended PikaCSS ESLint flat-config object with all rules enabled at error level.

| Parameter | Type | Description |
|---|---|---|
| `options?` | `PikacssConfigOptions` | Configuration options to customise which function name the rules detect. |

**Returns:** `Linter.Config` - A flat-config entry with the PikaCSS plugin registered and all recommended rules enabled.

**Remarks:**

This is the preferred way to add PikaCSS linting to a project. It registers
the plugin under the `pikacss` namespace and turns on `no-dynamic-args` at
`'error'` severity.

```ts
import { recommended } from '@pikacss/eslint-config'
export default [recommended()]
```

## Constants

### plugin {#const-plugin}

ESLint plugin object exposing all PikaCSS rules.

**Remarks:**

Register this plugin under the `pikacss` namespace in your ESLint flat
config. In most cases you should use the `recommended()` preset instead
of wiring rules manually.

```ts
import { plugin } from '@pikacss/eslint-config'
export default [{ plugins: { pikacss: plugin } }]
```

## Types

### PikacssConfigOptions {#interface-pikacssconfigoptions}

Options accepted by the PikaCSS ESLint configuration factory functions.

| Property | Type | Description | Default |
|---|---|---|---|
| `fnName?` | `string` | Base PikaCSS function name the rules should detect. | `'pika'` |

**Remarks:**

Pass these options to `recommended()` or the default export to customise
which base function name the rules match. When omitted, all rules default
to detecting `pika`.

```ts
import pikacss from '@pikacss/eslint-config'
export default [pikacss({ fnName: 'css' })]
```

## Next

* [ESLint setup](/getting-started/eslint-config)
* [Plugin Typography API reference](/api/plugin-typography)
* [API reference overview](/api/)
