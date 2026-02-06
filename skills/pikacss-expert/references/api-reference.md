# PikaCSS API Reference

## Complete API Documentation

### Core Functions

#### `pika(definition: StyleDefinition): GeneratedStyles`

Main function for defining atomic styles.

**Parameters:**
- `definition`: A CSS style object with standard property names

**Returns:**
- Object with generated class name and metadata

**Example:**
```typescript
const styles = pika({
	display: 'flex',
	gap: '1rem',
	padding: '2rem'
})

console.log(styles.className) // Generated class name
console.log(styles.css) // Raw CSS string (dev mode)
```

**Supported Properties:**
All standard CSS properties in camelCase:
- Layout: `display`, `flexDirection`, `gridTemplateColumns`, etc.
- Sizing: `width`, `height`, `minWidth`, `maxHeight`, etc.
- Colors: `color`, `backgroundColor`, `borderColor`, etc.
- Spacing: `padding`, `margin`, `gap`, etc.
- Borders: `border`, `borderRadius`, `borderWidth`, etc.
- Typography: `fontSize`, `fontWeight`, `lineHeight`, `fontFamily`, etc.
- Transforms: `transform`, `rotate`, `scale`, etc.
- Effects: `boxShadow`, `opacity`, `filter`, etc.

#### `createEngine(config: EngineConfig): Engine`

Create a configured PikaCSS engine instance.

**Parameters:**
- `config`: Engine configuration object

**Returns:**
- Configured Engine instance

**Example:**
```typescript
const engine = createEngine({
	plugins: [iconPlugin(), resetPlugin()],
	theme: {
		colors: { primary: '#3b82f6' }
	}
})

const styles = await engine.process({
	color: 'var(--primary)'
})
```

### Configuration Objects

#### `EngineConfig`

Configuration for engine initialization.

**Properties:**
```typescript
interface EngineConfig {
	// Plugins to use
	plugins?: EnginePlugin[]

	// Theme values
	theme?: {
		colors?: Record<string, string>
		spacing?: Record<string, string>
		[key: string]: any
	}

	// Default CSS values
	defaults?: Record<string, string>

	// Namespace/prefix for generated classes
	namespace?: string

	// Source map generation (dev mode)
	sourceMap?: boolean
}
```

#### `StyleDefinition`

User-provided style definition object.

**Properties:**
```typescript
interface StyleDefinition {
	// Standard CSS properties in camelCase
	[cssProp: string]: string | number | boolean | StyleDefinition

	// Pseudo-elements with $ prefix
	'$before'?: StyleDefinition
	'$after'?: StyleDefinition
	'$firstLine'?: StyleDefinition
	'$firstLetter'?: StyleDefinition
	'$selection'?: StyleDefinition
	'$placeholder'?: StyleDefinition

	// Pseudo-classes
	'&:hover'?: StyleDefinition
	'&:active'?: StyleDefinition
	'&:focus'?: StyleDefinition
	'&:disabled'?: StyleDefinition
	'&:visited'?: StyleDefinition

	// Media queries
	'@media (min-width: 768px)'?: StyleDefinition
	'@media (prefers-color-scheme: dark)'?: StyleDefinition

	// Child selectors
	'& > *'?: StyleDefinition
	'& > *:not(:last-child)'?: StyleDefinition

	// Shortcuts (if registered)
	'btn'?: ShortcutDefinition
	'icon'?: ShortcutDefinition
	'h1'?: boolean
}
```

### Return Types

#### `GeneratedStyles`

Return value from `pika()` call.

**Properties:**
```typescript
interface GeneratedStyles {
	// Generated CSS class name
	className: string

	// Unique identifier
	id: string

	// Raw CSS (development mode only)
	css?: string

	// Original definition
	definition: StyleDefinition

	// Metadata
	meta?: {
		size: number
		rules: number
		used: string[]
	}
}
```

### Plugin System

#### `EnginePlugin`

Plugin interface for extending engine capabilities.

**Example:**
```typescript
interface EnginePlugin {
	name: string
	order?: 'pre' | 'post'

	hooks?: {
		configureEngine?: (engine: Engine) => void | Promise<void>
		transformStyleDefinitions?: (defs: StyleDefinition) => StyleDefinition
		generateCSS?: (styles: ProcessedStyle[]) => string
	}
}
```

#### `defineEnginePlugin(config: EnginePluginConfig)`

Helper to create a plugin with proper typing.

**Example:**
```typescript
/* eslint-disable pikacss/pika-module-augmentation */
const myPlugin = defineEnginePlugin({
	name: 'my-plugin',
	order: 'post',
	async configureEngine(engine) {
		engine.shortcuts.add('btn', { backgroundColor: '#3b82f6', color: 'white' })
	}
})
```

### Engine Methods

#### `engine.shortcuts.add(name: string, definition: StyleDefinition)`

Register a new shortcut.

```typescript
engine.shortcuts.add('btn-primary', {
	backgroundColor: '#3b82f6',
	color: 'white',
	padding: '0.75rem 1rem'
})

// Use it
pika({ btn_primary: true })
```

#### `engine.addPreflight(css: string)`

Add preflight CSS (global styles).

