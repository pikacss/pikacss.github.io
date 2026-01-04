---
title: Plugin Development
description: Learn how to create custom PikaCSS plugins
outline: deep
---

# Plugin Development

This guide covers the complete process of creating custom PikaCSS plugins.

## Plugin Anatomy

A PikaCSS plugin is created using the `defineEnginePlugin` helper:

```typescript
import type { EnginePlugin } from '@pikacss/core'
import { defineEnginePlugin } from '@pikacss/core'

export function myPlugin(): EnginePlugin {
	return defineEnginePlugin({
		name: 'my-plugin',

		// Optional: Set plugin execution order
		order: 'post', // 'pre' | 'post' | undefined

		// Hooks...
	})
}
```

## Plugin Execution Order

Plugins can specify an `order` property to control execution order:

| Order | Description |
|-------|-------------|
| `'pre'` | Runs before default-order plugins |
| `undefined` | Runs in normal order (default) |
| `'post'` | Runs after default-order plugins |

```typescript
defineEnginePlugin({
	name: 'my-pre-plugin',
	order: 'pre', // Runs first
})
```

## Basic Example

Here's a simple plugin that adds a custom CSS property:

```typescript
import { defineEnginePlugin } from '@pikacss/core'

export function sizePlugin() {
	return defineEnginePlugin({
		name: 'size-plugin',

		async transformStyleDefinitions(defs) {
			return defs.map((def) => {
				if ('size' in def) {
					const { size, ...rest } = def
					return { ...rest, width: size, height: size }
				}
				return def
			})
		}
	})
}
```

Usage:

```typescript
pika({
	size: '100px' // Transforms to width: 100px; height: 100px;
})
```

## Advanced Example: Adding Shortcuts

```typescript
import { defineEnginePlugin } from '@pikacss/core'

export function utilityPlugin() {
	return defineEnginePlugin({
		name: 'utility-plugin',

		async configureEngine(engine) {
			// Add static shortcuts
			engine.shortcuts.add(
				['flex-center', {
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center'
				}],
				['text-ellipsis', {
					overflow: 'hidden',
					textOverflow: 'ellipsis',
					whiteSpace: 'nowrap'
				}]
			)

			// Add dynamic shortcuts
			engine.shortcuts.add(
				[/^grid-cols-(\d+)$/, match => ({
					display: 'grid',
					gridTemplateColumns: `repeat(${match[1]}, minmax(0, 1fr))`
				}), ['grid-cols-2', 'grid-cols-3', 'grid-cols-4']]
			)

			// Register for autocomplete
			engine.appendAutocompleteStyleItemStrings(
				'flex-center',
				'text-ellipsis'
			)
		}
	})
}
```

## Plugin with Configuration

Plugins can accept configuration options:

```typescript
import { defineEnginePlugin } from '@pikacss/core'

interface MyPluginOptions {
	prefix?: string
	enabled?: boolean
}

export function myPlugin(options: MyPluginOptions = {}) {
	const { prefix = 'my-', enabled = true } = options

	return defineEnginePlugin({
		name: 'my-plugin',

		async configureEngine(engine) {
			if (!enabled)
				return

			engine.shortcuts.add(
				[`${prefix}button`, { padding: '10px 20px' }]
			)
		}
	})
}
```

## Accessing Engine State

The `configureEngine` hook provides access to the full engine instance:

```typescript
async configureEngine(engine) {
  // Access configuration
  const config = engine.config

  // Access stored atomic styles
  const atomicStyles = engine.store.atomicStyles

  // Add preflights
  engine.addPreflight({
    ':root': {
      '--plugin-color': '#007bff'
    }
  })

  // Notify when preflight changes
  engine.notifyPreflightUpdated()

  // Add to autocomplete
  engine.appendAutocompleteSelectors('@custom')
  engine.appendAutocompleteExtraProperties('--my-var')
}
```

## Reacting to Events

Some hooks allow you to react to engine events:

