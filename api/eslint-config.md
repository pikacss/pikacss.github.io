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

ESLint flat config for PikaCSS.

Use [ESLint setup](/getting-started/eslint-config) when you need conceptual usage guidance instead of exact symbol lookup.

## Functions

### default(options?) {#function-default-options}

Creates the configured PikaCSS ESLint flat-config entry.

| Parameter | Type | Description |
|---|---|---|
| `options?` | `PikacssConfigOptions` | Optional canonical config-file selection. |

**Returns:** `Promise<Linter.Config>` - A promise for one flat-config entry.

**Remarks:**

One Config-host load derives both the readonly globals and the private model
captured by the configured rule instance.

```ts
import pikacss from '@pikacss/eslint-config'
export default [await pikacss()]
```

### pikacss(options?) {#function-pikacss-options}

Creates the configured PikaCSS ESLint flat-config entry.

| Parameter | Type | Description |
|---|---|---|
| `options?` | `PikacssConfigOptions` | Optional canonical config-file selection. |

**Returns:** `Promise<Linter.Config>` - A promise for one flat-config entry.

**Remarks:**

One Config-host load derives both the readonly globals and the private model
captured by the configured rule instance.

```ts
import pikacss from '@pikacss/eslint-config'
export default [await pikacss()]
```

## Constants

### recommended {#const-recommended}

Named alias for the default async PikaCSS setup factory.

## Types

### PikacssConfigOptions {#interface-pikacssconfigoptions}

Options accepted by the PikaCSS ESLint configuration factory functions.

| Property | Type | Description | Default |
|---|---|---|---|
| `config?` | `string` | Explicit config-file selection. Omit to use canonical auto-discovery. | — |

**Remarks:**

Project semantics are loaded from the canonical PikaCSS config. The only
public option selects that config file.

```ts
import pikacss from '@pikacss/eslint-config'
export default [await pikacss({ config: './pika.config.mts' })]
```

## Next

* [ESLint setup](/getting-started/eslint-config)
* [Plugin Design Tokens API reference](/api/plugin-design-tokens)
* [API reference overview](/api/)
