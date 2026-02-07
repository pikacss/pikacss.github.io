---
title: Nuxt Integration
description: How to use PikaCSS with Nuxt
outline: deep
---

# Nuxt Integration

PikaCSS provides a dedicated Nuxt module for seamless integration.

## Installation

::: code-group

```bash [pnpm]
pnpm add -D @pikacss/nuxt-pikacss
```

```bash [yarn]
yarn add -D @pikacss/nuxt-pikacss
```

```bash [npm]
npm install -D @pikacss/nuxt-pikacss
```

:::

## Setup

### 1. Configure Nuxt

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
	modules: [
		'@pikacss/nuxt-pikacss'
	],
	pikacss: {
		// options
	}
})
```

### 2. Create Config File (Optional)

PikaCSS works with zero configuration. To customize the engine, create `pika.config.ts`:

```typescript
// pika.config.ts
import { defineEngineConfig } from '@pikacss/core'

export default defineEngineConfig({
	// Your PikaCSS engine configuration
	// See https://pikacss.github.io/pikacss/advanced/api-reference.html#engineconfig
})
```

## Module Options

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
	modules: ['@pikacss/nuxt-pikacss'],
	pikacss: {
		// File scanning configuration
		scan: {
			include: ['**/*.vue', '**/*.tsx', '**/*.jsx'], // Default for Nuxt
			exclude: ['node_modules/**', 'dist/**'] // Default exclusions
		},

		// Config file path or inline config object
		config: './pika.config.ts', // Default: auto-detect

		// Auto-create config if missing
		autoCreateConfig: true, // Default: true

		// Function name to detect
		fnName: 'pika', // Default: 'pika'

		// Default output format
		transformedFormat: 'string', // 'string' | 'array' | 'inline'

		// Generate pika.gen.ts (false to disable, string for custom path)
		tsCodegen: true, // Default: true

		// Generate pika.gen.css (string for custom path)
		cssCodegen: true // Default: true (cannot be false)
	}
})
```

::: tip Zero-Config Defaults
The Nuxt module is pre-configured for Vue files. Simply adding the module to `nuxt.config.ts` is enough to get started.
:::

## Usage

The Nuxt module provides zero-config setup. The `pika()` function is globally available (no import needed) and `pika.css` is automatically injected.

```vue
<!-- app.vue -->
<script setup lang="ts">
// [Valid] No imports needed - pika() is globally available
// [Valid] No need to import 'pika.css' - auto-injected by Nuxt module
</script>

<template>
	<div
		:class="pika({
			display: 'flex',
			flexDirection: 'column',
			minHeight: '100vh',
		})"
	>
		<header
			:class="pika({
				padding: '1rem',
				backgroundColor: 'var(--color-primary)',
			})"
		>
			<h1 :class="pika({ color: 'white' })">
				My Nuxt App
			</h1>
		</header>

		<main
			:class="pika({
				flex: '1',
				padding: '2rem',
			})"
		>
			<NuxtPage />
		</main>
	</div>
</template>
```

## With Composables

Create a composable for shared styles:

```typescript
// composables/useStyles.ts
export function useStyles() {
	return {
		container: pika({
			width: '100%',
			maxWidth: '1200px',
			margin: '0 auto',
			padding: '0 1rem'
		}),
		button: pika({
			'padding': '0.5rem 1rem',
			'borderRadius': '0.25rem',
			'backgroundColor': 'var(--color-primary)',
			'color': 'white',
			'cursor': 'pointer',
			'$:hover': {
				backgroundColor: 'var(--color-primary-dark)'
			}
		})
	}
}
```

```vue
<!-- pages/index.vue -->
<script setup lang="ts">
const styles = useStyles()
</script>

<template>
	<div :class="styles.container">
		<button :class="styles.button">
			Click me
		</button>
	</div>
</template>
```

## TypeScript Support

TypeScript types are automatically generated and included by the Nuxt module. The generated `pika.gen.ts` file provides IDE autocomplete.

If you need to manually reference the types, add to `tsconfig.json`:

```json
{
	"extends": "./.nuxt/tsconfig.json",
	"include": ["pika.gen.ts"]
}
```

::: tip
In most cases, the Nuxt module handles TypeScript integration automatically - no manual configuration needed.
:::

## Auto-Generated Files

PikaCSS generates the following files:

| File | Purpose |
|------|---------|
| `pika.gen.ts` | TypeScript types for autocomplete |
| `pika.gen.css` | Generated CSS output |

Add these to `.gitignore`:

```
pika.gen.ts
pika.gen.css
```

<!-- Removed legacy online example link -->