```typescript
defineEnginePlugin({
	name: 'logger-plugin',

	// Called when preflight is updated
	preflightUpdated() {
		console.log('Preflight styles were updated')
	},

	// Called when a new atomic style is added
	atomicStyleAdded(atomicStyle) {
		console.log('New atomic style:', atomicStyle.id)
	},

	// Called when autocomplete config changes
	autocompleteConfigUpdated() {
		console.log('Autocomplete config was updated')
	}
})
```

## TypeScript Module Augmentation

When creating plugins that add new configuration options or extend the engine's capabilities, you should use TypeScript module augmentation to provide a better developer experience.

### Extending EngineConfig

If your plugin adds new top-level configuration options, extend the `EngineConfig` interface:

```typescript
import { defineEnginePlugin } from '@pikacss/core'

export type MyPluginOptions = 'option-a' | 'option-b'

declare module '@pikacss/core' {
	interface EngineConfig {
		/**
		 * Description of your custom option.
		 * @default 'option-a'
		 */
		myCustomOption?: MyPluginOptions
	}
}

export function myPlugin() {
	return defineEnginePlugin({
		name: 'my-plugin',
		configureRawConfig: (config) => {
			const value = config.myCustomOption // Now typed!
			// ...
		}
	})
}
```

### Extending Engine

You can also extend the `Engine` interface if your plugin adds methods or properties to the engine instance:

```typescript
declare module '@pikacss/core' {
	interface Engine {
		myCustomMethod(): void
	}
}

export function myPlugin() {
	return defineEnginePlugin({
		name: 'my-plugin',
		configureEngine: async (engine) => {
			engine.myCustomMethod = () => {
				console.log('Custom method called')
			}
		}
	})
}
```

## Best Practices

1. **Give descriptive names**: Use a name that reflects the plugin's functionality.

2. **Document configuration options**: Provide JSDoc comments for all options.

3. **Handle errors gracefully**: Wrap potentially failing code in try-catch.

4. **Use TypeScript**: Leverage type safety for better developer experience.

5. **Follow async/sync patterns**: Respect the hook types (async vs sync).

6. **Provide autocomplete hints**: Always register shortcuts/selectors for IDE support.

7. **Use Peer Dependencies**: Always list `@pikacss/core` as a peer dependency to avoid duplicate instances.

## Real-World Plugin Examples

### Animation Plugin

```typescript
import { defineEnginePlugin } from '@pikacss/core'

interface AnimationPluginOptions {
  animations?: Record<string, string>
}

export function animationPlugin(options: AnimationPluginOptions = {}) {
  const defaultAnimations = {
    'spin': 'spin 1s linear infinite',
    'pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
    'bounce': 'bounce 1s infinite'
  }

  const animations = { ...defaultAnimations, ...options.animations }

  return defineEnginePlugin({
    name: 'animation-plugin',
    order: 'pre',

    async configureEngine(engine) {
      // Add keyframes as preflights
      engine.addPreflight(`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: .5; }
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(-25%); }
          50% { transform: translateY(0); }
        }
      `)

      // Add shortcuts for animations
      Object.entries(animations).forEach(([name, value]) => {
        engine.shortcuts.add([`animate-${name}`, { animation: value }])
      })

      // Register for autocomplete
      engine.appendAutocompleteStyleItemStrings(
        ...Object.keys(animations).map(name => `animate-${name}`)
      )
    }
  })
}

// Usage
pika('animate-spin')
pika('animate-pulse')
```

### Theme Plugin

