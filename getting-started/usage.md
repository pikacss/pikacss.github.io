---
url: /getting-started/usage.md
description: Learn the compile-time pika() authoring model and common style patterns.
---

# Usage

Write CSS property names and nested selectors as static JavaScript values passed to the configured Pika callable. The integration evaluates the call at build time and replaces it with generated atomic class names.

## Your first styled component

Do not import `pika`. With the default single-entry configuration, use the generated global directly:

::: code-group

```vue [Vue]
<script setup lang="ts">
const buttonClass = pika({
  padding: '0.5rem 1rem',
  border: 'none',
  borderRadius: '8px',
  backgroundColor: '#3b82f6',
  color: 'white',
  cursor: 'pointer',
  '$:hover': {
    backgroundColor: '#2563eb',
  },
})
</script>

<template>
  <button :class="buttonClass">Click me</button>
</template>
```

```tsx [React]
const buttonClass = pika({
  padding: '0.5rem 1rem',
  border: 'none',
  borderRadius: '8px',
  backgroundColor: '#3b82f6',
  color: 'white',
  cursor: 'pointer',
  '$:hover': {
    backgroundColor: '#2563eb',
  },
})

export function Button() {
  return <button className={buttonClass}>Click me</button>
}
```

:::

Each declaration becomes an atomic rule in the logical CSS module:

```css \[generated CSS]
@layer utilities {
  .pk-a {
    padding: 0.5rem 1rem;
  }
  .pk-b {
    border: none;
  }
  .pk-c {
    border-radius: 8px;
  }
  .pk-d {
    background-color: #3b82f6;
  }
  .pk-e {
    color: white;
  }
  .pk-f {
    cursor: pointer;
  }
  .pk-g:hover {
    background-color: #2563eb;
  }
}

```

## One callable, one configured output format

There is only the configured base callable such as `pika(...)`. The old `.str()` and `.arr()` callable variants do not exist.

The project's `transformedFormat` controls the replacement shape:

```ts
import { defineConfig } from '@pikacss/unplugin-pikacss'

export default defineConfig({
  transformedFormat: 'array', // default: 'string'
})
```

With the default `'string'`, a call becomes a space-separated string. With `'array'`, the same call becomes an array of class-name strings. Compiler, generated Typegen, and ESLint all consume this canonical project setting.

## Static authoring requirement

PikaCSS is a compile-time transform. Base-call arguments must stay inside the supported bounded-static expression grammar; arbitrary runtime values and ordinary function calls are not evaluated by PikaCSS.

Plugins may expose configured static authoring members such as `pika.sc`, `pika.var`, `pika.kf`, or `pika.tk`. Those members are valid only inside a base `pika(...)` argument tree and are resolved during prepare-time static evaluation.

## Common patterns

### Basic CSS properties

::: info CSS numeric values
Prefer CSS strings such as `opacity: '0.5'` or `zIndex: '10'`. Numeric `0` remains valid where unitless zero is unambiguous.
:::

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

### Pseudo-classes and pseudo-elements

Use `$` as the current generated selector placeholder:

::: code-group

```ts \[Input]
const className = pika({
	color: 'blue',
	'$:hover': {
		color: 'red',
	},
})

```

```css \[Output]
@layer utilities {
  .pk-a {
    color: blue;
  }
  .pk-b:hover {
    color: red;
  }
}

```

:::

### Responsive styles

::: code-group

```ts \[Input]
const className = pika({
	fontSize: '14px',
	'@media (min-width: 768px)': {
		fontSize: '16px',
	},
	'@media (min-width: 1024px)': {
		fontSize: '18px',
	},
})

```

```css \[Output]
@layer utilities {
  .pk-a {
    font-size: 14px;
  }
  @media (min-width: 768px) {
    .pk-b {
      font-size: 16px;
    }
  }
  @media (min-width: 1024px) {
    .pk-c {
      font-size: 18px;
    }
  }
}

```

:::

### Custom selectors

Define selectors with the current object-only grammar:

```ts
import { defineConfig } from '@pikacss/unplugin-pikacss'

export default defineConfig({
  engine: {
    selectors: {
      definitions: [
        { name: '@dark', value: 'html.dark $' },
      ],
    },
  },
})
```

::: code-group

```ts \[Input]
const className = pika({
	color: 'black',
	'@dark': {
		color: 'white',
	},
})

```

```css \[Output]
@layer utilities {
  .pk-a {
    color: black;
  }
  html.dark .pk-b {
    color: white;
  }
}

```

:::

### Shortcuts

A shortcut name is an ordinary style item, so it can be mixed with inline style definitions:

```ts
pika('flex-center', { gap: '1rem' })
```

Shortcut definitions may themselves compose other shortcuts through `StyleItem[]`; there is no `__shortcut` pseudo-property.

## Next

* [Dynamic Styles](/getting-started/dynamic-styles) — handle runtime-driven UI state with static authoring patterns.
* [Engine Config](/getting-started/engine-config) — project and Engine settings.
* [Selectors](/customizations/selectors) — static and dynamic selector definitions.
