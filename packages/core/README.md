# @pikacss/core

The core Atomic CSS-in-JS engine of PikaCSS.

## Installation

```bash
pnpm add @pikacss/core
```

## Quick Start

```typescript
import { createEngine, defineEngineConfig } from '@pikacss/core'

const config = defineEngineConfig({
	// Engine configuration
	prefix: 'pk-',
	defaultSelector: '.%',
	plugins: []
})

// createEngine is async and returns a fully initialized engine
const engine = await createEngine(config)
```

## Features

- ⚡ High-performance Atomic CSS-in-JS engine
- 🎯 Type-safe with full TypeScript support
- 🔌 Extensible plugin system with hooks
- 🎨 Built-in support for shortcuts, selectors, variables, keyframes, and important rules
- 🔧 Fully configurable with type-safe helpers
- 🌐 Framework-agnostic core (zero dependencies except csstype)

## Usage for Integration Developers

### Creating an Engine

```typescript
import { createEngine, defineEngineConfig } from '@pikacss/core'

const config = defineEngineConfig({
	// Prefix for generated atomic CSS class names
	prefix: 'pk-',

	// Default selector format (% will be replaced with atomic ID)
	defaultSelector: '.%',

	// Plugins to extend functionality
	plugins: [],

	// Global CSS preflights
	preflights: [],
})

// createEngine is async - it returns a fully initialized engine
const engine = await createEngine(config)
```

### Engine Methods and Properties

The `Engine` instance provides methods and sub-systems for managing CSS generation:

```typescript
// Add global CSS preflight
engine.addPreflight('* { box-sizing: border-box; }')

// Process style items and get atomic class IDs
const classNames = await engine.use({ color: 'red' }, { display: 'flex' })

// Render generated preflights
const preflightCSS = await engine.renderPreflights(true)

// Render generated atomic styles
const atomicCSS = await engine.renderAtomicStyles(true)

// Access sub-systems (provided by built-in plugins)
engine.variables // { store: Map, add: (variables) => void }
engine.keyframes // { store: Map, add: (...keyframes) => void }
engine.selectors // { resolver: SelectorResolver, add: (...selectors) => void }
engine.shortcuts // { resolver: ShortcutResolver, add: (...shortcuts) => void }

// Access configuration
engine.config // ResolvedEngineConfig

// Autocomplete helpers
engine.appendAutocompleteSelectors('hover', 'focus')
engine.appendAutocompleteStyleItemStrings('flex-center')
```

### Configuration

Use `defineEngineConfig` for type-safe configuration:

```typescript
import { defineEngineConfig } from '@pikacss/core'

export default defineEngineConfig({
	// Prefix for atomic class IDs
	prefix: 'pk-',

	// Default selector format (% = atomic ID)
	defaultSelector: '.%',

	// Global CSS preflights (string or function)
	preflights: [
		':root { --primary: #3b82f6; }',
		// Or function:
		(engine, isFormatted) => '/* Generated CSS */'
	],

	// Shortcuts configuration
	shortcuts: {
		shortcuts: [
			['flex-center', {
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center'
			}],
		]
	},

	// Plugins to extend functionality
	plugins: []
})
```

## API

### Main Exports

```typescript
// Engine creation (async)
export function createEngine(config?: EngineConfig): Promise<Engine>

// Type-safe config helpers
export function defineEngineConfig(config: EngineConfig): EngineConfig
export function defineEnginePlugin(plugin: EnginePlugin): EnginePlugin
export function defineStyleDefinition(def: StyleDefinition): StyleDefinition
export function definePreflight(preflight: Preflight): Preflight
export function defineKeyframes(keyframes: Keyframes): Keyframes
export function defineSelector(selector: Selector): Selector
export function defineShortcut(shortcut: Shortcut): Shortcut
export function defineVariables(variables: VariablesDefinition): VariablesDefinition

// Utilities
export {
	appendAutocompleteCssPropertyValues,
	appendAutocompleteExtraCssProperties,
	appendAutocompleteExtraProperties,
	appendAutocompletePropertyValues,
	appendAutocompleteSelectors,
	appendAutocompleteStyleItemStrings,
	createLogger,
	log,
	renderCSSStyleBlocks,
}
```

### Engine Instance

The `Engine` instance provides:

**Core methods:**
- `engine.addPreflight(css)` - Add global CSS preflight
- `engine.use(...styleItems)` - Process style items and return atomic class IDs
- `engine.renderPreflights(isFormatted)` - Render all preflight CSS
- `engine.renderAtomicStyles(isFormatted, options?)` - Render atomic style CSS

**Sub-systems (provided by built-in plugins):**
- `engine.variables` - CSS variables management with `store` and `add()`
- `engine.keyframes` - CSS keyframes management with `store` and `add()`
- `engine.selectors` - CSS selectors management with `resolver` and `add()`
- `engine.shortcuts` - CSS shortcuts management with `resolver` and `add()`

**Properties:**
- `engine.config` - Resolved engine configuration
- `engine.store` - Internal storage for atomic styles and IDs
- `engine.extract` - Style extraction function

## Plugin Development

Create custom plugins to extend PikaCSS using the `EnginePlugin` interface:

```typescript
/* eslint-disable pikacss/pika-module-augmentation */
import type { EnginePlugin } from '@pikacss/core'
import { defineEnginePlugin } from '@pikacss/core'

export function myPlugin(): EnginePlugin {
	return defineEnginePlugin({
		name: 'my-plugin',

		// Optional: Control execution order ('pre' | 'post')
		order: 'pre',

		// Hook into engine lifecycle
		async configureEngine(engine) {
			// Add global CSS
			engine.addPreflight('/* plugin styles */')

			// Add custom shortcuts
			engine.shortcuts.add([
				'my-shortcut',
				{ display: 'flex', gap: '1rem' }
			])

			// Add custom selectors
			engine.selectors.add(['hover', '$:hover'])
		},

		// Transform style definitions
		async transformStyleDefinitions(definitions) {
			// Modify or add style definitions
			return definitions
		},

		// Other available hooks:
		// - configureRawConfig(config)
		// - rawConfigConfigured(config)
		// - configureResolvedConfig(config)
		// - transformSelectors(selectors)
		// - transformStyleItems(styleItems)
		// - preflightUpdated()
		// - atomicStyleAdded(atomicStyle)
		// - autocompleteConfigUpdated()
	})
}
```

## Documentation

For complete documentation, visit: [PikaCSS Documentation](https://pikacss.github.io/pikacss/)

## License

MIT © DevilTea
