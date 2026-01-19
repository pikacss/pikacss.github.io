# Complete API Reference

Comprehensive reference for all PikaCSS APIs, functions, configuration options, and types.

## Table of Contents

- [Core Functions](#core-functions)
- [Configuration](#configuration)
- [Style Objects](#style-objects)
- [Shortcuts](#shortcuts)
- [CSS Variables](#css-variables)
- [Selectors & Pseudo-Elements](#selectors--pseudo-elements)
- [Plugins](#plugins)
- [TypeScript Types](#typescript-types)
- [Engine API](#engine-api)

---

## Core Functions

### `pika()`

Returns a string of space-separated atomic class names.

```typescript
function pika(styles: StyleObject): string
```

**Parameters:**
- `styles` - Object with CSS properties and values

**Returns:** String of generated class names

**Example:**
```typescript
const classes = pika({ 
  color: 'red',
  padding: '1rem'
})
// Returns: "a b"
// Generated CSS:
// .a { color: red; }
// .b { padding: 1rem; }
```

**Usage in HTML:**
```tsx
<div className={pika({ display: 'flex', gap: '1rem' })}>
  Content
</div>
```

---

### `pika.arr()`

Returns an array of atomic class names.

```typescript
function pika.arr(styles: StyleObject): string[]
```

**Parameters:**
- `styles` - Object with CSS properties and values

**Returns:** Array of generated class names

**Example:**
```typescript
const classes = pika.arr({ 
  color: 'red',
  padding: '1rem'
})
// Returns: ["a", "b"]
```

**Useful for:**
- Component libraries that need individual class names
- Dynamic class name construction
- Conditional class application

```typescript
const baseClasses = pika.arr({ display: 'flex' })
const extraClasses = pika.arr({ gap: '1rem' })
const allClasses = [...baseClasses, ...extraClasses].join(' ')
```

---

### `pika.inl()`

For inline template string usage with IDE hover preview.

```typescript
function pika.inl(styles: StyleObject): string
```

**Example:**
```typescript
// IDE shows generated CSS in hover
const html = `<div class="${pika.inl({ color: 'red' })}">Content</div>`
```

---

## Configuration

### `defineEngineConfig()`

Defines PikaCSS engine configuration with full TypeScript support.

```typescript
function defineEngineConfig(config: EngineConfig): EngineConfig
```

**Configuration Object:**

```typescript
interface EngineConfig {
  // Prefix for all generated class names
  prefix?: string

  // Array of plugins to load
  plugins?: EnginePlugin[]

  // CSS custom properties
  variables?: VariablesConfig

  // @keyframes animations
  keyframes?: KeyframesConfig

  // Reusable style combinations
  shortcuts?: ShortcutsConfig

  // Custom selector aliases
  selectors?: SelectorsConfig

  // !important handling
  important?: ImportantConfig

  // Disable certain features
  disable?: {
    // Don't generate preflight styles
    preflight?: boolean
    // Don't process shortcuts
    shortcuts?: boolean
  }
}
```

**Minimal Example:**
```typescript
import { defineEngineConfig } from '@pikacss/core'

export default defineEngineConfig({
  prefix: 'app-'
})
```

**Complete Example:**
```typescript
import { defineEngineConfig } from '@pikacss/core'
import { icons } from '@pikacss/plugin-icons'
import { reset } from '@pikacss/plugin-reset'

export default defineEngineConfig({
  prefix: 'app-',

  plugins: [
    icons(),
    reset(),
  ],

  variables: {
    variables: {
      '--color-primary': '#3b82f6',
      '--spacing-base': '1rem',
      '--font-sans': 'system-ui, sans-serif',
    }
  },

  keyframes: {
    keyframes: {
      'slide-in': {
        'from': { transform: 'translateX(-100%)' },
        'to': { transform: 'translateX(0)' },
      }
    }
  },

  shortcuts: {
    shortcuts: [
      ['btn', {
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'var(--spacing-base)',
        borderRadius: '0.375rem',
        border: 'none',
        cursor: 'pointer',
      }],
      ['btn-primary', {
        __shortcut: 'btn',
        backgroundColor: 'var(--color-primary)',
        color: 'white',
      }],
    ]
  },

  selectors: {
    selectors: {
      'focus-visible': ':focus-visible',
    }
  }
})
```

---

### `createEngine()`

Programmatically create an engine instance.

```typescript
function createEngine(config: EngineConfig): Engine
```

**Returns:** Engine instance with methods to process styles

**Example:**
```typescript
import { createEngine } from '@pikacss/core'

const engine = createEngine({
  prefix: 'app-',
  plugins: [],
})

// Process style definition
const result = engine.transform({
  color: 'red',
  padding: '1rem',
})

// result.class - generated class name
// result.css - generated CSS rule
```

**Used internally by build plugins**, but useful for custom tooling.

---

## Style Objects

### Basic Syntax

```typescript
pika({
  // Standard CSS properties (both camelCase and kebab-case work)
  display: 'flex',
  backgroundColor: 'white',
  'font-family': 'sans-serif',

  // Numbers are converted to pixels
  padding: 16,           // becomes "16px"
  gap: '1rem',           // strings are used as-is

  // Any valid CSS value
  width: '100%',
  opacity: 0.5,
  color: '#3b82f6',
})
```

### Pseudo-Classes

Use `$:` prefix for pseudo-classes:

```typescript
pika({
  color: 'blue',
  '$:hover': {
    color: 'darkblue',
    textDecoration: 'underline',
  },
  '$:focus': {
    outline: '2px solid blue',
  },
  '$:active': {
    opacity: 0.8,
  },
  '$:disabled': {
    opacity: 0.5,
    cursor: 'not-allowed',
  },
})
```

**All Pseudo-Classes Supported:**
- `:hover`, `:active`, `:focus`, `:focus-visible`
- `:disabled`, `:enabled`, `:checked`, `:indeterminate`
- `:first-child`, `:last-child`, `:nth-child()`, `:only-child`
- `:first-of-type`, `:last-of-type`, `:nth-of-type()`
- `:visited`, `:link`, `:target`
- `:not()`, `:is()`, `:where()`
- And more...

### Pseudo-Elements

Use `$::` prefix for pseudo-elements:

```typescript
pika({
  '$::before': {
    content: '"→"',
    marginRight: '0.5rem',
  },
  '$::after': {
    content: '"..."',
  },
  '$::first-line': {
    fontWeight: 'bold',
  },
  '$::selection': {
    backgroundColor: 'yellow',
  },
})
```

**Supported Pseudo-Elements:**
- `::before`, `::after`
- `::first-line`, `::first-letter`
- `::selection`, `::placeholder`
- `::backdrop`, `::cue`
- And more...

### Child Selectors

Use `$ > selector` for child combinators:

```typescript
pika({
  display: 'grid',
  '$ > span': {
    padding: '1rem',
  },
  '$ > .highlight': {
    backgroundColor: 'yellow',
  },
})
```

### Descendant Selectors

Use `$ selector` for descendant combinators:

```typescript
pika({
  '$ a': {
    color: 'blue',
    textDecoration: 'underline',
  },
  '$ strong': {
    fontWeight: 'bold',
  },
})
```

### Sibling Selectors

Use `$ ~ selector` or `$ + selector`:

```typescript
pika({
  '$ + .next': {
    marginTop: '2rem',
  },
  '$ ~ p': {
    lineHeight: 1.6,
  },
})
```

### Attribute Selectors

Use `$[attribute]` syntax:

```typescript
pika({
  '$[disabled]': {
    opacity: 0.5,
    cursor: 'not-allowed',
  },
  '$[type="checkbox"]': {
    width: '1rem',
    height: '1rem',
  },
})
```

### Media Queries

Use `@media` key:

```typescript
pika({
  fontSize: '14px',
  '@media (min-width: 768px)': {
    fontSize: '16px',
  },
  '@media (min-width: 1024px)': {
    fontSize: '18px',
  },
  '@media (prefers-color-scheme: dark)': {
    backgroundColor: 'black',
    color: 'white',
  },
})
```

### Container Queries

Use `@container` key:

```typescript
pika({
  '@container (min-width: 400px)': {
    padding: '2rem',
  },
})
```

### Supports Queries

Use `@supports` key:

```typescript
pika({
  '@supports (display: grid)': {
    display: 'grid',
    gridAutoRows: 'minmax(100px, auto)',
  },
})
```

### Combining Selectors

All of the above can be combined:

```typescript
pika({
  color: 'blue',
  '$ a': {
    color: 'inherit',
    '$:hover': {
      textDecoration: 'underline',
    },
  },
  '@media (prefers-reduced-motion: reduce)': {
    '$ a': {
      '$:hover': {
        textDecoration: 'none',
      },
    },
  },
})
```

---

## Shortcuts

### Basic Shortcut

```typescript
// Configuration
shortcuts: {
  shortcuts: [
    ['btn', {
      display: 'inline-flex',
      padding: '0.5rem 1rem',
      borderRadius: '0.375rem',
      border: 'none',
      cursor: 'pointer',
    }]
  ]
}

// Usage
pika('btn')  // Returns class names for all btn styles
```

### Shortcut with String Value

```typescript
shortcuts: {
  shortcuts: [
    ['flexcenter', 'display:flex justify-content:center align-items:center']
  ]
}

pika('flexcenter')
```

### Nested Shortcuts

```typescript
shortcuts: {
  shortcuts: [
    ['btn', { /* base button styles */ }],
    ['btn-primary', {
      __shortcut: 'btn',  // Inherit btn styles
      backgroundColor: 'blue',
      color: 'white',
    }],
    ['btn-primary-lg', {
      __shortcut: 'btn-primary',  // Inherit btn-primary
      fontSize: '18px',
      padding: '1rem 2rem',
    }],
  ]
}

pika('btn-primary-lg')  // Includes all btn and btn-primary styles
```

### Pattern-Based Shortcuts

```typescript
shortcuts: {
  shortcuts: [
    [/^flex-(.+)$/, ([, align]) => ({
      display: 'flex',
      justifyContent: align,
    })],
    [/^gap-(\d+)$/, ([, size]) => ({
      gap: `${size}px`,
    })],
  ]
}

pika('flex-center')    // Applies flex with justifyContent: center
pika('flex-between')   // Applies flex with justifyContent: between
pika('gap-16')         // Applies gap: 16px
pika('gap-24')         // Applies gap: 24px
```

### Combining Shortcuts with Inline Styles

```typescript
// Include shortcut, add extra styles
pika('btn', {
  width: '100%',
  fontSize: '18px',
})

// Results in btn styles PLUS width and fontSize
```

### Dynamic Shortcuts (Build-Time Only)

```typescript
shortcuts: {
  shortcuts: [
    [/^btn-(\w+)$/, ([, color]) => {
      // Must be evaluable at build time
      // No runtime variables!
      const colorMap = {
        'red': '#ef4444',
        'blue': '#3b82f6',
        'green': '#10b981',
      }
      
      return {
        __shortcut: 'btn',
        backgroundColor: colorMap[color],
        color: 'white',
      }
    }]
  ]
}

pika('btn-red')    // color is evaluable at build time
```

---

## CSS Variables

### Define Variables

```typescript
variables: {
  variables: {
    '--color-primary': '#3b82f6',
    '--color-secondary': '#10b981',
    '--color-danger': '#ef4444',
    '--spacing-xs': '0.25rem',
    '--spacing-sm': '0.5rem',
    '--spacing-md': '1rem',
    '--spacing-lg': '2rem',
    '--font-sans': 'system-ui, -apple-system, sans-serif',
    '--font-mono': 'Courier New, monospace',
    '--border-radius-sm': '0.25rem',
    '--border-radius-md': '0.5rem',
    '--border-radius-lg': '1rem',
  }
}
```

### Use in Styles

```typescript
pika({
  backgroundColor: 'var(--color-primary)',
  padding: 'var(--spacing-md)',
  fontFamily: 'var(--font-sans)',
  borderRadius: 'var(--border-radius-lg)',
})
```

### Use in Component

```typescript
// CSS variable set at build time
const styles = pika({
  color: 'var(--theme-color)',
  backgroundColor: 'var(--theme-bg)',
})

function Component({ isDark }) {
  return (
    <div 
      className={styles}
      style={{
        '--theme-color': isDark ? 'white' : 'black',
        '--theme-bg': isDark ? 'black' : 'white',
      }}
    />
  )
}
```

### Computed Variables

```typescript
variables: {
  variables: {
    '--color-primary-rgb': '59, 130, 246',  // RGB for alpha
  }
}

pika({
  // Use with rgba()
  backgroundColor: 'rgba(var(--color-primary-rgb), 0.1)',
})
```

---

## Selectors

### Custom Selector Aliases

```typescript
selectors: {
  selectors: {
    'focus-ring': ':focus-visible',
    'dark': '.dark',
    'motion': '@media (prefers-reduced-motion: no-preference)',
  }
}
```

### Using Custom Selectors

```typescript
pika({
  '$:focus-ring': {
    outline: '2px solid blue',
  },
  '$:dark': {
    backgroundColor: 'black',
    color: 'white',
  },
})
```

---

## Plugins

### Hooks Available to Plugins

Plugins can hook into the processing pipeline:

```typescript
interface EnginePlugin {
  name: string
  order?: 'pre' | 'post'

  // Configure the engine
  async configureEngine?(engine: Engine): Promise<void>

  // Transform style definitions
  async transformStyleDefinitions?(
    definitions: StyleDefinition[]
  ): Promise<StyleDefinition[]>

  // Process generated CSS
  async transformCSS?(css: string): Promise<string>

  // Resolve shortcuts
  async resolveShortcut?(name: string): Promise<StyleObject | null>

  // Generate preflights
  async generatePreflights?(engine: Engine): Promise<string>
}
```

### Icons Plugin

```typescript
import { icons } from '@pikacss/plugin-icons'

export default defineEngineConfig({
  plugins: [icons()],
  icons: {
    prefix: 'i-',  // Icon class prefix
    source: '@unocss/preset-icons',
  }
})

// Usage
pika('i-mdi:home')
pika('i-ri:search-line')
pika('i-heroicons:star')
```

### Reset Plugin

```typescript
import { reset } from '@pikacss/plugin-reset'

export default defineEngineConfig({
  plugins: [reset()],
  reset: {
    preset: 'modern',  // or 'classic'
  }
})
```

### Typography Plugin

```typescript
import { typography } from '@pikacss/plugin-typography'

export default defineEngineConfig({
  plugins: [typography()]
})

// Shortcuts
pika('prose')        // Normal typography
pika('prose-sm')     // Small typography
pika('prose-lg')     // Large typography
```

---

## TypeScript Types

### Auto-Generated Types

The build process generates `pika.gen.ts` with complete types:

```typescript
/// <reference path="./src/pika.gen.ts" />
```

This provides:
- Full autocomplete for CSS properties
- IDE hover previews
- Type-safe style definitions

### Core Types

```typescript
// Style definition object
type StyleObject = Record<string, CSSProperties | StyleObject>

// Generated class names (string)
type GeneratedClasses = string

// Generated class names array
type GeneratedClassesArray = string[]

// Shortcut definition
type ShortcutDefinition = StyleObject | string

// Keyframes definition
type KeyframesDefinition = Record<string, StyleObject>

// CSS custom property
type CSSVariable = string | number

// Engine configuration
interface EngineConfig {
  prefix?: string
  plugins?: EnginePlugin[]
  variables?: VariablesConfig
  keyframes?: KeyframesConfig
  shortcuts?: ShortcutsConfig
  selectors?: SelectorsConfig
  important?: ImportantConfig
}
```

---

## Engine API

### Engine Methods

```typescript
// Create engine instance
const engine = createEngine(config)

// Transform a single style definition
const result = engine.transform({
  color: 'red'
})
// result.css - Generated CSS rule
// result.class - Class name

// Get generated CSS
const allCSS = engine.getCss()

// Get type definitions
const types = engine.getTypes()

// Clear internal cache
engine.reset()

// Register a shortcut
engine.registerShortcut('btn', { ... })

// Resolve a shortcut
const resolved = await engine.resolveShortcut('btn')
```

---

## Performance Notes

### Build-Time Generation

All `pika()` calls are processed at build time:
- No runtime overhead for style generation
- Class names are pre-computed
- CSS is pre-generated

### Class Name Compression

Generated class names use single letters (`a`, `b`, `c`, etc.) for minimal CSS output.

### Code Splitting

PikaCSS supports code-splitting: only used styles are included in the bundle.

---

## Best Practices

1. **Use Shortcuts for Repeated Styles**
   - Define once, reuse everywhere
   - Easier to maintain

2. **Use CSS Variables for Dynamic Values**
   - Avoid runtime `pika()` calls
   - Set variables from JavaScript/HTML

3. **Organize Configuration**
   - Group related variables, shortcuts, keyframes
   - Add comments for clarity

4. **Type Hints with TypeScript**
   - Reference `pika.gen.ts` for autocomplete
   - Use strict type checking

5. **Performance**
   - Use shortcuts to reduce generated CSS
   - Leverage CSS variables for theming
   - Keep inline styles minimal

---

## Migration Guide

### From Inline Styles

```typescript
// Before
<div style={{ color: 'red', padding: '1rem' }} />

// After
<div className={pika({ color: 'red', padding: '1rem' })} />
```

### From CSS Modules

```typescript
// Before
import styles from './Button.module.css'
<button className={styles.primary} />

// After
// pika.config.ts
shortcuts: [['btn-primary', { /* styles */ }]]

// Component
<button className={pika('btn-primary')} />
```

### From Tailwind CSS

```typescript
// Before (Tailwind)
<div className="flex gap-4 p-2 bg-blue-500" />

// After (PikaCSS)
<div className={pika({
  display: 'flex',
  gap: '1rem',
  padding: '0.5rem',
  backgroundColor: '#3b82f6',
})} />
```

---

## Reference Resources

- **Plugin Development**: See `plugin-hooks.md`
- **TypeScript Setup**: See SKILL.md TypeScript section
- **Troubleshooting**: See pikacss-dev troubleshooting
