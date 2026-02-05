<!-- eslint-disable -->
# Framework Integration

PikaCSS works with any JavaScript framework and build tool. Use one of these integrations to get started.

## Official Integrations

### Vite

The recommended setup for modern web development.

```bash
npm install -D @pikacss/unplugin-pikacss
```

**vite.config.ts:**
```typescript
import pikacss from '@pikacss/unplugin-pikacss/vite'
import { defineConfig } from 'vite'

export default defineConfig({
	plugins: [
		pikacss({
			scan: {
				include: ['**/*.{tsx,ts,vue}'],
				exclude: ['node_modules/**', 'dist/**']
			}
		})
	]
})
```

**Features**:
- Fast HMR (hot module replacement)
- Zero-config TypeScript support
- Best DX (developer experience)

Learn more: [Vite Integration](/integrations/vite.md)

---

### Nuxt

Zero-config integration for Nuxt projects.

```bash
npm install -D @pikacss/nuxt-pikacss
```

**nuxt.config.ts:**
```typescript
export default defineNuxtConfig({
	modules: ['@pikacss/nuxt-pikacss'],
	pikacss: {
		// options (optional)
	}
})
```

**Features**:
- Automatic global `pika()` import
- Auto-configured for Vue files
- Seamless Nuxt integration

Learn more: [Nuxt Integration](/integrations/nuxt.md)

---

### Webpack

For traditional Webpack-based projects.

```bash
npm install -D @pikacss/unplugin-pikacss
```

**webpack.config.js:**
```javascript
const pikacss = require('@pikacss/unplugin-pikacss/webpack')

module.exports = {
	plugins: [
		pikacss({
			scan: {
				include: ['**/*.{tsx,ts,jsx,js}']
			}
		})
	]
}
```

Learn more: [Webpack Integration](/integrations/webpack.md)

---

### Rspack

Modern Rust-based bundler with Webpack-compatible API.

```bash
npm install -D @pikacss/unplugin-pikacss
```

**rspack.config.js:**
```javascript
const pikacss = require('@pikacss/unplugin-pikacss/rspack')

module.exports = {
	plugins: [
		pikacss({
			scan: {
				include: ['**/*.{tsx,ts,jsx,js}']
			}
		})
	]
}
```

Learn more: [Rspack Integration](/integrations/rspack.md)

---

### Esbuild

For esbuild-based build pipelines.

```bash
npm install -D @pikacss/unplugin-pikacss
```

**build.js:**
```javascript
const PikaCSS = require('@pikacss/unplugin-pikacss/esbuild')
const esbuild = require('esbuild')

esbuild.build({
	plugins: [PikaCSS.default()]
})
```

Learn more: [Esbuild Integration](/integrations/esbuild.md)

---

### Farm

Rust-powered web build tool.

```bash
npm install -D @pikacss/unplugin-pikacss
```

**farm.config.ts:**
```typescript
import { defineConfig } from '@farmfe/core'
import pikacss from '@pikacss/unplugin-pikacss/farm'

export default defineConfig({
	plugins: [pikacss()]
})
```

Learn more: [Farm Integration](/integrations/farm.md)

---

### Rolldown

Next-generation JavaScript bundler.

```bash
npm install -D @pikacss/unplugin-pikacss
```

**rolldown.config.ts:**
```typescript
import pikacss from '@pikacss/unplugin-pikacss/rolldown'
import { defineConfig } from 'rolldown'

export default defineConfig({
	plugins: [pikacss()]
})
```

Learn more: [Rolldown Integration](/integrations/rolldown.md)

---

## Common Integration Patterns

### 1. Auto-Import pika() Function

Most integrations provide global `pika()` without explicit imports:

**Nuxt** (automatic):
```vue
<script setup>
const styles = pika({ color: 'red' }) // No import needed
</script>
```

**Other frameworks** (with TypeScript reference):
```typescript
/// <reference path="./src/pika.gen.ts" />

const styles = pika({ color: 'red' }) // Type-safe
```

### 2. Configure File Scanning

All integrations need to know which files to scan:

```typescript
scan: {
  include: ['**/*.{tsx,ts,jsx,js,vue}'],
  exclude: ['node_modules/**', 'dist/**']
}
```

Customize patterns for your project structure.

### 3. Virtual CSS Module

Import generated CSS in your entry point:

```typescript
// main.ts or app.ts or entry.ts
import 'pika.css'

// Other imports...
```

This loads the atomic CSS styles in your application.

### 4. Configuration File

All integrations look for `pika.config.ts`:

