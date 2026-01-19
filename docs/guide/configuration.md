---
title: Configuration
description: Learn how to configure PikaCSS
outline: deep
---

# Configuration

## TypeScript Support
::: tip Important!
Please remember to add `/// <reference path="./src/pika.gen.ts" />` to the top of your pika config file.
:::

## Engine Options
- ### `plugins`
    Register plugins to extend PikaCSS functionality.

- ### `prefix`
    Set the prefix for generated atomic style id.
    - For example, `pika-` will generate `pika-a`, `pika-b`, etc.

- ### `defaultSelector`
    Set the default selector format (`%` will be replaced with the atomic style id).
    - `.%` -> Use with class attribute `<div class="a b c">`
    - `[data-pika~="%"]` -> Use with attribute selector `<div data-pika="a b c">`

- ### [`preflights`](/guide/preflights)
    Define global CSS styles that will be injected before atomic styles. Can be used for CSS variables, global animations, base styles, etc. Two ways to define:
    1. static CSS string
    2. function that returns a CSS string, which will get params
        - `engine`: Engine
        - `isFormatted`: boolean

::: info Type

<details>
<summary>View <code>EngineConfig</code>'s interface</summary>

<<< @/../packages/core/src/internal/types/engine.ts#EngineConfig

</details>
:::

## Core plugins' options:

### [`variables`](/guide/variables)

Define CSS custom properties that will be included in your generated CSS. See the [Variables guide](/guide/variables) for complete configuration options.

```ts
export default defineEngineConfig({
  variables: {
    variables: {
      '--color-primary': '#007bff',
      '--spacing-base': '1rem',
    }
  }
})
```

### [`keyframes`](/guide/keyframes)

Define `@keyframes` animations that can be referenced in your styles. See the [Keyframes guide](/guide/keyframes) for complete configuration options.

```ts
export default defineEngineConfig({
  keyframes: {
    keyframes: [
      ['fade', { from: { opacity: 0 }, to: { opacity: 1 } }],
      ['slide', { from: { transform: 'translateX(-100%)' }, to: { transform: 'translateX(0)' } }],
    ]
  }
})
```

### [`selectors`](/guide/selectors)

Define custom selector aliases that can be used in your styles. See the [Selectors guide](/guide/selectors) for complete configuration options.

```ts
export default defineEngineConfig({
  selectors: {
    selectors: [
      [':hover', '$:hover'],
      ['@dark', 'html.dark $'],
    ]
  }
})
```

### [`shortcuts`](/guide/shortcuts)

Define reusable style shortcuts that can be applied to reduce boilerplate. See the [Shortcuts guide](/guide/shortcuts) for complete configuration options.

```ts
export default defineEngineConfig({
  shortcuts: {
    shortcuts: [
      ['btn', { padding: '10px 20px', borderRadius: '4px', border: 'none' }],
      [/^flex-(.+)$/, ([, align]) => ({ display: 'flex', alignItems: align })],
    ]
  }
})
```

### [`important`](/guide/important)

Configure how `!important` flags are handled in your styles.

```ts
export default defineEngineConfig({
  important: {
    default: false,  // Default !important flag (optional)
  }
})
```

## Next Steps

- **[Plugin System](/guide/plugin-system)** - Extend PikaCSS with plugins
- **[Advanced Configuration](/advanced/plugin-development)** - Creating custom plugins
- **[TypeScript Setup](/advanced/typescript)** - Configure IDE support
- **[Troubleshooting](/advanced/troubleshooting)** - Debug configuration issues
