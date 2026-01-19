---
name: pikacss-expert
description: Complete PikaCSS API reference and usage guide for developers implementing PikaCSS in their projects. Use when writing style definitions, configuring PikaCSS, building components, or troubleshooting styling issues.
license: MIT
compatibility: opencode
metadata:
  repo: pikacss
  version: 0.0.39
  audience: users
  workflow: implementation
---

# PikaCSS Expert Skill

Complete guidance for using PikaCSS to build styled components with atomic CSS generation.

## Quick Overview

PikaCSS provides an API for defining styles with atomic CSS generation at build time:

```typescript
// Define styles
const classes = pika({ 
  color: 'red',
  padding: '1rem'
})

// All pika() calls processed at build time
// Returns: "a b" (generated class names)
// Generated CSS:
//   .a { color: red; }
//   .b { padding: 1rem; }
```

**⚠️ Critical Constraint**: All `pika()` arguments must be **statically analyzable** at build time. No runtime variables, props, or dynamic expressions allowed inside `pika()`.

---

## Quick Navigation

This skill provides progressive disclosure. Start with the overview below, then dive into reference guides.

### For API Details & Configuration

**See [Complete API Reference](./references/api-reference.md)**
- All functions: `pika()`, `pika.arr()`, `pika.inl()`
- Configuration options with examples
- Shortcuts, variables, keyframes, selectors
- Engine API and TypeScript types
- ~1000 lines covering everything

*Use this when you need to know what's available and how to use it.*

### For Practical Code Examples

**See [Real-World Examples](./references/examples.md)**
- Button, Card, Badge, Input components
- Form patterns (Checkbox, Select)
- Layout patterns (Grid, Flex, Stack, Container)
- Modal, Dropdown, Tabs components
- Responsive design techniques
- Dark mode and theming patterns
- Animation and transitions
- Advanced patterns (compounds, render props, context)
- ~1000 lines of working code

*Use this when you need to see how to build something specific.*

### For Troubleshooting

**See [Troubleshooting Guide](./references/troubleshooting.md)**
- Setup and installation issues
- Styling not applying
- Build errors
- TypeScript issues
- Framework integration issues
- Performance optimization
- Advanced debugging
- ~500 lines of solutions

*Use this when something isn't working and you need help fixing it.*

### For Plugin Development

**See [Plugin Hooks Reference](./references/plugin-hooks.md)**
- Plugin system architecture
- All available hooks
- Writing custom plugins
- Module augmentation patterns
- Publishing plugins

*Use this when you want to extend PikaCSS with plugins.*

---

## Core Concepts

### The `pika()` Function

Three variants for different use cases:

```typescript
// 1. String output (most common)
const classes = pika({ color: 'red' })
// Returns: "a b c" (space-separated)

// 2. Array output
const classList = pika.arr({ color: 'red' })
// Returns: ["a", "b", "c"]

// 3. Template string usage
const html = `class="${pika.inl({ color: 'red' })}"`
```

### Build-Time Only

**All `pika()` calls must be evaluable at build time:**

```typescript
// ✅ Allowed (static)
const styles = pika({ color: 'red' })
const COLORS = { primary: '#3b82f6' }
const styles2 = pika({ color: COLORS.primary })

// ❌ Not allowed (runtime)
function Component({ color }) {
  const styles = pika({ color })  // ERROR
}

// ✅ Solution: CSS variables
const styles = pika({ color: 'var(--color)' })
function Component({ color }) {
  return <div className={styles} style={{ '--color': color }} />
}
```

---

## Setup

### 1. Install Packages

```bash
npm install @pikacss/core @pikacss/unplugin-pikacss
```

### 2. Create Configuration

Create `pika.config.ts` in project root:

```typescript
/// <reference path="./src/pika.gen.ts" />

import { defineEngineConfig } from '@pikacss/core'

export default defineEngineConfig({
  prefix: 'app-',
  
  plugins: [],
  
  variables: {
    variables: {
      '--color-primary': '#3b82f6',
    }
  },
  
  shortcuts: {
    shortcuts: [
      ['btn', { padding: '1rem', borderRadius: '4px' }],
    ]
  }
})
```

### 3. Configure Bundler

**For Vite:**
```typescript
// vite.config.ts
import pikacss from '@pikacss/unplugin-pikacss/vite'

export default {
  plugins: [pikacss()]
}
```

**For Nuxt:**
```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@pikacss/nuxt-pikacss']
})
```

**For Webpack:**
```typescript
// webpack.config.mjs
import pikacss from '@pikacss/unplugin-pikacss/webpack'

export default {
  plugins: [pikacss()]
}
```

