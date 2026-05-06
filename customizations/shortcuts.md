---
url: /customizations/shortcuts.md
description: Define reusable style aliases that expand to full style definitions.
---

# Shortcuts

Create reusable aliases that expand to full style definitions.

Shortcuts let you define named style combinations that can be referenced as string arguments in `pika()` calls. They work like utility class presets — define once, reuse everywhere.

## Config

Shortcuts can be defined as static pairs or dynamic patterns:

```ts
import { defineEngineConfig } from '@pikacss/core'

export default defineEngineConfig({
  shortcuts: {
    definitions: [
      // Static pair: [name, styleDefinition]
      ['flex-center', {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }],

      // Static pair with nested selectors
      ['btn', {
        'padding': '0.5rem 1rem',
        'borderRadius': '0.25rem',
        'cursor': 'pointer',
        '$:hover': { opacity: '0.8' },
      }],

      // Dynamic pattern: [RegExp, resolver, autocomplete?]
      [/^size-(.+)$/, ([, size]) => ({
        width: size,
        height: size,
      })],
    ],
  },
})
```

Use shortcuts:

```ts
// Reference by name
pika('flex-center')

// Combine with inline styles
pika('flex-center', { gap: '1rem' })
```

## Examples

```ts
import { defineEngineConfig } from '@pikacss/core'

export const shortcutsConfig = defineEngineConfig({
	shortcuts: {
		definitions: [
			['flex-center', {
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
			}],
		],
	},
})

```

## Next

* [Autocomplete](/customizations/autocomplete) — customize IDE completions.
* [Selectors](/customizations/selectors) — define custom selector mappings.