```typescript
import { defineEnginePlugin } from '@pikacss/core'

interface Theme {
  colors: Record<string, string>
  spacing: Record<string, string>
  breakpoints: Record<string, string>
}

export function themePlugin(theme: Theme) {
  return defineEnginePlugin({
    name: 'theme-plugin',

    async configureEngine(engine) {
      // Add CSS variables as preflight
      const cssVars = Object.entries(theme.colors)
        .map(([name, value]) => `--color-${name}: ${value};`)
        .join('\n  ')

      engine.addPreflight(`:root {\n  ${cssVars}\n}`)

      // Add color shortcuts
      Object.keys(theme.colors).forEach(colorName => {
        engine.shortcuts.add(
          [`text-${colorName}`, { color: `var(--color-${colorName})` }],
          [`bg-${colorName}`, { backgroundColor: `var(--color-${colorName})` }]
        )
      })

      // Add spacing shortcuts
      Object.entries(theme.spacing).forEach(([name, value]) => {
        engine.shortcuts.add(
          [`p-${name}`, { padding: value }],
          [`m-${name}`, { margin: value }]
        )
      })

      // Register for autocomplete
      const shortcuts = [
        ...Object.keys(theme.colors).flatMap(c => [`text-${c}`, `bg-${c}`]),
        ...Object.keys(theme.spacing).flatMap(s => [`p-${s}`, `m-${s}`])
      ]
      engine.appendAutocompleteStyleItemStrings(...shortcuts)
    }
  })
}

// Usage
const myTheme = {
  colors: {
    primary: '#3b82f6',
    secondary: '#6b7280',
    danger: '#ef4444'
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem'
  },
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px'
  }
}

export default defineEngineConfig({
  plugins: [themePlugin(myTheme)]
})
```

### Responsive Plugin

```typescript
import { defineEnginePlugin } from '@pikacss/core'

interface ResponsiveOptions {
  breakpoints?: Record<string, string>
}

export function responsivePlugin(options: ResponsiveOptions = {}) {
  const breakpoints = {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    ...options.breakpoints
  }

  return defineEnginePlugin({
    name: 'responsive-plugin',

    async transformStyleDefinitions(defs) {
      return defs.map(def => {
        const transformed = { ...def }

        // Transform responsive prefixes: sm:color -> @media (min-width: 640px) { color }
        Object.keys(def).forEach(key => {
          const match = key.match(/^(sm|md|lg|xl):(.+)/)
          if (match) {
            const [, breakpoint, property] = match
            const mediaQuery = `@media (min-width: ${breakpoints[breakpoint]})`
            
            if (!transformed[mediaQuery]) {
              transformed[mediaQuery] = {}
            }
            transformed[mediaQuery][property] = def[key]
            delete transformed[key]
          }
        })

        return transformed
      })
    }
  })
}

// Usage
pika({
  color: 'black',
  'sm:color': 'blue',    // Applies at 640px+
  'md:color': 'green',   // Applies at 768px+
  'lg:color': 'red'      // Applies at 1024px+
})
```

### Container Query Plugin

```typescript
import { defineEnginePlugin } from '@pikacss/core'

export function containerPlugin() {
  return defineEnginePlugin({
    name: 'container-plugin',

    async configureEngine(engine) {
      // Add container shortcuts
      engine.shortcuts.add(
        ['container', {
          containerType: 'inline-size'
        }],
        ['container-normal', {
          containerType: 'normal'
        }]
      )

      // Add container query selectors
      const sizes = ['sm', 'md', 'lg', 'xl']
      const sizeValues = {
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px'
      }

      sizes.forEach(size => {
        engine.shortcuts.add([
          `@${size}`,
          {
            [`@container (min-width: ${sizeValues[size]})`]: {}
          }
        ])
      })

      engine.appendAutocompleteStyleItemStrings('container', 'container-normal')
    }
  })
}

// Usage
pika({
  __shortcut: 'container',
  '@container (min-width: 640px)': {
    '$': {
      padding: '2rem'
    }
  }
})
```

### Debug Plugin

