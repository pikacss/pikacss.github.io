# Plugin System Best Practices

## Plugin Architecture

### Plugin Interface

All plugins must implement the `EnginePlugin` interface:

```typescript
interface EnginePlugin {
	name: string
	order?: 'pre' | 'post'
	hooks?: {
		configureEngine?: Hook
		transformStyleDefinitions?: Hook
		// ... other hooks
	}
}
```

### Creating a Plugin

Use `defineEnginePlugin` helper:

<!-- eslint-disable pikacss/pika-module-augmentation -->
```typescript
import { defineEnginePlugin } from '@pikacss/core'

export function myPlugin(options?: Options): EnginePlugin {
	return defineEnginePlugin({
		name: 'my-plugin',
		order: 'post', // Control execution order
		async configureEngine(engine) {
			// Configure engine here
		}
	})
}
```

## Execution Order

### Plugin Order Control

Plugins execute in this order:
1. `'pre'` plugins (run first)
2. Default order plugins (no `order` field)
3. `'post'` plugins (run last)

```typescript
// Run before core logic
order: 'pre'

// Run in standard order (default)
order: undefined // or omit the field

// Run after core logic
order: 'post'
```

### When to Use Each Order

**`pre` - Transform input before core processing**
<!-- eslint-disable pikacss/pika-module-augmentation -->
```typescript
// Example: normalize user input
defineEnginePlugin({
	name: 'example',
	order: 'pre',
	transformStyleDefinitions(defs) {
		return normalizeDefinitions(defs)
	}
})
```

**Default - Hook into normal flow**
<!-- eslint-disable pikacss/pika-module-augmentation -->
```typescript
// Example: add default utilities
defineEnginePlugin({
	name: 'example',
	configureEngine(engine) {
		engine.registerShortcut('btn', { px: '1rem', py: '0.5rem' })
	}
})
```

**`post` - Process output after core**
<!-- eslint-disable pikacss/pika-module-augmentation -->
```typescript
// Example: add custom CSS reset
defineEnginePlugin({
	name: 'example',
	order: 'post',
	configureEngine(engine) {
		engine.addPreflight(resetStyles)
	}
})
```

## Module Augmentation

### Extending Engine Config

Plugins declare their configuration interface:

```typescript
// packages/plugin-myfeature/src/index.ts
declare module '@pikacss/core' {
	interface EngineConfig {
		myFeatureOption?: string
		myFeatureSettings?: {
			enabled: boolean
			level: number
		}
	}
}

export function myFeature(opts?: Options): EnginePlugin {
	return defineEnginePlugin({
		name: 'my-feature',
		configureEngine(engine) {
			// User can now pass myFeatureOption to engine config
		}
	})
}
```

### Extending Shortcuts

Plugins can register new shortcuts:

```typescript
declare module '@pikacss/core' {
	interface Shortcuts {
		btn: {
			px: string
			py: string
			rounded: string
			// ... other properties
		}
	}
}
```

## Error Handling

### Graceful Degradation

Always wrap operations that may fail:

<!-- eslint-disable pikacss/pika-module-augmentation -->
```typescript
defineEnginePlugin({
	name: 'example',
	async transformStyleDefinitions(defs) {
		try {
			const result = await riskyOperation(defs)
			return result
		}
		catch (error) {
			console.error(`[plugin-name] Error during transformation:`, error)
			// Return original defs to prevent breaking the pipeline
			return defs
		}
	}
})
```

### Validation

Validate input before processing:

<!-- eslint-disable pikacss/pika-module-augmentation -->
```typescript
function validateStyleDef(def: unknown): boolean {
	return (
		typeof def === 'object'
		&& def !== null
		&& ('color' in def || 'display' in def || 'fontSize' in def)
	)
}

defineEnginePlugin({
	name: 'example',
	configureEngine(engine) {
		if (!validateConfig(this.options)) {
			throw new Error('[plugin-name] Invalid configuration')
		}
	}
})
```

### Logging

Use consistent log format:

```typescript
console.log(`[plugin-name] Starting initialization`)
console.warn(`[plugin-name] Warning: feature not available`)
console.error(`[plugin-name] Error: invalid input`)
```

## Dependency Management

### Peer Dependencies

Plugins always list `@pikacss/core` as peer dependency:

```json
{
	"peerDependencies": {
		"@pikacss/core": "workspace:*"
	},
	"devDependencies": {
		"@pikacss/core": "workspace:*"
	}
}
```

### Optional Dependencies

For external integrations, use optional dependencies:

```json
{
	"optionalDependencies": {
		"some-external-lib": "^1.0.0"
	}
}
```

Check before using:

<!-- eslint-disable pikacss/pika-module-augmentation -->
```typescript
defineEnginePlugin({
	name: 'example',
	async configureEngine(engine) {
		try {
			const lib = await import('some-external-lib')
			// Use lib
		}
		catch {
			console.warn('[plugin-name] some-external-lib not available')
		}
	}
})
```

## Plugin Lifecycle

### Configuration Phase

Runs during engine initialization:

<!-- eslint-disable pikacss/pika-module-augmentation -->
```typescript
defineEnginePlugin({
	name: 'example',
	configureEngine(engine) {
		// Register shortcuts
		engine.registerShortcut('btn', { px: '1rem', py: '0.5rem' })

		// Add preflights
		engine.addPreflight('* { margin: 0; }')

		// Configure defaults
		engine.setDefault('fontSize', '16px')
	}
})
```