```typescript
engine.addPreflight(`
  * {
    margin: 0;
    padding: 0;
  }
`)
```

#### `engine.process(definition: StyleDefinition): Promise<ProcessedStyle>`

Process a style definition and generate CSS.

```typescript
const result = await engine.process({
	display: 'flex',
	gap: '1rem'
})

console.log(result.css)
console.log(result.className)
```

### Module Augmentation

#### Extending EngineConfig

Plugins declare new config options:

```typescript
declare module '@pikacss/core' {
	interface EngineConfig {
		myPluginOption?: string
	}
}
```

#### Extending Shortcuts

Plugins declare new shortcuts:

```typescript
declare module '@pikacss/core' {
	interface Shortcuts {
		myShortcut: MyShortcutType
	}
}
```

## Pseudo-Elements

### Using $ Prefix

```typescript
pika({
	color: 'blue',

	// Before pseudo-element
	$before: {
		content: '"→ "',
		color: 'gray'
	},

	// After pseudo-element
	$after: {
		content: '"←"',
		color: 'gray'
	},

	// First line
	$firstLine: {
		fontWeight: 'bold',
		fontSize: '1.2em'
	},

	// First letter
	$firstLetter: {
		fontSize: '2em',
		fontWeight: 'bold'
	},

	// Selection
	$selection: {
		backgroundColor: 'blue',
		color: 'white'
	},

	// Placeholder
	$placeholder: {
		color: '#ccc',
		fontStyle: 'italic'
	}
})
```

## Media Queries

### Responsive Design

```typescript
pika({
	// Mobile first
	'fontSize': '14px',

	// Tablet
	'@media (min-width: 640px)': {
		fontSize: '16px'
	},

	// Desktop
	'@media (min-width: 1024px)': {
		fontSize: '18px'
	}
})
```

### Feature Queries

```typescript
pika({
	'display': 'flex',

	// Fallback for older browsers
	'@supports not (display: grid)': {
		display: 'flex'
	}
})
```

### Prefers Queries

```typescript
pika({
	// Light mode
	'backgroundColor': 'white',
	'color': 'black',

	// Dark mode
	'@media (prefers-color-scheme: dark)': {
		backgroundColor: '#1a1a1a',
		color: 'white'
	},

	// Reduced motion
	'@media (prefers-reduced-motion: reduce)': {
		transition: 'none',
		animation: 'none'
	}
})
```

## Selectors

### Pseudo-Classes

```typescript
pika({
	'backgroundColor': 'white',

	// Hover state
	'&:hover': {
		backgroundColor: '#f5f5f5'
	},

	// Active state
	'&:active': {
		transform: 'scale(0.95)'
	},

	// Focus visible (keyboard)
	'&:focus-visible': {
		outline: '2px solid blue'
	},

	// Disabled state
	'&:disabled': {
		opacity: '0.5',
		cursor: 'not-allowed'
	}
})
```

### Child Selectors

```typescript
pika({
	'display': 'flex',
	'gap': '1rem',

	// All direct children
	'& > *': {
		flex: 1
	},

	// All but last child
	'& > *:not(:last-child)': {
		borderRight: '1px solid #ddd'
	}
})
```

## Shorthand Properties

### Supported Shorthands

```typescript
pika({
	// Padding/Margin (all sides, or top/bottom left/right, or top right bottom left)
	padding: '1rem',
	padding: '1rem 2rem',
	padding: '1rem 2rem 1rem 2rem',

	// Border
	border: '1px solid #ddd',
	borderWidth: '1px 2px',

	// Background
	background: 'url(...) no-repeat center',
	backgroundColor: '#fff',

	// Flex
	flex: '1 1 auto',

	// Grid
	gridTemplate: 'auto / 1fr 1fr'
})
```

## Value Types

### Supported Values

```typescript
// Strings
pika({ color: 'red' })
pika({ color: '#3b82f6' })
pika({ color: 'rgb(59, 130, 246)' })
pika({ color: 'hsl(217, 91%, 60%)' })

// Numbers (with units)
pika({ width: '100%' })
pika({ fontSize: '16px' })
pika({ lineHeight: '1.5' })
pika({ zIndex: '10' })

// CSS Functions
pika({ backgroundImage: 'url(/image.png)' })
pika({ color: 'var(--primary)' })
pika({ width: 'calc(100% - 20px)' })
pika({ boxShadow: 'inset 0 0 10px rgba(0,0,0,0.1)' })

// Booleans (for shortcuts)
pika({ h1: true })
pika({ btn: true })
```

## Type Safety

### TypeScript Support

```typescript
import type { StyleDefinition } from '@pikacss/core'

const myStyles: StyleDefinition = {
	display: 'flex',
	gap: '1rem'
	// TypeScript checks valid properties
}
```

### Generated Types

PikaCSS generates a `pika.gen.ts` file with:
- All generated class names as constants
- Type definitions for shortcuts
- Theme type definitions

```typescript
// Auto-generated
// Use with type safety
import { DISPLAY_FLEX, GAP_1REM } from './pika.gen'

export const DISPLAY_FLEX = 'display-flex'
export const GAP_1REM = 'gap-1rem'
```