```typescript
import { defineEnginePlugin } from '@pikacss/core'

interface DebugPluginOptions {
  enabled?: boolean
  logLevel?: 'info' | 'warn' | 'error'
}

export function debugPlugin(options: DebugPluginOptions = {}) {
  const { enabled = process.env.NODE_ENV === 'development', logLevel = 'info' } = options

  return defineEnginePlugin({
    name: 'debug-plugin',

    async transformStyleDefinitions(defs) {
      if (enabled) {
        console[logLevel]('[PikaCSS Debug] Processing style definitions:', defs)
      }
      return defs
    },

    atomicStyleAdded(style) {
      if (enabled) {
        console[logLevel]('[PikaCSS Debug] New atomic style added:', {
          id: style.id,
          selector: style.content.selector,
          property: style.content.property,
          value: style.content.value
        })
      }
    },

    preflightUpdated() {
      if (enabled) {
        console[logLevel]('[PikaCSS Debug] Preflight styles updated')
      }
    }
  })
}

// Usage
export default defineEngineConfig({
  plugins: [
    debugPlugin({
      enabled: true,
      logLevel: 'info'
    })
  ]
})
```

## Testing Plugins

### Unit Testing

```typescript
// my-plugin.test.ts
import { createEngine, defineEngineConfig } from '@pikacss/core'
import { describe, expect, it } from 'vitest'
import { myPlugin } from './my-plugin'

describe('myPlugin', () => {
  it('adds expected shortcuts', async () => {
    const engine = await createEngine(defineEngineConfig({
      plugins: [myPlugin()]
    }))

    // Test shortcut registration
    const classNames = await engine.use('my-shortcut')
    expect(classNames).toBeDefined()
  })

  it('transforms style definitions correctly', async () => {
    const engine = await createEngine(defineEngineConfig({
      plugins: [myPlugin()]
    }))

    const classNames = await engine.use({
      customProperty: 'value'
    })

    expect(classNames).toEqual(expect.arrayContaining([expect.any(String)]))
  })

  it('generates expected CSS', async () => {
    const engine = await createEngine(defineEngineConfig({
      plugins: [myPlugin()]
    }))

    await engine.use({ customProperty: 'value' })

    const css = await engine.renderAtomicStyles(false)
    expect(css).toContain('expected-property')
  })
})
```

### Integration Testing

```typescript
// integration.test.ts
import { createEngine, defineEngineConfig } from '@pikacss/core'
import { describe, expect, it } from 'vitest'
import { animationPlugin, themePlugin } from './my-plugins'

describe('Plugin Integration', () => {
  it('works with multiple plugins', async () => {
    const engine = await createEngine(defineEngineConfig({
      plugins: [
        themePlugin({
          colors: { primary: '#3b82f6' },
          spacing: { md: '1rem' },
          breakpoints: {}
        }),
        animationPlugin()
      ]
    }))

    // Test theme plugin shortcuts
    const themeClasses = await engine.use('bg-primary')
    expect(themeClasses).toBeDefined()

    // Test animation plugin shortcuts
    const animClasses = await engine.use('animate-spin')
    expect(animClasses).toBeDefined()

    // Test combined usage
    const combined = await engine.use('bg-primary', 'animate-spin')
    expect(combined).toHaveLength(2)
  })
})
```

## Advanced Patterns

### Composable Plugins

Create plugins that work well together:

```typescript
// base-plugin.ts
export function createBasePlugin(namespace: string) {
  return defineEnginePlugin({
    name: `${namespace}-base`,
    
    async configureEngine(engine) {
      // Shared logic for plugin family
      engine.addPreflight(`/* ${namespace} base styles */`)
    }
  })
}

// feature-plugin.ts
export function createFeaturePlugin(namespace: string, features: string[]) {
  return defineEnginePlugin({
    name: `${namespace}-features`,
    order: 'post', // Run after base
    
    async configureEngine(engine) {
      features.forEach(feature => {
        engine.shortcuts.add([`${namespace}-${feature}`, { /* ... */ }])
      })
    }
  })
}

// Usage
plugins: [
  createBasePlugin('my'),
  createFeaturePlugin('my', ['button', 'card', 'modal'])
]
```

### Plugin Factories