### Processing Phase

Runs when styles are processed:

<!-- eslint-disable pikacss/pika-module-augmentation -->
```typescript
defineEnginePlugin({
	name: 'example',
	transformStyleDefinitions(defs) {
		// Transform style definitions
		return {
			...defs,
			myCustomProp: transformedValue
		}
	},
	generateCSS(definitions) {
		// Generate additional CSS
		return `.custom-class { color: red; }`
	}
})
```

## Testing Plugins

### Basic Plugin Test

```typescript
import { createEngine } from '@pikacss/core'
import { describe, expect, it } from 'vitest'
import { myPlugin } from '../src'

describe('my-plugin', () => {
	it('should register shortcuts', async () => {
		const engine = createEngine({
			plugins: [myPlugin()]
		})

		const result = await engine.process({
			btn: true
		})

		expect(result.css)
			.toContain('.btn')
	})

	it('should handle options', () => {
		const engine = createEngine({
			plugins: [myPlugin({
				prefix: 'custom-'
			})]
		})

		// Test with options
	})

	it('should gracefully handle errors', async () => {
		const engine = createEngine({
			plugins: [myPlugin()]
		})

		const result = await engine.process({
			invalidInput: Symbol('not serializable')
		})

		// Should not throw
		expect(result)
			.toBeDefined()
	})
})
```

### Integration Test with Multiple Plugins

```typescript
describe('plugins together', () => {
	it('should work with other plugins', async () => {
		const engine = createEngine({
			plugins: [
				pluginA(),
				myPlugin(),
				pluginB()
			]
		})

		const result = await engine.process(styles)

		// Verify all plugins contributed
		expect(result.css)
			.toContain('plugin-a-style')
		expect(result.css)
			.toContain('my-plugin-style')
		expect(result.css)
			.toContain('plugin-b-style')
	})
})
```

## Performance Considerations

### Minimize Hook Overhead

Keep hooks lightweight:

<!-- eslint-disable pikacss/pika-module-augmentation -->
```typescript
// ❌ Bad: Complex processing in configureEngine
defineEnginePlugin({
	name: 'bad-example',
	configureEngine(engine) {
		for (let i = 0; i < 10000; i++) {
			engine.registerShortcut(`btn-${i}`, { px: `${i}px` })
		}
	}
})

// ✅ Good: Lazy register shortcuts on demand
defineEnginePlugin({
	name: 'good-example',
	configureEngine(engine) {
		engine.registerShortcutResolver((name) => {
			if (name.startsWith('btn-')) {
				return generateButtonShortcut(name)
			}
		})
	}
})
```

### Cache Expensive Operations

```typescript
class MyPlugin {
	private cache = new Map()

	async transformStyleDefinitions(defs) {
		const cacheKey = JSON.stringify(defs)
		if (this.cache.has(cacheKey)) {
			return this.cache.get(cacheKey)
		}

		const result = await expensiveTransform(defs)
		this.cache.set(cacheKey, result)
		return result
	}
}
```

## Official Plugins Reference

### @pikacss/plugin-icons

Registers icon shortcuts:

```typescript
declare module '@pikacss/core' {
	interface Shortcuts {
		icon: {
			name: string
			size?: string
			color?: string
		}
	}
}
```

### @pikacss/plugin-reset

Adds CSS reset styles:

<!-- eslint-disable pikacss/pika-module-augmentation -->
```typescript
defineEnginePlugin({
	name: 'reset',
	configureEngine(engine) {
		engine.addPreflight(resetCSS)
	}
})
```

### @pikacss/plugin-typography

Registers typography shortcuts:

```typescript
declare module '@pikacss/core' {
	interface Shortcuts {
		h1: TypographyDef
		h2: TypographyDef
		// ... other headings
	}
}
```

## Common Patterns

### Conditional Plugin Behavior

<!-- eslint-disable pikacss/pika-module-augmentation -->
```typescript
export function myPlugin(options?: Options): EnginePlugin {
	return defineEnginePlugin({
		name: 'my-plugin',
		async configureEngine(engine) {
			if (options?.enabled === false) {
				return // Don't register anything
			}

			engine.registerShortcut('feature', { /* feature shortcut config */ })
		}
	})
}
```

### Plugin Composition

<!-- eslint-disable pikacss/pika-module-augmentation -->
```typescript
// Create base plugin
function basePlugin(): EnginePlugin {
	return defineEnginePlugin({
		name: 'base',
		async configureEngine(engine) {
			// Base functionality
		}
	})
}

// Extend with specialized plugin
export function extendedPlugin(): EnginePlugin {
	return defineEnginePlugin({
		name: 'extended',
		order: 'post',
		async configureEngine(engine) {
			// Enhanced functionality
		}
	})
}
```

### User Configuration Passthrough

<!-- eslint-disable pikacss/pika-module-augmentation -->
```typescript
export function myPlugin(userConfig?: UserConfig): EnginePlugin {
	return defineEnginePlugin({
		name: 'my-plugin',
		async configureEngine(engine) {
			const mergedConfig = {
				...defaultConfig,
				...userConfig
			}

			engine.registerShortcut('feature', {
				...mergedConfig.feature
			})
		}
	})
}
```
