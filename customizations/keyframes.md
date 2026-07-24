---
url: /customizations/keyframes.md
description: Define CSS @keyframes animations in PikaCSS engine configuration.
---

# Keyframes

Register CSS `@keyframes` animations with the engine.

PikaCSS lets you define keyframe animations in your engine configuration. Animation names are registered for autocomplete, and each `@keyframes` rule is rendered as preflight CSS only when its name is referenced by an `animation` or `animation-name` atomic style — unused keyframes are pruned from the output. Set `pruneUnused: false` (config-level default, or per definition via the tuple's fourth element / the object form's `pruneUnused` field) to always emit a keyframes rule, e.g. when it is consumed by external CSS.

## Config

Keyframes can be defined as tuples or objects:

```ts
import { defineEngineConfig } from '@pikacss/core'

export default defineEngineConfig({
  keyframes: {
    definitions: [
      // Tuple form: [name, frames]
      ['fade-in', {
        from: { opacity: '0' },
        to: { opacity: '1' },
      }],

      // With percentages
      ['slide-in', {
        '0%': { transform: 'translateX(-100%)' },
        '100%': { transform: 'translateX(0)' },
      }],

      // Name only (frames defined elsewhere, e.g. in CSS)
      'spin',
    ],
  },
})
```

Use the animation name in your styles:

```ts
pika({
  animation: 'fade-in 0.3s ease-in-out',
})
```

## Examples

```ts
import { defineEngineConfig } from '@pikacss/core'

export const keyframesConfig = defineEngineConfig({
	keyframes: {
		definitions: [
			['fade-in', { from: { opacity: '0' }, to: { opacity: '1' } }],
		],
	},
})

```

## Next

* [Selectors](/customizations/selectors) — create custom selector shortcuts.
* [Variables](/customizations/variables) — define CSS custom properties.