```typescript
export function createUtilityPlugin<T extends string>(
  name: string,
  property: string,
  values: Record<T, string>
) {
  return defineEnginePlugin({
    name: `${name}-plugin`,

    async configureEngine(engine) {
      Object.entries(values).forEach(([key, value]) => {
        engine.shortcuts.add([
          `${name}-${key}`,
          { [property]: value as string }
        ])
      })

      engine.appendAutocompleteStyleItemStrings(
        ...Object.keys(values).map(k => `${name}-${k}`)
      )
    }
  })
}

// Create specific plugins
const textSizePlugin = createUtilityPlugin('text', 'fontSize', {
  xs: '0.75rem',
  sm: '0.875rem',
  base: '1rem',
  lg: '1.125rem',
  xl: '1.25rem'
})

const bgOpacityPlugin = createUtilityPlugin('bg-opacity', 'opacity', {
  0: '0',
  25: '0.25',
  50: '0.5',
  75: '0.75',
  100: '1'
})
```

### Conditional Plugin Loading

```typescript
export function conditionalPlugin(condition: boolean | (() => boolean)) {
  return defineEnginePlugin({
    name: 'conditional-plugin',

    async configureEngine(engine) {
      const isEnabled = typeof condition === 'function' 
        ? condition() 
        : condition

      if (!isEnabled) {
        return
      }

      // Plugin logic...
    }
  })
}

// Usage
plugins: [
  conditionalPlugin(process.env.NODE_ENV === 'development'),
  conditionalPlugin(() => Boolean(process.env.FEATURE_FLAG))
]
```

## Publishing Plugins

When publishing a plugin:

1. **Export both the plugin function and TypeScript types**
2. **Include `@pikacss/core` as a peer dependency and dev dependency**
3. **Document all configuration options in README**
4. **Provide usage examples**
5. **Include tests**
6. **Add TypeScript module augmentation if needed**

### Package Structure

```
my-plugin/
├── src/
│   ├── index.ts          # Main plugin export
│   └── types.ts          # Type definitions
├── tests/
│   └── index.test.ts     # Plugin tests
├── README.md             # Documentation
├── package.json
└── tsconfig.json
```

### package.json Example

```json
{
  "name": "@my-org/pikacss-plugin-example",
  "version": "1.0.0",
  "description": "Example PikaCSS plugin",
  "type": "module",
  "main": "./dist/index.js",
  "module": "./dist/index.mjs",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.mjs",
      "require": "./dist/index.js"
    }
  },
  "files": [
    "dist"
  ],
  "scripts": {
    "build": "tsdown",
    "test": "vitest"
  },
  "peerDependencies": {
    "@pikacss/core": "^0.0.37"
  },
  "devDependencies": {
    "@pikacss/core": "^0.0.37",
    "tsdown": "latest",
    "vitest": "latest"
  },
  "keywords": [
    "pikacss",
    "pikacss-plugin",
    "css-in-js"
  ]
}
```

### README Template

````markdown
# @my-org/pikacss-plugin-example

A PikaCSS plugin that does [what it does].

## Installation

```bash
pnpm add -D @my-org/pikacss-plugin-example
```

## Usage

```typescript
import { defineEngineConfig } from '@pikacss/core'
import { myPlugin } from '@my-org/pikacss-plugin-example'

export default defineEngineConfig({
  plugins: [
    myPlugin({
      // options
    })
  ]
})
```

## Options

### `option1`

- Type: `string`
- Default: `'default'`

Description of option1.

## Examples

[Provide practical examples]

## License

MIT
````

## Plugin Development Checklist

- [ ] Plugin has descriptive name
- [ ] All hooks are properly typed
- [ ] Error handling is implemented
- [ ] Configuration options are documented
- [ ] TypeScript module augmentation (if needed)
- [ ] Shortcuts are registered for autocomplete
- [ ] Unit tests are written
- [ ] Integration tests are written
- [ ] README is complete with examples
- [ ] Peer dependencies are correct
- [ ] Package exports are configured
- [ ] Version follows semver

## Next Steps

- Review [Plugin Hooks Reference](/advanced/plugin-hooks) for all available hooks
- Check [API Reference](/advanced/api-reference) for engine methods
- Explore [Official Plugins](/guide/plugin-system) for more examples
- See [Module Augmentation](/advanced/module-augmentation) for TypeScript patterns
