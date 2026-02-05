# @pikacss/nuxt-pikacss

PikaCSS module for Nuxt.

## Installation

```bash
pnpm add @pikacss/nuxt-pikacss
```

## Quick Start

**nuxt.config.ts**:
```typescript
export default defineNuxtConfig({
	modules: [
		'@pikacss/nuxt-pikacss'
	],
	pikacss: {
		// options
	}
})
```

## Features

- 🚀 Zero-config setup for Nuxt
- ⚡ Hot Module Replacement (HMR) support
- 🎯 Automatic TypeScript type generation
- 🔧 Full PikaCSS configuration support
- 📦 Built-in integration with Nuxt build pipeline

## Usage

### Basic Setup

The module works out of the box with zero configuration:

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
	modules: [
		'@pikacss/nuxt-pikacss'
	]
})
```

### Configuration

You can customize PikaCSS through the `pikacss` option:

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
	modules: [
		'@pikacss/nuxt-pikacss'
	],
	pikacss: {
		// File scanning configuration
		scan: {
			include: ['**/*.vue', '**/*.tsx', '**/*.jsx'], // Default patterns for Nuxt
			exclude: ['node_modules/**', 'dist/**'] // Default: node_modules and dist
		},

		// Engine configuration or config file path
		config: './pika.config.ts', // or inline EngineConfig object

		// Auto-create config file if missing
		autoCreateConfig: true, // Default: true

		// PikaCSS function name (globally available in Nuxt)
		fnName: 'pika', // Default: 'pika'

		// Output format for class names
		transformedFormat: 'string', // 'string' | 'array' | 'inline' (default: 'string')

		// TypeScript code generation
		tsCodegen: true, // true (auto path) | false | custom path string

		// CSS code generation (always enabled, cannot be false)
		cssCodegen: true // true (auto path) | custom path string
	}
})
```

### Automatic Features

The Nuxt module provides zero-config setup with automatic:
- **CSS Injection**: Virtual `pika.css` module is auto-imported - no manual import needed
- **Vue Scanning**: Automatically scans `.vue`, `.tsx`, `.jsx` files
- **Global Function**: `pika()` is globally available in all components

### Using in Components

The module automatically imports the virtual `pika.css` module and makes `pika()` globally available:

```vue
<script setup lang="ts">
// ✅ No imports needed - pika() is globally injected

// Style object
const styles = pika({
	display: 'flex',
	alignItems: 'center',
	gap: '1rem'
})

// Using shortcuts
const centered = pika('flex-center')

// Combining shortcuts with styles
const button = pika('btn', {
	backgroundColor: '#3b82f6',
	color: 'white'
})
</script>

<template>
	<div :class="styles">
		<button :class="button">
			Click me
		</button>
	</div>
</template>
```

## Options

The module accepts all options from `@pikacss/unplugin-pikacss` (except `currentPackageName` which is set automatically).

### PluginOptions Interface

```typescript
interface ModuleOptions {
	scan?: {
		include?: string | string[] // Default: ['**/*.vue', '**/*.tsx', '**/*.jsx']
		exclude?: string | string[] // Default: ['node_modules/**', 'dist/**']
	}
	config?: EngineConfig | string // Config object or path (default: auto-detect)
	autoCreateConfig?: boolean // Default: true
	fnName?: string // Default: 'pika'
	transformedFormat?: 'string' | 'array' | 'inline' // Default: 'string'
	tsCodegen?: boolean | string // Default: true (auto-generate pika.gen.ts)
	cssCodegen?: true | string // Default: true (auto-generate pika.gen.css)
}
```

### Option Details

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `scan.include` | `string \| string[]` | `['**/*.vue', '**/*.tsx', '**/*.jsx']` | File patterns to scan for `pika()` calls |
| `scan.exclude` | `string \| string[]` | `['node_modules/**', 'dist/**']` | File patterns to exclude from scanning |
| `config` | `EngineConfig \| string` | Auto-detect | Engine config object or path to config file |
| `autoCreateConfig` | `boolean` | `true` | Auto-create config file if missing |
| `fnName` | `string` | `'pika'` | Function name to detect in code |
| `transformedFormat` | `'string' \| 'array' \| 'inline'` | `'string'` | Output format for generated class names |
| `tsCodegen` | `boolean \| string` | `true` | Generate TypeScript types (true = auto path, false = disabled, string = custom path) |
| `cssCodegen` | `true \| string` | `true` | Generate CSS output (true = auto path, string = custom path) |

See the [@pikacss/unplugin-pikacss documentation](https://github.com/pikacss/pikacss/tree/main/packages/unplugin) for complete details.

## PikaCSS Configuration

Create a `pika.config.ts` file in your project root:

```typescript
import { defineEngineConfig } from '@pikacss/core'

export default defineEngineConfig({
	// Your PikaCSS configuration
})
```

## Documentation

For complete documentation, visit: [PikaCSS Documentation](https://pikacss.github.io/pikacss/)

## License

MIT © DevilTea