### 4. Import CSS

```typescript
// main.ts or entry file
import 'pika.css'
```

---

## Style Definitions

### Basic Usage

```typescript
pika({
  // Standard CSS properties (camelCase or kebab-case)
  display: 'flex',
  backgroundColor: '#fff',
  'font-size': '16px',
  
  // Numbers become pixels
  margin: 0,
  padding: 16,
  
  // Pseudo-classes
  '$:hover': { color: 'blue' },
  
  // Pseudo-elements
  '$::before': { content: '"→"' },
  
  // Child selectors
  '$ > span': { fontWeight: 'bold' },
  
  // Media queries
  '@media (min-width: 768px)': {
    padding: 32,
  }
})
```

### All Pseudo-Classes

- `:hover`, `:active`, `:focus`, `:focus-visible`
- `:disabled`, `:enabled`, `:checked`
- `:first-child`, `:last-child`, `:nth-child()`
- `:visited`, `:target`, and more

### All Pseudo-Elements

- `::before`, `::after`
- `::first-line`, `::first-letter`
- `::selection`, `::placeholder`

---

## Shortcuts

Reusable style combinations:

```typescript
shortcuts: {
  shortcuts: [
    // Basic shortcut
    ['btn', { padding: '10px 20px', border: 'none' }],
    
    // Nested shortcut
    ['btn-primary', {
      __shortcut: 'btn',
      backgroundColor: '#3b82f6',
      color: 'white',
    }],
    
    // Pattern-based shortcut
    [/^gap-(\d+)$/, ([, size]) => ({
      gap: `${size}px`
    })],
    
    // String-based shortcut
    ['flexcenter', 'display:flex justify-content:center']
  ]
}

// Usage
pika('btn')           // Single shortcut
pika('btn-primary')   // Nested
pika('gap-16')        // Pattern: matches gap-*
pika('btn', { color: 'red' })  // Shortcut + inline styles
```

---

## CSS Variables

```typescript
// Define
variables: {
  variables: {
    '--color-primary': '#3b82f6',
    '--spacing-base': '1rem',
    '--font-sans': 'system-ui, sans-serif',
  }
}

// Use in styles
pika({
  color: 'var(--color-primary)',
  padding: 'var(--spacing-base)',
  fontFamily: 'var(--font-sans)',
})

// Update at runtime
<div 
  className={pika({ color: 'var(--theme-color)' })}
  style={{ '--theme-color': isDark ? 'white' : 'black' }}
/>
```

---

## Common Patterns

### Dynamic Styling

❌ **Don't:** Runtime variables in `pika()`
```typescript
pika({ color: userColor })  // ERROR: userColor is runtime
```

✅ **Do:** Use CSS variables
```typescript
const styles = pika({ color: 'var(--color)' })
<div className={styles} style={{ '--color': userColor }} />
```

✅ **Do:** Conditional shortcuts
```typescript
const primary = pika('btn-primary')
const secondary = pika('btn-secondary')

<button className={variant === 'primary' ? primary : secondary}>
  Click
</button>
```

### Responsive Design

```typescript
pika({
  fontSize: '14px',
  
  '@media (min-width: 768px)': {
    fontSize: '16px',
  },
  
  '@media (min-width: 1024px)': {
    fontSize: '18px',
  },
})
```

### Combining Styles

```typescript
// Use multiple shortcuts + inline
const baseBtn = pika('btn')
const sizeClass = pika('btn-lg')
const colorClass = pika({ color: 'white' })

// Combine
`${baseBtn} ${sizeClass} ${colorClass}`
```

---

## Official Plugins

### Icons Plugin

```typescript
import { icons } from '@pikacss/plugin-icons'

export default defineEngineConfig({
  plugins: [icons()],
  icons: { prefix: 'i-' }
})

// Use any icon: i-<library>:<name>
pika('i-mdi:home')
pika('i-heroicons:star')
```

### Reset Plugin

```typescript
import { reset } from '@pikacss/plugin-reset'

export default defineEngineConfig({
  plugins: [reset()]
})

// Includes CSS reset/normalization
```

### Typography Plugin

```typescript
import { typography } from '@pikacss/plugin-typography'

export default defineEngineConfig({
  plugins: [typography()]
})

// Use typography shortcuts
pika('prose')        // Normal
pika('prose-sm')     // Small
pika('prose-lg')     // Large
```

---

## TypeScript Support

Automatic type hints with IDE support:

