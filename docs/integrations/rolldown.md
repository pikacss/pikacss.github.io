---
title: Rolldown Integration
description: How to use PikaCSS with Rolldown
outline: deep
---

# Rolldown Integration

PikaCSS works seamlessly with Rolldown through the unplugin package.

## Installation

::: code-group

```bash [pnpm]
pnpm add -D @pikacss/unplugin-pikacss
```

```bash [yarn]
yarn add -D @pikacss/unplugin-pikacss
```

```bash [npm]
npm install -D @pikacss/unplugin-pikacss
```

:::

## Setup

### 1. Configure Rolldown

```javascript
// rolldown.config.mjs
import pikacss from '@pikacss/unplugin-pikacss/rolldown'
import { defineConfig } from 'rolldown'

export default defineConfig({
	input: 'src/index.tsx',
	plugins: [
		pikacss({
			// options
		})
	]
})
```

### 2. Create Config File

Create `pika.config.ts` in your project root:

```typescript
// pika.config.ts
/// <reference path="./src/pika.gen.ts" />

import { defineEngineConfig } from '@pikacss/unplugin-pikacss'

export default defineEngineConfig({
	// Your configuration
})
```

### 3. Import Virtual Module

In your main entry file (e.g., `index.tsx`):

```typescript
import 'pika.css'
```

## Plugin Options

```javascript
pikacss({
	// File scanning configuration
	scan: {
		include: ['**/*.{js,ts,jsx,tsx}'],
		exclude: ['node_modules/**']
	},

	// Config file path
	config: './pika.config.ts',

	// Auto-create config if missing
	autoCreateConfig: true,

	// Function name to detect (default: 'pika')
	fnName: 'pika',

	// Default output format: 'string' | 'array' | 'inline'
	transformedFormat: 'string',

	// Generate pika.gen.ts (default: true)
	tsCodegen: true,

	// Generate pika.gen.css (default: true)
	cssCodegen: true
})
```

## Complete Example

```javascript
// rolldown.config.mjs
import pikacss from '@pikacss/unplugin-pikacss/rolldown'
import { defineConfig } from 'rolldown'

export default defineConfig({
	input: 'src/index.tsx',
	output: {
		dir: 'dist',
		format: 'es'
	},
	plugins: [
		pikacss()
	]
})
```

## React Example

```tsx
// src/index.tsx
import { createRoot } from 'react-dom/client'
import 'pika.css'

function App() {
	return (
		<div className={pika({
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'center',
			minHeight: '100vh'
		})}
		>
			<h1 className={pika({ color: 'blue', fontSize: '2rem' })}>
				Hello PikaCSS with Rolldown!
			</h1>
		</div>
	)
}

const root = createRoot(document.getElementById('root')!)
root.render(<App />)
```

## TypeScript Support

Add the generated types to your `tsconfig.json`:

```json
{
	"compilerOptions": {
		"module": "ESNext",
		"moduleResolution": "bundler",
		"jsx": "react-jsx"
	},
	"include": ["src/**/*", "pika.gen.ts"]
}
```

## Build and Serve

```json
{
	"scripts": {
		"dev": "rolldown -w",
		"build": "rolldown"
	}
}
```

Then run:

```bash
# Development
pnpm dev

# Production build
pnpm build
```

## Why Rolldown?

Rolldown is a fast JavaScript bundler written in Rust, designed to be a future replacement for Rollup with significantly better performance. PikaCSS integrates seamlessly with Rolldown through the unplugin architecture.

## Hot Module Replacement (HMR)

PikaCSS automatically supports HMR in Rolldown's development mode. When you update your styles, changes will be reflected instantly without a full page reload.

```typescript
// Any style changes are hot-reloaded automatically
const styles = pika({
	color: 'red', // Try changing to 'blue' and see instant update
	fontSize: '16px'
})
```
