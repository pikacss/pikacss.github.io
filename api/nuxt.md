---
url: /api/nuxt.md
description: >-
  Generated API reference for @pikacss/nuxt-pikacss from exported surface and
  JSDoc.
---

# Nuxt API reference

* Package: `@pikacss/nuxt-pikacss`
* Generated from the exported surface and JSDoc in `packages/nuxt/src/index.ts`.
* Source files: `packages/nuxt/src/index.ts`

## Package summary

Nuxt module for PikaCSS

Use [Nuxt integration](/integrations/nuxt) when you need conceptual usage guidance instead of exact symbol lookup.

## Types

### default {#unknown-default}

PikaCSS Nuxt module.

Integrates PikaCSS into a Nuxt application by registering a Vite plugin
(with `enforce: 'pre'`) and a Nuxt plugin template that imports the
generated `pika.css` stylesheet.

Configure options under the `pikacss` key in `nuxt.config`. When no
options are provided, the module scans `**\/*.{js,ts,jsx,tsx,vue}` by default.

### ModuleOptions {#type-moduleoptions}

Configuration options for the PikaCSS Nuxt module.

**Remarks:**

Mirrors the unplugin `PluginOptions` with `currentPackageName` omitted because
the Nuxt module supplies it automatically.

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@pikacss/nuxt-pikacss'],
  pikacss: {
    config: './pika.config.ts',
    scan: { include: ['**\/*.vue'] },
  },
})
```

## Module augmentations

### NuxtConfig (@nuxt/schema) {#augmentation-nuxtconfig-nuxt-schema}

| Property | Type | Description | Default |
|---|---|---|---|
| `pikacss?` | `ModuleOptions` | PikaCSS module options used during Nuxt configuration merging. | `undefined` |

### NuxtOptions (@nuxt/schema) {#augmentation-nuxtoptions-nuxt-schema}

| Property | Type | Description | Default |
|---|---|---|---|
| `pikacss?` | `ModuleOptions` | Resolved PikaCSS module options available at runtime on `nuxt.options`. | `undefined` |

## Next

* [Nuxt integration](/integrations/nuxt)
* [Plugin Reset API reference](/api/plugin-reset)
* [API reference overview](/api/)
