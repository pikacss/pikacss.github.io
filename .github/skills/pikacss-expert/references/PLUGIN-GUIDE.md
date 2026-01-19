# Using PikaCSS Plugins

## Plugin System Overview

Plugins extend PikaCSS with additional shortcuts, CSS resets, typography systems, and more. They hook into the engine configuration and processing pipeline.

## Official Plugins

### @pikacss/plugin-icons

Provides convenient icon shortcuts powered by icon sets.

**Installation:**
```bash
pnpm add @pikacss/plugin-icons
```

**Configuration:**
```typescript
import { createEngine } from '@pikacss/core'
import { iconPlugin } from '@pikacss/plugin-icons'

const engine = createEngine({
  plugins: [
    iconPlugin({
      sets: ['heroicons', 'lucide', 'feather'],
      defaultSize: '24px'
    })
  ]
})
```

**Usage:**
```typescript
// Basic icon
pika({
  icon: {
    name: 'chevron-right',
    size: '24px'
  }
})

// Icon with color
pika({
  icon: {
    name: 'star',
    color: 'gold',
    size: '32px'
  }
})

// Inline icon in component
<span class={pika({ icon: { name: 'check' } }).className}></span>
```

**Icon Sets:**
- `heroicons` - Beautiful hand-crafted SVG icons
- `lucide` - 700+ pixel-perfect icons
- `feather` - Minimalist icon set
- `tabler` - 5000+ SVG icons
- `mdi` - Material Design Icons

**Configuration Options:**
```typescript
interface IconPluginConfig {
  sets?: string[]           // Icon sets to include
  defaultSize?: string      // Default icon size (default: '1em')
  defaultColor?: string     // Default icon color (default: 'currentColor')
  prefix?: string          // CSS class prefix (default: 'icon')
}
```

### @pikacss/plugin-reset

Provides CSS reset and normalize styles.

**Installation:**
```bash
pnpm add @pikacss/plugin-reset
```

**Configuration:**
```typescript
import { resetPlugin } from '@pikacss/plugin-reset'

const engine = createEngine({
  plugins: [
    resetPlugin({
      preset: 'modern', // 'modern' or 'minimal'
      customCSS: `
        body {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        }
      `
    })
  ]
})
```

**Presets:**

**modern** - Comprehensive reset (default)
```css
/* Removes default margins/padding */
/* Normalizes form elements */
/* Sets system font stack */
/* Enables smooth scrolling */
```

**minimal** - Lightweight reset
```css
/* Only essential resets */
/* Preserves browser defaults */
```

**Usage:**
With plugin activated, global reset styles are automatically included:

```html
<!-- No need to import reset.css, it's included in pika.gen.css -->
```

### @pikacss/plugin-typography

Typography utilities for headings, text, and more.

**Installation:**
```bash
pnpm add @pikacss/plugin-typography
```

**Configuration:**
```typescript
import { typographyPlugin } from '@pikacss/plugin-typography'

const engine = createEngine({
  plugins: [
    typographyPlugin({
      defaultFontFamily: 'system-ui',
      headingScale: 1.25,
      baseFontSize: '16px'
    })
  ]
})
```

**Available Shortcuts:**
```typescript
// Headings
pika({ h1: true })  // 2.5rem, bold, normal line height
pika({ h2: true })  // 2rem, bold, normal line height
pika({ h3: true })  // 1.5rem, bold, normal line height
pika({ h4: true })  // 1.25rem, bold, normal line height
pika({ h5: true })  // 1.125rem, bold, normal line height
pika({ h6: true })  // 1rem, bold, normal line height

// Text styles
pika({ body: true })        // Base text styles
pika({ caption: true })     // Small caption text
pika({ label: true })       // Form label text
pika({ code: true })        // Code/monospace text

// Text utilities
pika({ textCenter: true })
pika({ textJustify: true })
pika({ truncate: true })
pika({ lineClamp: 3 })
```

**Configuration Options:**
```typescript
interface TypographyPluginConfig {
  defaultFontFamily?: string    // System font or custom
  headingScale?: number         // Scale factor between heading sizes (1.25)
  baseFontSize?: string        // Body font size (16px)
  lineHeightMultiplier?: number // Line height scale (1.6)
  monoFontFamily?: string      // Monospace font family
  fontWeights?: {
    light?: number
    normal?: number
    semibold?: number
    bold?: number
  }
}
```

## Custom Plugins

### Creating a Plugin

Define a custom plugin for your project-specific needs:

```typescript
// plugins/buttonPlugin.ts
import { defineEnginePlugin } from '@pikacss/core'

export function buttonPlugin() {
  return defineEnginePlugin({
    name: 'button-plugin',
    order: 'post',
    
    async configureEngine(engine) {
      // Register button shortcuts
      engine.registerShortcut('btn-primary', {
        backgroundColor: '#3b82f6',
        color: 'white',
        padding: '0.75rem 1.5rem',
        borderRadius: '0.375rem',
        fontWeight: '600',
        border: 'none',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        
        '&:hover': {
          backgroundColor: '#2563eb'
        },
        '&:active': {
          transform: 'scale(0.98)'
        }
      })
      
      engine.registerShortcut('btn-secondary', {
        backgroundColor: '#e5e7eb',
        color: '#111827',
        padding: '0.75rem 1.5rem',
        borderRadius: '0.375rem',
        fontWeight: '600',
        border: 'none',
        cursor: 'pointer',
        
        '&:hover': {
          backgroundColor: '#d1d5db'
        }
      })
      
      engine.registerShortcut('btn-ghost', {
        backgroundColor: 'transparent',
        color: '#3b82f6',
        padding: '0.75rem 1.5rem',
        borderRadius: '0.375rem',
        fontWeight: '600',
        border: '1px solid #3b82f6',
        cursor: 'pointer',
        
        '&:hover': {
          backgroundColor: '#eff6ff'
        }
      })
    }
  })
}
```

### Using Custom Plugin

```typescript
// vite.config.ts
import { buttonPlugin } from './plugins/buttonPlugin'

const engine = createEngine({
  plugins: [
    buttonPlugin()
  ]
})
```

```typescript
// Usage
pika({ btn_primary: true })
pika({ btn_secondary: true })
pika({ btn_ghost: true })
```

## Plugin Execution Order

### Understanding Order

Plugins execute in this sequence:

1. **'pre' plugins** - Run first, can modify input before core processing
2. **Default plugins** - Run in standard order
3. **'post' plugins** - Run last, can extend or modify results

### When to Use Each

**'pre' - Input transformation:**
```typescript
order: 'pre',
transformStyleDefinitions(defs) {
  // Normalize or validate user input
  return normalizeDefinitions(defs)
}
```

**Default - Hook into normal flow:**
```typescript
// No order specified - standard processing
async configureEngine(engine) {
  // Register shortcuts and defaults
}
```

**'post' - Output extension:**
```typescript
order: 'post',
async configureEngine(engine) {
  // Add final touches like CSS reset
}
```

## Combining Multiple Plugins

Plugins work together seamlessly:

```typescript
const engine = createEngine({
  plugins: [
    resetPlugin(),           // First: apply CSS reset
    typographyPlugin(),      // Then: add typography
    iconPlugin(),           // Then: add icon support
    buttonPlugin()          // Finally: add custom buttons
  ]
})
```

Each plugin:
- Extends the engine configuration
- Registers new shortcuts
- Adds preflights if needed
- Doesn't conflict with others

## Plugin Configuration Best Practices

### 1. Provide Sensible Defaults

```typescript
export function myPlugin(options?: MyOptions) {
  const config = {
    primaryColor: '#3b82f6',
    secondaryColor: '#10b981',
    ...options
  }
  
  return defineEnginePlugin({
    name: 'my-plugin',
    async configureEngine(engine) {
      // Use merged config
    }
  })
}
```

### 2. Allow Customization

```typescript
interface MyPluginOptions {
  colors?: Record<string, string>
  spacing?: Record<string, string>
  typography?: TypographyConfig
}

export function myPlugin(options?: MyPluginOptions) {
  // Merge with defaults
  const merged = mergeOptions(defaults, options)
  
  return defineEnginePlugin({
    name: 'my-plugin',
    async configureEngine(engine) {
      // Register with custom config
    }
  })
}
```

### 3. Use Module Augmentation

```typescript
declare module '@pikacss/core' {
  interface EngineConfig {
    myPlugin?: MyPluginOptions
  }
  
  interface Shortcuts {
    myShortcut: MyShortcutType
  }
}
```

## Troubleshooting Plugins

### Plugin Not Working

**Check:**
1. Plugin is in the `plugins` array
2. Plugin is properly initialized: `pluginName()` with parentheses
3. Engine config is passed to plugin function

```typescript
// ❌ Wrong - forgot parentheses
plugins: [myPlugin]

// ✅ Correct
plugins: [myPlugin()]
```

### Shortcut Not Found

**Check:**
1. Plugin is activated before use
2. Shortcut name matches exactly
3. Shortcut is registered in configureEngine

```typescript
// Debug: Check if shortcut exists
const result = await engine.process({ myShortcut: true })
console.log(result.css) // Should have styles
```

### Plugin Conflicts

If plugins conflict:
1. Check execution order (use `order` field)
2. Verify module augmentation types don't conflict
3. Ensure shortcuts have unique names

### Performance Issues

If plugins slow down builds:
1. Move expensive operations to configureEngine (runs once)
2. Use lazy evaluation for large datasets
3. Cache computed results

```typescript
class MyPlugin {
  private cache = new Map()
  
  async transformStyleDefinitions(defs) {
    const key = JSON.stringify(defs)
    if (this.cache.has(key)) {
      return this.cache.get(key)
    }
    const result = await expensiveTransform(defs)
    this.cache.set(key, result)
    return result
  }
}
```