```typescript
/// <reference path="./src/pika.gen.ts" />

import { defineEngineConfig } from '@pikacss/core'
import { icons } from '@pikacss/plugin-icons'
import { reset } from '@pikacss/plugin-reset'

export default defineEngineConfig({
	plugins: [icons(), reset()],

	prefix: 'pika-',

	shortcuts: {
		shortcuts: [
			['flex-center', {
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center'
			}]
		]
	}
})
```

Or pass config directly to plugin:

```typescript
pikacss({
	config: {
		prefix: 'pika-'
	}
})
```

### 5. Framework-Specific Setup

**React/Next.js** (Vite):
```typescript
import pikacss from '@pikacss/unplugin-pikacss/vite'
// vite.config.ts
import react from '@vitejs/plugin-react'

export default defineConfig({
	plugins: [pikacss(), react()]
})
```

**Vue** (Vite):
```typescript
import pikacss from '@pikacss/unplugin-pikacss/vite'
// vite.config.ts
import vue from '@vitejs/plugin-vue'

export default defineConfig({
	plugins: [pikacss(), vue()]
})
```

**Svelte** (Vite):
```typescript
import pikacss from '@pikacss/unplugin-pikacss/vite'
// vite.config.ts
import { svelte } from 'vite-plugin-svelte'

export default defineConfig({
	plugins: [pikacss(), svelte()]
})
```

## TypeScript Configuration

For all integrations, add to your config file:

```typescript
/// <reference path="./src/pika.gen.ts" />
```

This ensures TypeScript can find auto-generated types.

## Virtual Module Import

Import the generated CSS file in your app entry point:

```typescript
// src/main.ts or src/app.tsx
import 'pika.css'

// Your app code
```

Without this import, generated styles won't be loaded.

## Troubleshooting Integration Issues

### pika is not defined
- Ensure `pika.gen.ts` is generated (run dev server once)
- Add `/// <reference path="./src/pika.gen.ts" />` to your config
- Restart TypeScript server

### Styles not appearing
- Check `import 'pika.css'` is in entry point
- Verify CSS file is loaded in browser DevTools
- Run dev server to regenerate files

### HMR not working
- Restart dev server
- Check file scan patterns
- Clear `.next`, `dist`, or build cache

### TypeScript errors
- Regenerate types: run dev/build again
- Restart TypeScript server
- Check `pika.gen.ts` exists in correct location

## Comparison

| Integration | Setup | DX | Performance | Best For |
|-------------|-------|----|----|-----------|
| **Vite** | ⭐ Easy | ⭐⭐⭐ Best | ⭐⭐⭐ Fast | Modern development |
| **Nuxt** | ⭐ Zero-config | ⭐⭐⭐ Best | ⭐⭐⭐ Fast | Nuxt projects |
| **Webpack** | ⭐⭐ Medium | ⭐⭐ Good | ⭐⭐ OK | Legacy projects |
| **Rspack** | ⭐ Easy | ⭐⭐ Good | ⭐⭐⭐ Fast | Performance-focused |
| **Esbuild** | ⭐⭐ Medium | ⭐⭐ Good | ⭐⭐⭐ Very Fast | Build tools |
| **Farm** | ⭐⭐ Medium | ⭐⭐ Good | ⭐⭐⭐ Very Fast | Rust enthusiasts |
| **Rolldown** | ⭐⭐ Medium | ⭐⭐ Good | ⭐⭐⭐ Very Fast | Next-gen builds |

## Starting Your First Project

### Fastest Path (Recommended)

```bash
# 1. Create Vite project
npm create vite@latest my-app -- --template react
cd my-app

# 2. Install PikaCSS
npm install -D @pikacss/unplugin-pikacss

# 3. Create pika.config.ts
cat > pika.config.ts << 'EOF'
/// <reference path="./src/pika.gen.ts" />
import { defineEngineConfig } from '@pikacss/core'

export default defineEngineConfig({
  prefix: 'pika-'
})
EOF

# 4. Update vite.config.ts
# Add: import pikacss from '@pikacss/unplugin-pikacss/vite'
# Add to plugins: pikacss()

# 5. Import CSS in main.tsx
# Add: import 'pika.css'

# 6. Start dev server
npm run dev
```

## Related Resources

- [Vite Integration](/integrations/vite.md) - Detailed Vite setup
- [Nuxt Integration](/integrations/nuxt.md) - Detailed Nuxt setup
- [Configuration Guide](/guide/configuration.md) - Configure PikaCSS options
- [Troubleshooting](/advanced/troubleshooting.md) - Common issues

---

**Choose Your Integration**: Pick the one matching your build tool, then follow the detailed guide for your framework.
