---
url: /customizations/preflights.md
description: Inject base CSS styles before utility classes in PikaCSS.
---

# Preflights

Inject base styles that render before utility classes.

Preflights are CSS rules injected at the top of the generated stylesheet, inside the `preflights` layer by default. Use them for CSS resets, global styles, font-face declarations, or any CSS that should appear before atomic utility classes.

A preflight entry can be:

* A raw CSS string
* A structured definition object (key-value CSS properties)
* An async factory function that receives the engine instance

## Config

```ts
import { defineEngineConfig } from '@pikacss/core'

export default defineEngineConfig({
  preflights: [
    // Raw CSS string
    '*, *::before, *::after { box-sizing: border-box; }',

    // Structured definition
    {
      body: {
        margin: '0',
        fontFamily: 'system-ui, sans-serif',
      },
    },

    // With layer assignment
    {
      layer: 'base',
      preflight: 'html { line-height: 1.5; }',
    },

    // Async factory function
    async (engine, isFormatted) => {
      return '/* dynamic preflight */'
    },
  ],
})
```

## Examples

```ts
import { defineEngineConfig } from '@pikacss/core'

export const preflightConfig = defineEngineConfig({
	preflights: [
		'*, *::before, *::after { box-sizing: border-box; }',
	],
})

```

## Next

* [Variables](/customizations/variables) — define CSS custom properties.
* [Layers](/customizations/layers) — control preflight layer ordering.
