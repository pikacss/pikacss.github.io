---
url: /getting-started/what-is-pikacss.md
description: An overview of PikaCSS, the instant on-demand atomic CSS-in-JS engine.
---

# What is PikaCSS

PikaCSS is an instant on-demand atomic CSS-in-JS engine that transforms CSS-in-JS style definitions into atomic CSS at build time with zero runtime overhead.

## Key Features

### Zero Config

PikaCSS works out of the box with sensible defaults. Install the packages, add the build plugin, and start writing styles — no configuration files are required to get started.

### Zero Runtime

All CSS transformation happens at build time. Your production bundle contains only the generated atomic CSS classes — no JavaScript runtime cost for style processing.

### From CSS-in-JS to Atomic CSS

Write styles using familiar CSS property names in JavaScript objects. PikaCSS transforms each declaration into a reusable atomic class, combining the developer experience of CSS-in-JS with the performance benefits of atomic CSS. See [How pika() Works](#how-pika-works) for details.

### Cascade Ordering Conflict Resolved

Traditional atomic CSS has a known problem: when shorthand and longhand properties are used together (e.g. `padding` and `paddingTop`), stylesheet order can make the winner differ from the order you authored. PikaCSS resolves this automatically by preserving the order of overlapping declarations from the same `pika()` call: the later declaration wins whether it is a shorthand or a longhand. See [Cascade Ordering Conflict](#cascade-ordering-conflict) for details.

### Powerful Plugin System

Extend PikaCSS with plugins for CSS resets, icons, fonts, typography, and more. Plugins hook into the engine lifecycle to add preflights, shortcuts, selectors, and custom behavior.

### Fully Customizable

Configure selectors, shortcuts, variables, keyframes, layers, domain-owned Typegen/autocomplete inputs, and more. There is no global `autocomplete` config; each semantic subsystem owns the suggestions it can describe correctly.

## Concept

### How pika() Works

The configured `pika()` base call is the core authoring API. You pass it one or more style definition objects, and at build time PikaCSS replaces the call with its configured class-name output: a space-joined string by default, or a string array when the owning project entry uses `transformedFormat: 'array'`.

```ts
// What you write:
const className = pika({ color: 'red', fontSize: '16px' })

// What it becomes after build:
const className = 'pk-a pk-b'
```

Each unique CSS declaration (`color: red`, `font-size: 16px`) gets its own atomic class. If the same declaration appears elsewhere, the same class is reused.

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

### Statically Analyzable

All arguments to `pika()` must be statically analyzable at build time. PikaCSS supports a bounded static expression grammar — including recursively static objects and arrays, supported operators and conditionals, computed object keys, template literals with static primitive interpolations, and spreads whose source is itself statically known. Values that depend on ordinary runtime bindings or function calls remain invalid.

::: warning
Runtime-dependent values cannot be used as `pika()` arguments. Use the [ESLint plugin](/getting-started/eslint-config) to catch expressions outside the compiler's bounded static subset early. For the patterns that cover runtime-driven styling — variant maps, CSS variables, shortcuts — see [Dynamic Styles](/getting-started/dynamic-styles).
:::

```ts
// ✅ Valid — static object literal
pika({ color: 'red' })

// ✅ Valid — string literal
pika('flex-center')

// ❌ Invalid — dynamic variable
const color = getColor()
pika({ color })

// ✅ Valid — the whole expression is statically known
pika({ color: true ? 'white' : 'black' })

// ✅ Valid — spread source is statically known
pika({ ...{ color: 'red' }, padding: `${2 * 4}px` })

// ❌ Invalid — spread source is a runtime binding
pika({ ...baseStyles })
```

### Nested Selector

PikaCSS supports nested selectors in style definitions. The `$` character represents the generated atomic class selector, allowing you to compose pseudo-classes, media queries, and custom selectors.

**Pseudo-classes** — prefix with `$:` to add pseudo-class selectors:

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

**Media queries** — use standard `@media` at-rules:

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

**Custom selectors** — use user-defined selector names. This example requires the `@dark` selector to be registered first:

```ts
// pika.config.ts
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

### Cascade Ordering Conflict

In traditional atomic CSS, the order of generated classes in the stylesheet determines which property wins when shorthand and longhand properties conflict. For example, if `padding: 10px` and `padding-top: 20px` are both present, the last one in the stylesheet wins — which may not match the author's intent.

PikaCSS solves this by protecting the order of overlapping declarations from the same `pika()` call. If you write `padding: '10px'` and then `paddingTop: '20px'`, the generated `padding-top` rule is kept after the `padding` rule so the later declaration wins. Reverse the authored order and the shorthand is the later declaration, so it wins instead.

::: code-group

```ts \[Input]
const className = pika({
	padding: '10px',
	paddingTop: '20px',
})

```

```css \[Output]
@layer utilities {
  .pk-a {
    padding: 10px;
  }
  .pk-b {
    padding-top: 20px;
  }
}

```

:::

## Next

* [Setup](/getting-started/setup) — install PikaCSS and configure your build tool.
* [Usage](/getting-started/usage) — see more usage examples.
* [Comparison](/getting-started/comparison) — how PikaCSS relates to UnoCSS, Tailwind CSS, Panda CSS, and vanilla-extract.
