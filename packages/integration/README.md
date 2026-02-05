# @pikacss/integration

Low-level integration API for building PikaCSS bundler and framework plugins.

## ⚠️ Internal Package

**This is an internal package** used by official PikaCSS integration plugins.

**Most users should use these instead:**
- **[`@pikacss/unplugin-pikacss`](../unplugin/)** - Universal plugin for multiple bundlers
- **[`@pikacss/nuxt-pikacss`](../nuxt/)** - Nuxt module

## Installation

Only needed for plugin development:

```bash
pnpm add @pikacss/integration
```

## Overview

This package provides the bridge between the @pikacss/core style engine and build tools. It handles:

- 🔍 **Source code scanning** - Find `pika()` function calls in your project
- 🔄 **Build-time transformation** - Evaluate style arguments and replace with class names
- ⚙️ **Config loading** - Resolve and load `pika.config.js/ts` files
- 📝 **Code generation** - Generate `pika.gen.css` and `pika.gen.ts` files
- 🎯 **Engine integration** - Connect source code to the core style engine

## API Reference

### `createCtx(options)`

Creates an integration context for managing PikaCSS transformations.

```typescript
import { createCtx } from '@pikacss/integration'

const ctx = createCtx({
	cwd: process.cwd(),
	currentPackageName: '@my-org/my-plugin',
	scan: {
		include: ['src/**/*.{ts,tsx,js,jsx,vue}'],
		exclude: ['node_modules/**', 'dist/**']
	},
	configOrPath: './pika.config.ts',
	fnName: 'pika',
	transformedFormat: 'string',
	tsCodegen: 'pika.gen.ts',
	cssCodegen: 'pika.gen.css',
	autoCreateConfig: true
})

await ctx.setup()
```

**Parameters:**

- `options: IntegrationContextOptions` - Configuration object

**Returns:** `IntegrationContext` - Context object with transformation methods

### `IntegrationContextOptions`

Configuration options for creating an integration context.

```typescript
interface IntegrationContextOptions {
	// Working directory (usually process.cwd())
	cwd: string

	// Package name using this integration (for config generation)
	currentPackageName: string

	// File scanning patterns
	scan: {
		include: string[] // Glob patterns to include
		exclude: string[] // Glob patterns to exclude
	}

	// Engine config (inline object or path to config file)
	configOrPath: EngineConfig | string | Nullish

	// Function name to detect (default: 'pika')
	fnName: string

	// Output format for transformed code
	transformedFormat: 'string' | 'array' | 'inline'

	// TypeScript codegen file path (false to disable)
	tsCodegen: false | string

	// CSS codegen file path
	cssCodegen: string

	// Auto-create config file if not found
	autoCreateConfig: boolean
}
```

**Field descriptions:**

- **`cwd`**: Root directory for file operations
- **`currentPackageName`**: Identifier for the consuming plugin (used in generated config files)
- **`scan.include`**: Glob patterns for files to transform (e.g., `['src/**/*.tsx']`)
- **`scan.exclude`**: Glob patterns to skip (e.g., `['node_modules/**']`)
- **`configOrPath`**: Either an inline `EngineConfig` object or a path to config file
- **`fnName`**: Name of style function to detect (supports variants like `pika.str`, `pika.arr`, `pika.inl`)
- **`transformedFormat`**: Default output format - `'string'` for space-separated classes, `'array'` for array of classes, `'inline'` for bare string
- **`tsCodegen`**: Path for generated TypeScript definitions (set to `false` to disable)
- **`cssCodegen`**: Path for generated CSS file
- **`autoCreateConfig`**: Whether to generate a default config file if none exists

### `IntegrationContext`

The context object returned by `createCtx()` with methods for transformation and code generation.

```typescript
interface IntegrationContext {
	// Configuration properties
	cwd: string
	currentPackageName: string
	fnName: string
	transformedFormat: 'string' | 'array' | 'inline'
	cssCodegenFilepath: string
	tsCodegenFilepath: string | Nullish

	// Environment detection
	hasVue: boolean // Whether Vue is installed

	// Loaded config
	resolvedConfig: EngineConfig | Nullish
	resolvedConfigPath: string | Nullish
	resolvedConfigContent: string | Nullish

	// Config loading
	loadConfig: () => Promise<
		| { config: EngineConfig, file: null }
		| { config: null, file: null }
		| { config: EngineConfig, file: string }
	>

	// Usage tracking
	usages: Map<string, UsageRecord[]>

	// Event hooks
	hooks: {
		styleUpdated: EventHook<void>
		tsCodegenUpdated: EventHook<void>
	}

	// Style engine
	engine: Engine

	// Transform filter
	transformFilter: {
		include: string[]
		exclude: string[]
	}

	// Core methods
	transform: (code: string, id: string) => Promise<{ code: string, map: SourceMap } | Nullish>
	getCssCodegenContent: () => Promise<string | Nullish>
	getTsCodegenContent: () => Promise<string | Nullish>
	writeCssCodegenFile: () => Promise<void>
	writeTsCodegenFile: () => Promise<void>
	fullyCssCodegen: () => Promise<void>

	// Lifecycle
	setupPromise: Promise<void> | null
	setup: () => Promise<void>
}
```

