---
title: API Reference
description: Complete API reference for PikaCSS
outline: deep
---

# API Reference

This document provides a complete reference of PikaCSS's public APIs.

## Factory Functions

### `createEngine(config?)`

Creates a new PikaCSS engine instance.

```typescript
import { createEngine } from '@pikacss/core'

const engine = await createEngine({
	prefix: 'pk-',
	plugins: []
})
```

### `defineEngineConfig(config)`

Type-safe helper for defining engine configuration.

```typescript
import { defineEngineConfig } from '@pikacss/unplugin-pikacss'

export default defineEngineConfig({
	prefix: '',
	plugins: [],
	shortcuts: [],
	selectors: {},
	variables: {},
	keyframes: [],
	preflights: []
})
```

### `defineEnginePlugin(plugin)`

Type-safe helper for defining custom plugins.

```typescript
import { defineEnginePlugin } from '@pikacss/core'

export function myPlugin() {
	return defineEnginePlugin({
		name: 'my-plugin',
		// Plugin hooks
	})
}
```

## The `pika()` Function

The core function for defining styles.

### Basic Usage

```typescript
const className = pika({
	color: 'red',
	fontSize: '16px'
})
// Returns: "a b" (atomic class names)
```

### Output Variants

#### `pika.str(...)`

Returns a space-separated string of class names (default behavior).

```typescript
const classes = pika.str({ color: 'red' })
// Returns: "a"
```

#### `pika.arr(...)`

Returns an array of class names.

```typescript
const classList = pika.arr({ color: 'red' })
// Returns: ["a"]
```

#### `pika.inl(...)`

Returns a space-separated string of class names, same as `pika.str()`.

```typescript
const inline = `class="${pika.inl({ color: 'red' })}"`
// Returns: "class=a" (unquoted string interpolation)
```

### Special Properties

#### `__important`

Adds `!important` to all CSS properties in the style object.

```typescript
pika({
	__important: true,
	color: 'red',
	fontSize: '16px'
})
// Output CSS: color: red !important; font-size: 16px !important;
```

#### `__shortcut`

Applies a shortcut by name within a style object.

```typescript
// Single shortcut
pika({
	__shortcut: 'btn',
	color: 'blue'
})

// Multiple shortcuts
pika({
	__shortcut: ['btn', 'text-center'],
	color: 'blue'
})
```

## Engine Instance

The `Engine` class is the core of PikaCSS.

### Properties

#### `config: ResolvedEngineConfig`

The resolved configuration object.

#### `store`

Internal storage for atomic styles.

```typescript
engine.store: {
  atomicStyleIds: Map<string, string>    // Content hash → ID
  atomicStyles: Map<string, AtomicStyle> // ID → AtomicStyle
}
```

### Core Methods

#### `use(...items): Promise<string[]>`

Processes style items and returns generated class names.

```typescript
const classNames = await engine.use(
	{ color: 'red' },
	{ fontSize: '16px' }
)
// Returns: ['a', 'b']
```

#### `addPreflight(preflight)`

Adds a preflight (global CSS) to the engine.

```typescript
// String format
engine.addPreflight('body { margin: 0; }')

// Object format
engine.addPreflight({
	body: { margin: 0, fontFamily: 'sans-serif' }
})

// Function format
engine.addPreflight((engine, isFormatted) => {
	return { ':root': { '--color': 'blue' } }
})
```

### Rendering Methods

#### `renderPreflights(isFormatted): Promise<string>`

Renders all preflights as CSS string.

```typescript
const preflightCSS = await engine.renderPreflights(true)
```

#### `renderAtomicStyles(isFormatted, options?): Promise<string>`

Renders atomic styles as CSS string.

```typescript
const css = await engine.renderAtomicStyles(true, {
	atomicStyleIds: ['a', 'b'], // Optional: specific styles
	isPreview: false // Optional: preview mode
})
```

### Extended Properties

These properties are added by core plugins:

#### `engine.variables`

Manages CSS custom properties.

```typescript
// Access variable store
engine.variables.store: Map<string, ResolvedVariable[]>

// Add variables programmatically
engine.variables.add({
  '--color-primary': '#007bff',
  '--spacing': '8px'
})
```

#### `engine.shortcuts`

Manages style shortcuts.

```typescript
// Add shortcuts
engine.shortcuts.add(
  ['btn', { padding: '10px', borderRadius: '4px' }],
  [/^m-(\d+)$/, match => ({ margin: `${match[1]}px` })]
)

// Access resolver
engine.shortcuts.resolver: ShortcutResolver
```

#### `engine.selectors`

Manages selector aliases.

```typescript
// Add selectors
engine.selectors.add(
  [':hover', '$:hover'],
  ['@dark', 'html.dark $']
)

// Access resolver
engine.selectors.resolver: SelectorResolver
```

#### `engine.keyframes`

Manages `@keyframes` animations.

