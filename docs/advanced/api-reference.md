---
title: API Reference
description: Complete API reference for PikaCSS
outline: deep
---

# API Reference

This document provides a complete reference of PikaCSS's public APIs.

## Factory Functions

### `createEngine(config?)`

Creates a new PikaCSS engine instance asynchronously.

**Signature:**
```typescript
function createEngine(config?: EngineConfig): Promise<Engine>
```

**Parameters:**
- `config` (optional): Engine configuration object of type `EngineConfig`
  - Default: `{}`
  - See [EngineConfig](#engineconfig) for all available options

**Returns:** `Promise<Engine>` - Resolves to configured Engine instance

**Example:**
```typescript
import { createEngine } from '@pikacss/core'

const engine = await createEngine({
	prefix: 'pk-',
	plugins: []
})
```

### `defineEngineConfig(config)`

Type-safe helper for defining engine configuration with full TypeScript autocomplete.

**Signature:**
```typescript
function defineEngineConfig(config: EngineConfig): EngineConfig
```

**Parameters:**
- `config`: Engine configuration object of type `EngineConfig`

**Returns:** `EngineConfig` - The same config object (identity function for type inference)

**Example:**
```typescript
import { defineEngineConfig } from '@pikacss/core'

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

Type-safe helper for defining custom plugins with full TypeScript autocomplete.

**Signature:**
```typescript
function defineEnginePlugin(plugin: EnginePlugin): EnginePlugin
```

**Parameters:**
- `plugin`: Plugin object implementing `EnginePlugin` interface

**Returns:** `EnginePlugin` - The same plugin object (identity function for type inference)

**Example:**
```typescript
// eslint-disable-next-line pikacss/pika-module-augmentation -- minimal example
import { defineEnginePlugin } from '@pikacss/core'

export function myPlugin() {
	return defineEnginePlugin({
		name: 'my-plugin',
		order: 'post',
		configureEngine: async (engine) => {
			// Configure engine
		}
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
interface Store {
	atomicStyleIds: Map<string, string> // Content hash → ID
	atomicStyles: Map<string, AtomicStyle> // ID → AtomicStyle
}

// Access via engine.store
const store: Store = engine.store
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
const variableStore: Map<string, ResolvedVariable[]> = engine.variables.store

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
const shortcutResolver: ShortcutResolver = engine.shortcuts.resolver
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
const selectorResolver: SelectorResolver = engine.selectors.resolver
```

#### `engine.keyframes`

Manages `@keyframes` animations.

```typescript
// Access keyframes store
const keyframesStore: Map<string, ResolvedKeyframesConfig> = engine.keyframes.store

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
type StyleItem
	= | UnionString
		| ResolvedAutocomplete['StyleItemString']
		| StyleDefinition
```

**Union members:**
- `UnionString` - String literals (for shortcut names, class strings)
- `ResolvedAutocomplete['StyleItemString']` - Autocomplete-augmented strings
- `StyleDefinition` - Style definition objects

### `StyleDefinition`

Recursive style object type that can be either base CSS properties or nested selectors.

```typescript
type StyleDefinition = Properties | {
	[K in Selector]?: Properties | StyleDefinition | StyleItem[]
}
```

**Union members:**
- `Properties` - Base CSS properties (extends CSSProperties with custom properties)
- Nested object with `Selector` keys - Allows selector nesting (`$:hover`, `@media`, etc.)

**Special meta-properties** (when using object form):
- `__important?: boolean` - Adds `!important` to all properties
- `__shortcut?: string | string[]` - Applies shortcuts within style object

**Example:**
```typescript
// Properties only
const styles1 = pika({ color: 'red', fontSize: '16px' })

// Nested selectors
const styles2 = pika({
	'color': 'blue',
	'$:hover': {
		color: 'red'
	},
	'@media (min-width: 768px)': {
		fontSize: '20px'
	}
})

// With meta-properties
const styles3 = pika({
	__important: true,
	__shortcut: 'btn',
	color: 'green'
})
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
	transformSelectors?: (selectors: string[]) => Awaitable<string[] | void>
	transformStyleItems?: (items: ResolvedStyleItem[]) => Awaitable<ResolvedStyleItem[] | void>
	transformStyleDefinitions?: (defs: ResolvedStyleDefinition[]) => Awaitable<ResolvedStyleDefinition[] | void>
	preflightUpdated?: () => void
	atomicStyleAdded?: (style: AtomicStyle) => void
	autocompleteConfigUpdated?: () => void
}
```

**Plugin Hooks:**

**Configuration Hooks (async):**
- `configureRawConfig` - Modify raw config before resolution. Return modified config or void.
- `rawConfigConfigured` - React to raw config after it's set (sync, no return).
- `configureResolvedConfig` - Modify resolved config. Return modified config or void.
- `configureEngine` - Configure engine after initialization.

**Transform Hooks (async):**
- `transformSelectors` - Transform selector list. Return modified list or void.
- `transformStyleItems` - Transform style items. Return modified items or void.
- `transformStyleDefinitions` - Transform style definitions. Return modified definitions or void.

**Notification Hooks (sync):**
- `preflightUpdated` - Called when preflights update.
- `atomicStyleAdded` - Called when atomic style is added with the style object.
- `autocompleteConfigUpdated` - Called when autocomplete config updates.

## Configuration Types

### `EngineConfig`

Main engine configuration interface.

```typescript
interface EngineConfig {
	prefix?: string
	plugins?: EnginePlugin[]
	preflights?: Preflight[]
	shortcuts?: ShortcutsConfig
	selectors?: SelectorsConfig
	variables?: VariablesConfig
	keyframes?: KeyframesConfig
	important?: ImportantConfig
}
```

**Options:**

#### `prefix`
- **Type:** `string`
- **Default:** `''`
- **Description:** Class name prefix for generated atomic styles

#### `plugins`
- **Type:** `EnginePlugin[]`
- **Default:** `[]`
- **Description:** Array of engine plugins to extend functionality

#### `preflights`
- **Type:** `Preflight[]`
- **Default:** `[]`
- **Description:** Global CSS rules applied before atomic styles

#### `shortcuts`
- **Type:** `ShortcutsConfig`
- **Description:** Shortcut definitions for reusable style combinations

#### `selectors`
- **Type:** `SelectorsConfig`
- **Description:** Custom selector definitions (pseudo-classes, media queries, etc.)

#### `variables`
- **Type:** `VariablesConfig`
- **Description:** CSS custom property definitions

#### `keyframes`
- **Type:** `KeyframesConfig`
- **Description:** `@keyframes` animation definitions

#### `important`
- **Type:** `ImportantConfig`
- **Description:** Configuration for `!important` handling

### Configuration Sub-Types

#### `ShortcutsConfig`

```typescript
interface ShortcutsConfig {
	shortcuts: Shortcut[]
}

type Shortcut
	= | [name: string, definition: StyleDefinition]
		| [pattern: RegExp, resolver: (match: RegExpMatchArray) => Awaitable<StyleDefinition>]
```

#### `SelectorsConfig`

```typescript
interface SelectorsConfig {
	selectors: Selector[]
}

type Selector
	= | string
		| [selector: string, value: string | string[]]
		| [selector: RegExp, resolver: (match: RegExpMatchArray) => Awaitable<string | string[]>]
```

#### `VariablesConfig`

```typescript
interface VariablesConfig {
	variables: VariablesDefinition
}

interface VariablesDefinition {
	[key: `--${string}`]: string | number
}
```

#### `KeyframesConfig`

```typescript
interface KeyframesConfig {
	keyframes: Keyframes[]
}

interface Keyframes {
	name: string
	definition: Record<string, Properties>
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

### Style Definition Helpers

#### `defineStyleDefinition(styleDefinition)`

Type-safe helper for defining reusable style objects:

```typescript
import { defineStyleDefinition } from '@pikacss/core'

const buttonBase = defineStyleDefinition({
	padding: '10px 20px',
	borderRadius: '4px',
	border: 'none'
})
```

#### `defineKeyframes(keyframes)`

Type-safe helper for defining keyframe animations:

```typescript
import { defineKeyframes } from '@pikacss/core'

const fadeIn = defineKeyframes({
	name: 'fadeIn',
	definition: {
		from: { opacity: 0 },
		to: { opacity: 1 }
	}
})
```

#### `defineSelector(selector)`

Type-safe helper for defining custom selectors:

```typescript
import { defineSelector } from '@pikacss/core'

// Static selector
const hover = defineSelector(['hover', '$:hover'])

// Dynamic selector
const screen = defineSelector([
	/^screen-(\d+)$/,
	match => `@media (min-width: ${match[1]}px)`
])
```

#### `defineShortcut(shortcut)`

Type-safe helper for defining shortcuts:

```typescript
import { defineShortcut } from '@pikacss/core'

// Static shortcut
const btn = defineShortcut(['btn', {
	padding: '10px 20px',
	borderRadius: '4px'
}])

// Dynamic shortcut
const m = defineShortcut([
	/^m-(\d+)$/,
	match => ({ margin: `${match[1]}px` })
])
```

#### `defineVariables(variables)`

Type-safe helper for defining CSS custom properties:

```typescript
import { defineVariables } from '@pikacss/core'

const colors = defineVariables({
	'--color-primary': '#007bff',
	'--color-secondary': '#6c757d',
	'--color-success': '#28a745'
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
	preflights: [],
	atomicStyles: []
})
```
