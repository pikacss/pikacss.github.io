---
url: /customizations/important.md
description: Make all generated atomic CSS declarations use !important.
---

# Important

Force all generated atomic CSS declarations to include `!important`.

When integrating PikaCSS into an existing project with high-specificity styles, you may need all generated atomic classes to win the cascade. Setting `important: { default: true }` appends `!important` to every generated CSS value.

## Config

```ts
import { defineEngineConfig } from '@pikacss/core'

export default defineEngineConfig({
  important: { default: true },
})
```

## Per-definition override

Each style definition can override the configured default with the `__important` flag:

* `__important: false` opts a definition out when `important.default` is `true`.
* `__important: true` opts a definition in when the default is `false` (or unset).

```ts
// With `important: { default: true }` — this definition renders without `!important`
pika({
  __important: false,
  color: 'blue',
})

// With the default config — only this definition renders with `!important`
pika({
  __important: true,
  color: 'red',
})
```

An explicit `__important` flag also propagates into nested selector blocks, which may override it with their own explicit flag.

## Examples

::: code-group

```ts \[Input]
const className = pika({
	color: 'red',
	fontSize: '16px',
})

// Opt out per definition, even when `important.default` is true
const optOut = pika({
	__important: false,
	color: 'blue',
})

```

```css \[Output]
@layer utilities {
  .pk-a {
    color: red !important;
  }
  .pk-b {
    font-size: 16px !important;
  }
  .pk-c {
    color: blue;
  }
}

```

:::

## Next

* [Preflights](/customizations/preflights) — inject base CSS before utilities.
* [Layers](/customizations/layers) — control cascade ordering.