**Key methods:**

- **`setup()`**: Initialize the context (load config, create engine). Must be called before using other methods.
- **`transform(code, id)`**: Transform source code by replacing `pika()` calls with class names. Returns transformed code and source map.
- **`getCssCodegenContent()`**: Generate CSS content from all collected style usages.
- **`getTsCodegenContent()`**: Generate TypeScript definitions for the global `pika` function.
- **`writeCssCodegenFile()`**: Write generated CSS to `cssCodegenFilepath`.
- **`writeTsCodegenFile()`**: Write generated TypeScript definitions to `tsCodegenFilepath`.
- **`fullyCssCodegen()`**: Scan all files matching `scan` patterns, collect usages, and write CSS file.

**Event hooks:**

- **`hooks.styleUpdated`**: Triggered when atomic styles or preflights change
- **`hooks.tsCodegenUpdated`**: Triggered when TypeScript autocomplete config changes

### `UsageRecord`

Tracks a single `pika()` function call and its generated class names.

```typescript
interface UsageRecord {
	atomicStyleIds: string[] // Generated class names
	params: Parameters<Engine['use']> // Original style arguments
}
```

## Usage Example

Complete example for a custom bundler plugin:

```typescript
import { createCtx } from '@pikacss/integration'

export function myPikaCSSPlugin(options = {}) {
	let ctx

	return {
		name: 'my-pikacss-plugin',

		async buildStart() {
			// Create context
			ctx = createCtx({
				cwd: process.cwd(),
				currentPackageName: '@my-org/my-plugin',
				scan: {
					include: options.include || ['src/**/*.{ts,tsx}'],
					exclude: options.exclude || ['node_modules/**']
				},
				configOrPath: options.config,
				fnName: options.fnName || 'pika',
				transformedFormat: options.format || 'string',
				tsCodegen: options.tsCodegen !== false ? 'pika.gen.ts' : false,
				cssCodegen: options.cssCodegen || 'pika.gen.css',
				autoCreateConfig: options.autoCreateConfig !== false
			})

			// Initialize context
			await ctx.setup()

			// Listen for style updates
			ctx.hooks.styleUpdated.on(async () => {
				await ctx.writeCssCodegenFile()
			})

			ctx.hooks.tsCodegenUpdated.on(async () => {
				await ctx.writeTsCodegenFile()
			})
		},

		// Resolve virtual module
		resolveId(id) {
			if (id === 'pika.css') {
				return id // Mark as virtual module
			}
		},

		// Load virtual module
		async load(id) {
			if (id === 'pika.css') {
				const content = await ctx.getCssCodegenContent()
				return content
			}
		},

		// Transform source files
		async transform(code, id) {
			// Check if file should be transformed
			const shouldTransform = ctx.transformFilter.include.some(pattern =>
				micromatch.isMatch(id, pattern)
			) && !ctx.transformFilter.exclude.some(pattern =>
				micromatch.isMatch(id, pattern)
			)

			if (!shouldTransform)
				return

			// Transform code
			const result = await ctx.transform(code, id)
			if (result) {
				return {
					code: result.code,
					map: result.map
				}
			}
		}
	}
}
```

## Core Re-exports

This package re-exports all exports from `@pikacss/core`:

```typescript
export * from '@pikacss/core'
```

This includes:
- `createEngine`, `defineEngineConfig`, `defineEnginePlugin`
- `Engine`, `EngineConfig`, `EnginePlugin` types
- All core style utilities and types

See [@pikacss/core documentation](../core/README.md) for details.

## For Plugin Authors

If you're building a custom integration:

1. **Study existing implementations:**
   - [`@pikacss/unplugin-pikacss`](../unplugin/src/index.ts) - Universal plugin using unplugin
   - [`@pikacss/nuxt-pikacss`](../nuxt/src/index.ts) - Nuxt module integration

2. **Key integration points:**
   - Call `ctx.setup()` during plugin initialization
   - Use `ctx.transform()` in your bundler's transform hook
   - Resolve `'pika.css'` as virtual module returning `await ctx.getCssCodegenContent()`
   - Listen to `ctx.hooks.styleUpdated` for HMR support

3. **Testing:**
   - Create fixture projects with valid/invalid PikaCSS usage
   - Test build-time transformation and error reporting
   - Verify source maps are preserved

## Documentation

For complete documentation, visit: [PikaCSS Documentation](https://pikacss.github.io/pikacss/)

## License

MIT © DevilTea
