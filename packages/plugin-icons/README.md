<!-- eslint-disable -->
# @pikacss/plugin-icons

Use thousands of icons from popular icon sets in PikaCSS with full TypeScript autocomplete.

## Installation

```bash
pnpm add @pikacss/plugin-icons
```

## Quick Start

**pika.config.ts**:
```typescript
/// <reference path="./src/pika.gen.ts" />

import { defineEngineConfig } from '@pikacss/core'
import { icons } from '@pikacss/plugin-icons'

export default defineEngineConfig({
	plugins: [
		icons() // ⚠️ Must be a function call!
	],
	icons: {
		prefix: 'i-',
		scale: 1,
		mode: 'auto',
	}
})
```

**Module Augmentation** (TypeScript autocomplete support):
```typescript
declare module '@pikacss/core' {
	interface EngineConfig {
		icons?: {
			prefix?: string | string[] // Default: 'i-'
			scale?: number // Default: 1
			mode?: 'auto' | 'mask' | 'bg' // Default: 'auto'
			cdn?: string // CDN base URL
			collections?: Record<string, any> // Custom icon collections
			autoInstall?: boolean // Default: false
			unit?: string // Size unit for icons
			extraProperties?: Record<string, string> // Extra CSS props
			processor?: (styleItem: StyleItem, meta: IconMeta) => void
			autocomplete?: string[] // Icons for autocomplete
		}
	}
}

export default defineEngineConfig({
	plugins: [icons()],
	icons: { // ✅ Full autocomplete for all options
		prefix: 'icon-',
		scale: 1.2,
		mode: 'mask'
	}
})
```

**Your code** (3 usage methods):
```typescript
// Method 1: Direct shortcut string
const iconClass = pika('i-mdi:home')

// Method 2: Shortcut with additional styles (recommended)
const styledIcon = pika('i-mdi:home', {
	fontSize: '24px',
	color: 'blue'
})

// Method 3: Using __shortcut property in style object
const iconWithStyles = pika({
	__shortcut: 'i-mdi:home',
	fontSize: '24px'
})
```

## Features

- 🎨 **100,000+ icons** from popular icon sets via Iconify
- 🔍 **Auto-installs** icon collections on demand (optional)
- 📦 **Tree-shakeable** - only icons you use are included
- 🎯 **Simple shortcut syntax** with customizable prefix
- 🔧 **Customizable** icon collections and CDN
- ⚡ **Built on Iconify** - reliable and fast
- 🎭 **3 rendering modes**: auto, mask (currentColor), bg (background)
- 💡 **Full TypeScript autocomplete** via module augmentation

## Usage

### Three Usage Methods

PikaCSS provides three ways to use icons:

**Method 1: Direct shortcut string** (simplest)
```typescript
const iconClass = pika('i-mdi:home')
```

**Method 2: Shortcut with additional styles** (recommended)
```typescript
const styledIcon = pika('i-mdi:home', {
	fontSize: '24px',
	color: 'blue'
})
```

**Method 3: Using `__shortcut` property** (for complex objects)
```typescript
const iconWithStyles = pika({
	__shortcut: 'i-mdi:home',
	fontSize: '24px',
	display: 'inline-block'
})
```

All three methods produce the same underlying shortcut registration - choose based on your coding style.

### Supported Icon Collections

All Iconify icon collections are supported (100,000+ icons). Popular collections include:

- **Material Design Icons**: `i-mdi:*` (5,000+ icons)
- **Heroicons**: `i-heroicons:*` (300+ icons)
- **Bootstrap Icons**: `i-bi:*` (1,800+ icons)
- **Font Awesome**: `i-fa:*`, `i-fa-solid:*`, `i-fa-brands:*` (2,000+ icons)
- **Tabler Icons**: `i-tabler:*` (4,000+ icons)
- **Carbon**: `i-carbon:*` (2,000+ icons)
- **Phosphor**: `i-ph:*` (6,000+ icons)
- **Lucide**: `i-lucide:*` (1,000+ icons)

