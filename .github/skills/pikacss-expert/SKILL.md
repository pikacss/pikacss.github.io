---
name: pikacss-expert
description: Complete PikaCSS API reference and usage guide for developers using the library
license: MIT
compatibility: opencode
metadata:
  repo: pikacss
  version: 0.0.39
  audience: users
  workflow: implementation
---

## When to use me

Use this skill when:

- Learning PikaCSS API and features
- Writing style definitions with `pika()`
- Configuring PikaCSS options
- Using plugins (icons, reset, typography)
- Integrating with frameworks (Vite, Nuxt, Webpack, etc.)
- Understanding TypeScript support and IDE features

---

## The `pika()` Function

Three variants for different use cases:

```ts
// 1. Returns space-separated class names (default)
const classes = pika({ color: 'red', fontSize: '16px' })
// Output: 'a b'

// 2. Returns array of class names
const classList = pika.arr({ color: 'red', fontSize: '16px' })
// Output: ['a', 'b']

// 3. Inline template string usage (IDE hover preview)
const inline = `class="${pika({ color: 'red' })}"`
```

**⚠️ Build-Time Only**: All arguments to `pika()` must be statically analyzable. No runtime variables, function calls, or dynamic expressions allowed.

---

## Configuration File

Create `pika.config.ts` in project root:

```ts
/// <reference path="./src/pika.gen.ts" />

import { defineEngineConfig } from '@pikacss/core'
import { icons } from '@pikacss/plugin-icons'
import { reset } from '@pikacss/plugin-reset'

export default defineEngineConfig({
  prefix: 'pika-',
  
  // Register plugins
  plugins: [icons(), reset()],
  
  // Define styles
  variables: { ... },
  keyframes: { ... },
  selectors: { ... },
  shortcuts: { ... },
})
```

---

## Style Objects

```ts
pika({
  // Standard CSS properties (camelCase or kebab-case)
  display: 'flex',
  backgroundColor: '#fff',
  'font-size': '16px',
  
  // Numbers or strings
  margin: 0,
  padding: '1rem',
  
  // Pseudo-classes and pseudo-elements
  '$:hover': { color: 'blue' },
  '$::before': { content: '"*"' },
  
  // Selectors
  '$ > span': { fontWeight: 'bold' },
  '$.active': { backgroundColor: 'yellow' },
  
  // Media queries
  '@media (min-width: 768px)': {
    padding: '2rem',
  },
})
```

---

## Shortcuts

Define reusable style combinations:

```ts
// pika.config.ts
shortcuts: {
  shortcuts: [
    ['btn', { padding: '10px 20px', borderRadius: '4px', border: 'none' }],
    ['btn-primary', { __shortcut: 'btn', backgroundColor: 'blue', color: 'white' }],
    [/^flex-(.+)$/, ([, align]) => ({ display: 'flex', alignItems: align })],
  ]
}

// Usage
pika('btn')                    // Use shortcut by name
pika('btn-primary')            // Nested shortcuts
pika('flex-center')            // Pattern-based shortcuts
pika('btn', { color: 'blue' }) // Combine shortcut + inline styles
```

---

## CSS Variables

```ts
// Define in config
variables: {
  variables: {
    '--color-primary': '#3b82f6',
    '--spacing-base': '1rem',
  }
}

// Use in styles
pika({
  color: 'var(--color-primary)',
  padding: 'var(--spacing-base)',
})

// Set at runtime
<div style={{ '--color-primary': userColor }} className={pika({...})} />
```

---

## Key Plugins

### Icons Plugin

```ts
import { icons } from '@pikacss/plugin-icons'

export default defineEngineConfig({
  plugins: [icons()],
  icons: { prefix: 'i-' }
})

// Usage: Use any icon from https://icones.js.org/
pika('i-mdi:home')
```

### Reset Plugin

```ts
import { reset } from '@pikacss/plugin-reset'

export default defineEngineConfig({
  plugins: [reset()]
})
```

### Typography Plugin

```ts
import { typography } from '@pikacss/plugin-typography'

export default defineEngineConfig({
  plugins: [typography()]
})

// Use typography shortcuts
pika('prose')                    // Normal prose
pika('prose-sm')                 // Small prose
```

---

## Framework Setup

### Vite

```ts
// vite.config.ts
import pikacss from '@pikacss/unplugin-pikacss/vite'

export default defineConfig({
  plugins: [pikacss()]
})

// main.ts
import 'pika.css'
```

### Nuxt

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@pikacss/nuxt-pikacss']
})
```

### Webpack

```ts
// webpack.config.mjs
import pikacss from '@pikacss/unplugin-pikacss/webpack'

export default {
  plugins: [pikacss()]
}
```

---

## Dynamic Styling Patterns

### ✅ Use CSS Variables (Recommended)

```ts
const styles = pika({ color: 'var(--dynamic-color)' })

function Component({ color }) {
  return <div className={styles} style={{ '--dynamic-color': color }} />
}
```

### ✅ Use Conditional Shortcuts

```ts
const primaryBtn = pika('btn-primary')
const secondaryBtn = pika('btn-secondary')

function Button({ variant }) {
  return <button className={variant === 'primary' ? primaryBtn : secondaryBtn} />
}
```

### ❌ Don't Use Runtime Variables

```ts
// These don't work (build-time constraint)
pika({ color: props.color })          // ERROR
pika({ padding: getUserSize() })       // ERROR
pika({ font: `size-${size}` })        // ERROR
```

---

## TypeScript Support

IDE features automatically enabled:

```ts
// ✅ Hover over pika() to see generated CSS
const classes = pika({ color: 'red' })

// ✅ Autocomplete for all CSS properties
pika({ color: '', fontSize: '', ...

// ✅ Type checking for generated classes
const cls: string = pika({ color: 'red' })
```

Add reference to `pika.gen.ts` in config:

```ts
/// <reference path="./src/pika.gen.ts" />
```

---

## Real-World Example

```tsx
// pika.config.ts
shortcuts: {
  shortcuts: [
    ['btn', {
      display: 'inline-flex',
      padding: '0.5rem 1rem',
      borderRadius: '0.375rem',
      border: 'none',
      cursor: 'pointer',
      transition: 'all 0.2s',
    }],
    ['btn-primary', {
      __shortcut: 'btn',
      backgroundColor: 'var(--color-primary)',
      color: 'white',
      '$:hover': { opacity: '0.9' },
    }],
  ]
}

// Component
function Button({ children }: { children: React.ReactNode }) {
  return (
    <button className={pika('btn-primary')}>
      {children}
    </button>
  )
}
```

---

## Common Issues

| Problem | Solution |
|---------|----------|
| Styles not applied | Verify `import 'pika.css'` in entry file |
| TypeScript errors | Add `/// <reference path="./src/pika.gen.ts" />` to config |
| Icon not working | Verify icon name from https://icones.js.org/ |
| Shortcut not found | Check `pika.config.ts` shortcuts definition |

---

## Learn More

- **Documentation**: Read `/docs/guide/` for step-by-step tutorials
- **Examples**: See `/docs/examples/components.md` for real components
- **Troubleshooting**: Check `/docs/advanced/troubleshooting.md` for common issues
- **API Reference**: Full API in `/docs/advanced/api-reference.md`