```typescript
// Access keyframes store
engine.keyframes.store: Map<string, ResolvedKeyframesConfig>

// Add keyframes
engine.keyframes.add(
  ['fadeIn', { from: { opacity: 0 }, to: { opacity: 1 } }]
)
```

### Autocomplete Methods

Methods for extending IDE autocomplete:

```typescript
// Add selectors to autocomplete
engine.appendAutocompleteSelectors(':hover', ':focus', '@dark')

// Add shortcuts to autocomplete
engine.appendAutocompleteStyleItemStrings('btn', 'flex-center')

// Add custom CSS properties
engine.appendAutocompleteExtraProperties('--my-var', '--theme-color')

// Add CSS properties
engine.appendAutocompleteExtraCssProperties('aspect-ratio')

// Add property values (TypeScript types)
engine.appendAutocompletePropertyValues('display', '"flex"', '"grid"')

// Add property values (CSS)
engine.appendAutocompleteCssPropertyValues('display', 'flex', 'grid')

// Trigger update notification
engine.notifyAutocompleteConfigUpdated()
```

### Notification Methods

```typescript
engine.notifyPreflightUpdated()
engine.notifyAtomicStyleAdded(atomicStyle)
engine.notifyAutocompleteConfigUpdated()
```

## Type Definitions

### `StyleItem`

Input type for `pika()` and `engine.use()`.

```typescript
type StyleItem = string | StyleDefinition | StyleItem[]
```

### `StyleDefinition`

Recursive style object type.

```typescript
interface StyleDefinition {
	[key: string]: string | number | StyleDefinition
	__important?: boolean
	__shortcut?: string | string[]
}
```

### `AtomicStyle`

Internal atomic style representation.

```typescript
interface StyleContent {
	selector: string[]
	property: string
	value: string[]
}

interface AtomicStyle {
	id: string
	content: StyleContent
}
```

### `Preflight`

Preflight input type.

```typescript
type Preflight = string | PreflightDefinition | PreflightFn

interface PreflightDefinition {
	[selector: string]: CSSProperties | PreflightDefinition
}

type PreflightFn = (
	engine: Engine,
	isFormatted: boolean
) => Awaitable<string | PreflightDefinition>
```

### `EnginePlugin`

Plugin definition type.

```typescript
interface EnginePlugin {
	name: string
	order?: 'pre' | 'post'
	configureRawConfig?: (config: EngineConfig) => Awaitable<EngineConfig | void>
	rawConfigConfigured?: (config: EngineConfig) => void
	configureResolvedConfig?: (config: ResolvedEngineConfig) => Awaitable<ResolvedEngineConfig | void>
	configureEngine?: (engine: Engine) => Awaitable<void>
	transformSelectors?: (selectors: string[]) => Awaitable<string[]>
	transformStyleItems?: (items: ResolvedStyleItem[]) => Awaitable<ResolvedStyleItem[]>
	transformStyleDefinitions?: (defs: ResolvedStyleDefinition[]) => Awaitable<ResolvedStyleDefinition[]>
	preflightUpdated?: () => void
	atomicStyleAdded?: (style: AtomicStyle) => void
	autocompleteConfigUpdated?: () => void
}
```

## Utility Functions

### Preflight Utilities

#### `definePreflight(preflight)`

Type-safe helper for defining preflights:

```typescript
import { definePreflight } from '@pikacss/core'

export const myPreflight = definePreflight({
	body: { margin: 0, fontFamily: 'sans-serif' }
})
```

### Autocomplete Utilities

These functions extend IDE autocomplete and are typically used by plugins:

#### `appendAutocompleteSelectors(...selectors)`

Add selector suggestions to autocomplete:

```typescript
engine.appendAutocompleteSelectors(':hover', ':focus', '@dark')
```

#### `appendAutocompleteStyleItemStrings(...items)`

Add shortcut names to autocomplete:

```typescript
engine.appendAutocompleteStyleItemStrings('btn', 'flex-center')
```

#### `appendAutocompleteExtraProperties(...properties)`

Add custom CSS properties to autocomplete:

```typescript
engine.appendAutocompleteExtraProperties('--my-var', '--theme-color')
```

#### `appendAutocompleteExtraCssProperties(...properties)`

Add CSS properties to autocomplete:

```typescript
engine.appendAutocompleteExtraCssProperties('aspect-ratio')
```

#### `appendAutocompletePropertyValues(property, ...tsTypes)`

Add TypeScript type strings as property value suggestions:

```typescript
engine.appendAutocompletePropertyValues('display', '"flex"', '"grid"')
```

#### `appendAutocompleteCssPropertyValues(property, ...values)`

Add CSS values to property autocomplete:

```typescript
engine.appendAutocompleteCssPropertyValues('display', 'flex', 'grid')
```

### Rendering Utilities

#### `renderCSSStyleBlocks(styleBlocks)`

Low-level utility to render CSS style blocks to string:

```typescript
import { renderCSSStyleBlocks } from '@pikacss/core'

const css = renderCSSStyleBlocks({
	preflights: [...],
	atomicStyles: [...]
})
```