Browse all collections at: [Iconify Icon Sets](https://icon-sets.iconify.design/)

### Icon Syntax

Icons follow the pattern: **`{prefix}{collection}:{icon-name}`**

Default prefix is `i-`, so the full syntax is: `i-{collection}:{name}`

```typescript
pika('i-mdi:home') // Material Design home icon
pika('i-heroicons:user') // Heroicons user icon
pika('i-carbon:cloud-upload') // Carbon cloud upload icon
```

### Icon Rendering Modes

Append `?mask`, `?bg`, or `?auto` to specify the rendering mode:

```typescript
pika('i-mdi:home?mask') // Mask mode (uses currentColor)
pika('i-mdi:home?bg') // Background mode
pika('i-mdi:home?auto') // Auto-detect (default)
```

**Mode descriptions:**
- **`auto`** (default): Automatically selects `mask` or `bg` based on whether the icon's SVG contains `currentColor`
- **`mask`**: Icon uses CSS mask with `currentColor`, inheriting text color (best for monochrome icons)
- **`bg`**: Icon uses `background-image` (best for multi-colored icons)

**Implementation detail:** The mode detection happens at build time by checking if the icon's SVG source includes the string `"currentColor"`. If found, mode defaults to `mask`; otherwise, it defaults to `bg`.

### Usage Examples

```typescript
// Simple icon
const homeIcon = pika('i-mdi:home')

// Icon with size and color
const largeIcon = pika('i-mdi:account', {
	fontSize: '48px',
	color: '#3b82f6'
})

// Icon with hover effect
const hoverIcon = pika('i-mdi:heart', {
	'fontSize': '24px',
	'color': 'red',
	'cursor': 'pointer',
	'$:hover': {
		transform: 'scale(1.2)'
	}
})

// Combining multiple shortcuts
const buttonWithIcon = pika('btn', 'i-mdi:send', {
	display: 'inline-flex',
	alignItems: 'center',
	gap: '0.5rem'
})
```

### Customizing Icon Size and Color

Icons inherit text properties by default:

```typescript
// Method 2: Shortcut with styles
pika('i-mdi:home', {
	fontSize: '32px', // Controls icon size
	color: '#3b82f6' // Works with mask mode
})

// Method 3: __shortcut property
pika({
	__shortcut: 'i-mdi:home',
	fontSize: '32px',
	color: '#3b82f6'
})
```

**Note:** Color inheritance only works in `mask` mode. In `bg` mode, the icon retains its original colors.

## Configuration

The icons plugin is configured using the standard PikaCSS plugin pattern with full TypeScript autocomplete:

```typescript
/// <reference path="./src/pika.gen.ts" />

import { defineEngineConfig } from '@pikacss/core'
import { icons } from '@pikacss/plugin-icons'

export default defineEngineConfig({
	// 1. Register plugin in plugins array
	plugins: [
		icons() // ⚠️ Must be a function call: icons() not icons
	],

	// 2. Configure at root level with full autocomplete
	icons: {
		prefix: 'i-', // Shortcut prefix
		scale: 1, // Icon scale multiplier
		mode: 'auto', // 'auto' | 'mask' | 'bg'
		cdn: 'https://esm.sh/', // CDN for icon collections
		autoInstall: false, // Auto-install icon packages
		// ... other options
	}
})
```

::: warning Common Mistake
Always call the plugin function: `plugins: [icons()]` not `plugins: [icons]`
:::

### All Configuration Options

```typescript
interface IconsConfig {
	/**
	 * Icon shortcut prefix.
	 * Can be a single string or array of prefixes.
	 * @default 'i-'
	 */
	prefix?: string | string[]

	/**
	 * Scale factor for icons.
	 * Multiplies icon dimensions.
	 * @default 1
	 */
	scale?: number

	/**
	 * Icon rendering mode.
	 * - 'auto': Auto-detect based on currentColor in SVG
	 * - 'mask': Use CSS mask with currentColor (inherits text color)
	 * - 'bg': Use background-image (preserves original colors)
	 * @default 'auto'
	 */
	mode?: 'auto' | 'mask' | 'bg'

	/**
	 * CDN base URL for loading icon collections.
	 * Icons are fetched from this CDN when not found locally.
	 * @example 'https://esm.sh/'
	 */
	cdn?: string

	/**
	 * Custom icon collections.
	 * Define your own icons as SVG strings.
	 * @example
	 * {
	 *   'my-icons': {
	 *     'logo': '<svg>...</svg>',
	 *     'custom': '<svg>...</svg>'
	 *   }
	 * }
	 */
	collections?: Record<string, any>

	/**
	 * Auto-install icon collections from npm.
	 * When enabled, missing icon packages are automatically installed.
	 * @default false
	 */
	autoInstall?: boolean

	/**
	 * Unit for icon size (when specified).
	 * Applied to width and height when using scale with unit.
	 * @example 'em', 'rem', 'px'
	 */
	unit?: string

	/**
	 * Extra CSS properties to apply to all icons.
	 * Merged into every generated icon style.
	 * @example { verticalAlign: 'middle' }
	 */
	extraProperties?: Record<string, string>

	/**
	 * Custom processor for icon styles before rendering.
	 * Allows modifying the generated CSS object.
	 */
	processor?: (styleItem: StyleItem, meta: IconMeta) => void

	/**
	 * Icons for auto-completion in your editor.
	 * List of icon shortcuts to provide autocomplete suggestions.
	 * @example ['mdi:home', 'heroicons:user']
	 */
	autocomplete?: string[]

	/**
	 * Iconify collection names for validation.
	 */
	iconifyCollectionsNames?: string[]

	/**
	 * Path for resolving icon collection node modules.
	 */
	collectionsNodeResolvePath?: string

	/**
	 * Customizations for icon SVG processing.
	 */
	customizations?: IconifyLoaderCustomizations
}
```

### Configuration Examples

#### Custom Icon Prefix

Change the shortcut prefix to avoid conflicts:

```typescript
export default defineEngineConfig({
	plugins: [icons()],
	icons: {
		prefix: 'icon-' // Now use: icon-mdi:home
	}
})

// Usage with custom prefix
const iconClass = pika('icon-mdi:home')
```

#### Custom Icon Scale

Adjust the default scale of all icons:

```typescript
export default defineEngineConfig({
	plugins: [icons()],
	icons: {
		scale: 1.2 // Make all icons 20% larger
	}
})
```

#### Force Specific Rendering Mode

Override auto-detection to always use mask or bg mode:

```typescript
export default defineEngineConfig({
	plugins: [icons()],
	icons: {
		mode: 'mask' // All icons inherit text color
	}
})
```

#### Multiple Prefixes

Support multiple shortcut prefixes:

```typescript
export default defineEngineConfig({
	plugins: [icons()],
	icons: {
		prefix: ['i-', 'icon-'] // Both work
	}
})

// Both are valid
const icon1 = pika('i-mdi:home')
const icon2 = pika('icon-mdi:home')
```

#### Custom Icon Collections

Define your own icon collections:

```typescript
export default defineEngineConfig({
	plugins: [icons()],
	icons: {
		collections: {
			'my-icons': {
				logo: '<svg viewBox="0 0 24 24"><path d="..." /></svg>',
				custom: '<svg>...</svg>'
			}
		}
	}
})

// Usage
const myIcon = pika('i-my-icons:logo')
```

## How It Works

The plugin registers icon shortcuts using the PikaCSS shortcut system:

1. **Pattern Detection**: Icons matching `{prefix}{collection}:{name}` pattern (e.g., `i-mdi:home`) are detected in your `pika()` calls
2. **SVG Loading**: Icon SVG is loaded from Iconify (via CDN or local node_modules)
3. **CSS Variable Generation**: SVG is encoded and stored as a CSS custom property (e.g., `--pika-svg-icon-mdi-home`)
4. **Mode Selection**: Based on mode setting and SVG content:
   - **auto**: Checks if SVG contains `currentColor` → mask mode if yes, bg mode if no
   - **mask**: Uses CSS mask properties with `background-color: currentColor` (icon inherits text color)
   - **bg**: Uses `background-image` (icon retains original colors)
5. **Style Application**: CSS properties are applied to create the final icon appearance

**Example flow:**
```typescript
pika('i-mdi:home', { fontSize: '24px', color: 'blue' })
```
1. Plugin detects `i-mdi:home` shortcut
2. Loads Material Design Icons "home" icon from Iconify
3. Encodes SVG: `url("data:image/svg+xml;utf8,...")`
4. Stores in CSS variable: `--pika-svg-icon-mdi-home`
5. Applies mask mode (if icon uses currentColor):
   ```css
   .generated-class {
     --svg-icon: var(--pika-svg-icon-mdi-home);
     -webkit-mask: var(--svg-icon) no-repeat;
     mask: var(--svg-icon) no-repeat;
     mask-size: 100% 100%;
     background-color: currentColor;
     font-size: 24px;
     color: blue;
   }
   ```

This approach ensures:
- **Efficient CSS**: Icons are stored once as CSS variables and reused
- **Color Inheritance**: Mask mode allows icons to inherit text color dynamically
- **Performance**: Only icons you use are included in the bundle

## Performance

- **On-demand loading**: Only downloads icon sets you actually use
- **Tree-shaking**: Only icons you reference are included in the build
- **Cached**: Downloaded icon collections are cached locally
- **Optimized SVG**: Icons are optimized for minimal file size

## Documentation

For complete documentation, visit: [PikaCSS Documentation](https://pikacss.github.io/pikacss/)

## License

MIT © DevilTea
