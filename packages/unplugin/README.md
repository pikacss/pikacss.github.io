<!-- eslint-disable -->
# @pikacss/unplugin-pikacss

Universal plugin for PikaCSS that works with multiple bundlers.

## Installation

```bash
pnpm add @pikacss/unplugin-pikacss
```

## Usage

### Vite

For full Vite support with hot reloading and build optimizations, use the Vite-specific export:

```ts
// vite.config.ts
import PikaCSSPlugin from '@pikacss/unplugin-pikacss/vite'

export default {
	plugins: [
		PikaCSSPlugin({
			// options
		}),
	],
}
```

### Rollup

```ts
// rollup.config.js
import PikaCSSPlugin from '@pikacss/unplugin-pikacss/rollup'

export default {
	plugins: [
		PikaCSSPlugin({
			// options
		}),
	],
}
```

### Webpack

```ts
// webpack.config.js
import PikaCSSPlugin from '@pikacss/unplugin-pikacss/webpack'

export default {
	plugins: [
		PikaCSSPlugin({
			// options
		}),
	],
}
```

### esbuild

```ts
// esbuild.config.js
import PikaCSSPlugin from '@pikacss/unplugin-pikacss/esbuild'
import esbuild from 'esbuild'

esbuild.build({
	plugins: [
		PikaCSSPlugin({
			// options
		}),
	],
})
```

### Rspack

```ts
// rspack.config.js
import PikaCSSPlugin from '@pikacss/unplugin-pikacss/rspack'

export default {
	plugins: [
		PikaCSSPlugin({
			// options
		}),
	],
}
```

### Farm

```ts
// farm.config.ts
import PikaCSSPlugin from '@pikacss/unplugin-pikacss/farm'

export default {
	plugins: [
		PikaCSSPlugin({
			// options
		}),
	],
}
```

### Rolldown

```ts
// rolldown.config.js
import PikaCSSPlugin from '@pikacss/unplugin-pikacss/rolldown'

export default {
	plugins: [
		PikaCSSPlugin({
			// options
		}),
	],
}
```

## Plugin Options

The plugin accepts a `PluginOptions` object with the following properties:

```ts
interface PluginOptions {
	/**
	 * File patterns to scan for pika() function calls.
	 * @default { include: ['**\/*.{js,ts,jsx,tsx,vue}'], exclude: ['node_modules/**', 'dist/**'] }
	 */
	scan?: {
		include?: string | string[]
		exclude?: string | string[]
	}

	/**
	 * PikaCSS engine configuration object or path to config file.
	 * Pass an EngineConfig object for inline configuration or a string path.
	 * @default undefined
	 */
	config?: EngineConfig | string

	/**
	 * Automatically create config file when needed.
	 * @default true
	 */
	autoCreateConfig?: boolean

	/**
	 * Name of the style function to detect in source code.
	 * @default 'pika'
	 */
	fnName?: string

	/**
	 * Format of generated class names after transformation.
	 * - 'string': Space-separated class names
	 * - 'array': Array of class names
	 * - 'inline': Object format for direct style binding
	 * @default 'string'
	 */
	transformedFormat?: 'string' | 'array' | 'inline'

	/**
	 * TypeScript type definitions generation.
	 * - true: Generate as 'pika.gen.ts'
	 * - string: Generate at specified path
	 * - false: Disable generation
	 * @default true
	 */
	tsCodegen?: boolean | string

	/**
	 * CSS output file generation.
	 * - true: Generate as 'pika.gen.css'
	 * - string: Generate at specified path
	 * Note: Cannot be disabled (always generates CSS)
	 * @default true
	 */
	cssCodegen?: true | string
}
```

> **Note:** This plugin re-exports all APIs from `@pikacss/integration` package. For advanced customization (e.g., creating custom bundler plugins), refer to the [@pikacss/integration documentation](../integration/README.md).

## Setup Steps

### 1. Install and Configure Plugin

Add the plugin to your build tool configuration (see examples above).

### 2. Create Config File

Create `pika.config.ts` in your project root:

```ts
import { defineEngineConfig } from '@pikacss/core'

export default defineEngineConfig({
	// Your PikaCSS configuration
	plugins: []
})
```

### 3. Import Virtual CSS Module

In your application entry file:

```ts
import 'pika.css'
```

### 4. Use in Your Code

```ts
// Direct style object
const classes = pika({
	display: 'flex',
	alignItems: 'center',
	gap: '1rem'
})

// Using shortcuts
const centered = pika('flex-center')

// Combining shortcuts with styles
const styled = pika('flex-center', { color: 'blue' })

// Multiple shortcuts
const multi = pika('btn', 'shadow', { margin: '1rem' })
```

## Migration from @pikacss/vite-plugin-pikacss

If you were using `@pikacss/vite-plugin-pikacss`, you can migrate to `@pikacss/unplugin-pikacss/vite`:

```diff
- import PikaCSSPlugin from '@pikacss/vite-plugin-pikacss'
+ import PikaCSSPlugin from '@pikacss/unplugin-pikacss/vite'
```

The API is fully compatible.

## API Reference

### Plugin Factory

Each bundler-specific export provides a default plugin factory function:

```ts
// All bundler exports follow this pattern
import PikaCSSPlugin from '@pikacss/unplugin-pikacss/{bundler}'

// Returns bundler-specific plugin instance
const plugin = PikaCSSPlugin(options)
```

**Supported bundler exports:**
- `@pikacss/unplugin-pikacss/vite` - Vite plugin
- `@pikacss/unplugin-pikacss/rollup` - Rollup plugin
- `@pikacss/unplugin-pikacss/webpack` - Webpack plugin
- `@pikacss/unplugin-pikacss/rspack` - Rspack plugin
- `@pikacss/unplugin-pikacss/esbuild` - esbuild plugin
- `@pikacss/unplugin-pikacss/farm` - Farm plugin
- `@pikacss/unplugin-pikacss/rolldown` - Rolldown plugin

### Type Exports

All bundler exports re-export types from `@pikacss/integration`:

```ts
import type { PluginOptions, ResolvedPluginOptions } from '@pikacss/unplugin-pikacss/vite'
```

### Integration Layer Re-exports

This package re-exports the entire `@pikacss/integration` API for advanced use cases:

```ts
import { createCtx, IntegrationContext } from '@pikacss/unplugin-pikacss'
```

For details on these APIs, see the [@pikacss/integration documentation](../integration/README.md).

### Virtual Module

The plugin provides a virtual CSS module that can be imported in your application:

```ts
import 'pika.css'
```

This virtual module resolves to the generated CSS file (`pika.gen.css` by default).

## How It Works

1. **Scan Phase**: Plugin scans source files matching `scan.include` patterns
2. **Detection**: Identifies `pika()` function calls (or custom `fnName`)
3. **Build-time Evaluation**: Evaluates style arguments at build time using `new Function()`
4. **Transformation**: Replaces function calls with generated class names
5. **CSS Generation**: Outputs atomic styles to `pika.gen.css`
6. **Type Generation**: Outputs TypeScript definitions to `pika.gen.ts`

The plugin integrates with bundler's hot module reload (HMR) to update styles during development.
