---
url: /getting-started/what-is-pikacss.md
description: 'An overview of PikaCSS, the instant on-demand atomic CSS-in-JS engine.'
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

Traditional atomic CSS has a known problem: when shorthand and longhand properties are used together (e.g. `padding` and `paddingTop`), the output order determines which wins — leading to unpredictable results. PikaCSS resolves this automatically by ensuring longhand properties always override their corresponding shorthands, regardless of declaration order. See [Cascade Ordering Conflict](#cascade-ordering-conflict) for details.

### Powerful Plugin System

Extend PikaCSS with plugins for CSS resets, icons, fonts, typography, and more. Plugins hook into the engine lifecycle to add preflights, shortcuts, selectors, and custom behavior.

### Fully Customizable

Configure selectors, shortcuts, variables, keyframes, layers, autocomplete, and more. Every aspect of the engine is customizable through the engine configuration.

## Concept

### How pika() Works

The `pika()` function is the core API. You pass it one or more style definition objects, and at build time, PikaCSS replaces each call with the generated atomic class name strings.

```ts
// What you write:
const className = pika({ color: 'red', fontSize: '16px' })

// What it becomes after build:
const className = 'pk-abc pk-def'
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

All arguments to `pika()` must be statically analyzable at build time. This means you cannot use dynamic values, computed expressions, or runtime variables as arguments. PikaCSS needs to extract the styles during the build step without executing your code.

::: warning
Dynamic values, computed expressions, and runtime variables cannot be used as `pika()` arguments. Use the [ESLint plugin](/getting-started/eslint-config) to catch violations early.
:::

```ts
// ✅ Valid — static object literal
pika({ color: 'red' })

// ✅ Valid — string literal
pika('flex-center')

// ❌ Invalid — dynamic variable
const color = getColor()
pika({ color })

// ❌ Invalid — computed expression
pika({ color: isDark ? 'white' : 'black' })

// ❌ Invalid — spread operator
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

**Custom selectors** — use user-defined selector names:

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

PikaCSS solves this by ensuring that longhand properties are always rendered after their corresponding shorthands, so `paddingTop: '20px'` always takes effect over `padding: '10px'`, regardless of the order you wrote them.

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
