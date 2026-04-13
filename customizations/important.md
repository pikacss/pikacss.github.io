---
url: /customizations/important.md
description: Make all generated atomic CSS declarations use !important.
---

# Important

Force all generated atomic CSS declarations to include `!important`.

When integrating PikaCSS into an existing project with high-specificity styles, you may need all generated atomic classes to win the cascade. Setting `important: true` appends `!important` to every generated CSS value.

## Config

```ts
import { defineEngineConfig } from '@pikacss/core'

export default defineEngineConfig({
  important: true,
})
```

## Examples

::: code-group

```ts \[Input]
const className = pika({
	color: 'red',
	fontSize: '16px',
})

```

```css \[Output]
@layer utilities {
  .pk-a {
    color: red;
  }
  .pk-b {
    font-size: 16px;
  }
}

```

:::

## Next

* [Preflights](/customizations/preflights) — inject base CSS before utilities.
* [Layers](/customizations/layers) — control cascade ordering.