```typescript
/// <reference path="./src/pika.gen.ts" />

// ✅ Autocomplete for CSS properties
pika({ 
  color: '',    // IDE suggests colors
  padding: '',  // IDE suggests values
})

// ✅ Hover shows generated CSS
const classes = pika({ color: 'red' })  // Hover to see CSS

// ✅ Type checking
const cls: string = pika({ color: 'red' })  // ✓ Correct
const arr: string[] = pika.arr({ color: 'red' })  // ✓ Correct
```

---

## Configuration Options

```typescript
interface EngineConfig {
  // Prefix for all generated class names
  prefix?: string
  
  // Plugins to load
  plugins?: EnginePlugin[]
  
  // CSS custom properties (--name: value)
  variables?: VariablesConfig
  
  // @keyframes definitions
  keyframes?: KeyframesConfig
  
  // Reusable combinations
  shortcuts?: ShortcutsConfig
  
  // Custom selector aliases
  selectors?: SelectorsConfig
  
  // !important handling
  important?: ImportantConfig
  
  // Disable features
  disable?: {
    preflight?: boolean
    shortcuts?: boolean
  }
}
```

See [Complete API Reference](./references/api-reference.md) for all options.

---

## Real-World Example

```tsx
// pika.config.ts
export default defineEngineConfig({
  shortcuts: {
    shortcuts: [
      ['btn', {
        display: 'inline-flex',
        padding: '0.5rem 1rem',
        borderRadius: '4px',
        border: 'none',
        cursor: 'pointer',
        transition: 'all 0.2s',
      }],
      ['btn-primary', {
        __shortcut: 'btn',
        backgroundColor: '#3b82f6',
        color: 'white',
        '$:hover': { backgroundColor: '#2563eb' },
      }],
    ]
  }
})

// Component
function Button({ variant = 'primary', children }) {
  return (
    <button className={pika(`btn-${variant}`)}>
      {children}
    </button>
  )
}

// Usage
<Button variant="primary">Click me</Button>
```

For more examples, see [Real-World Examples](./references/examples.md).

---

## Common Issues

| Problem | Solution |
|---------|----------|
| Styles not applying | Add `import 'pika.css'` to entry file |
| TypeScript errors | Add `/// <reference path="./src/pika.gen.ts" />` to config |
| pika() not found | Add `import { pika } from '@pikacss/core'` |
| Module not installed | Run `npm install @pikacss/core @pikacss/unplugin-pikacss` |
| Dynamic values don't work | Use CSS variables instead: `pika({ color: 'var(--color)' })` |

See [Troubleshooting Guide](./references/troubleshooting.md) for comprehensive help.

---

## Best Practices

1. **Use Shortcuts** for repeated styles
   - Define once, reuse everywhere
   - Reduces CSS output size

2. **Use CSS Variables** for dynamic values
   - Avoid runtime `pika()` calls
   - Set from JavaScript

3. **Organize Config**
   - Group related variables, shortcuts, keyframes
   - Add comments for clarity

4. **Check Types**
   - Reference `pika.gen.ts` for autocomplete
   - Let TypeScript catch errors

5. **Performance**
   - Use shortcuts to reduce duplication
   - Leverage CSS variables for theming
   - Keep inline styles minimal

---

## Next Steps

1. **Starting out?**
   - Review [Setup](#setup) section
   - Check [Real-World Examples](./references/examples.md)
   - Build a simple component

2. **Need specific details?**
   - See [Complete API Reference](./references/api-reference.md)
   - Check [Examples](./references/examples.md) for your use case
   - Review [Troubleshooting](./references/troubleshooting.md) if stuck

3. **Want to extend?**
   - See [Plugin Hooks Reference](./references/plugin-hooks.md)
   - Build custom plugins
   - Share with community

4. **Having issues?**
   - Check [Troubleshooting Guide](./references/troubleshooting.md)
   - Search error message in [Common Issues](#common-issues)
   - Review error messages vs solutions table

---

## References

- [Complete API Reference](./references/api-reference.md) - All functions and options (~1000 lines)
- [Real-World Examples](./references/examples.md) - Practical code samples (~1000 lines)
- [Troubleshooting Guide](./references/troubleshooting.md) - Solutions to common problems (~500 lines)
- [Plugin Hooks Reference](./references/plugin-hooks.md) - Plugin development guide

---

## Key Files

- `pika.config.ts` - Your project's PikaCSS configuration
- `pika.gen.css` - Generated atomic CSS (don't edit)
- `pika.gen.ts` - Generated TypeScript types (don't edit)
- `pika.css` - Import in your entry file to use styles

---

## Command Reference

```bash
# Build
npm run build

# Dev server
npm run dev

# Type check
npm run typecheck
```

---

**Last Updated:** 2026-01-19
**Version:** 0.0.39
