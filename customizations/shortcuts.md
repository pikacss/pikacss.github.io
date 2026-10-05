---
url: /customizations/shortcuts.md
description: Define reusable object-form style-item aliases and dynamic shortcut families.
---

# Shortcuts

Shortcuts are named reusable `StyleItem` sequences. They are ordinary string style items when consumed by `pika()`.

## Static shortcuts

```ts
import { defineConfig } from '@pikacss/unplugin-pikacss'

export default defineConfig({
  engine: {
    shortcuts: {
      definitions: [
        {
          name: 'flex-center',
          value: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          },
        },
        {
          name: 'btn',
          value: {
            'padding': '0.5rem 1rem',
            'borderRadius': '0.25rem',
            '$:hover': { opacity: '0.8' },
          },
        },
        {
          name: 'btn-primary',
          value: ['btn', { backgroundColor: 'royalblue', color: 'white' }],
        },
      ],
    },
  },
})
```

`value` accepts one style item or an array of style items. Array composition replaces the removed `__shortcut` pseudo-property. Every configured static shortcut receives a resolved **PikaCSS Preview** in Typegen/IDE hover documentation when it produces renderable CSS. An authored `description` is additive and appears before the preview.

Use shortcuts directly:

```ts
pika('flex-center')
pika('btn-primary', { marginTop: '1rem' })
```

## Dynamic shortcuts

```ts
export default defineConfig({
  engine: {
    shortcuts: {
      definitions: [
        {
          pattern: /^size-(.+)$/,
          inputType: '`size-${string}`',
          resolve: ([, size]) => ({ width: size, height: size }),
          autocomplete: ['size-1rem', 'size-2rem'],
        },
      ],
    },
  },
})
```

The explicit `inputType` describes the accepted TypeScript input family. `autocomplete` contributes deterministic concrete members; each accepted member receives a resolved **PikaCSS Preview** (and any resolver-supplied preview images) when preview resolution succeeds. Preview resolution follows the runtime plugin transform order, but uses isolated plugin state and does not commit atomic styles or seed runtime shortcut caches. If plugin state cannot be isolated safely, or any other preview-only step fails, PikaCSS reports a diagnostic and keeps the concrete Typegen member plus its authored `description`. Runtime source usage does not mutate Typegen.

## Examples

```ts
import { defineEngineConfig } from '@pikacss/core'

export const shortcutsConfig = defineEngineConfig({
	shortcuts: {
		definitions: [
			{ name: 'flex-center', value: {
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
			} },
		],
	},
})

```

## Next

* [Autocomplete](/customizations/autocomplete)
* [Selectors](/customizations/selectors)
