# AGENTS.md - PikaCSS Project Maintenance Guide

> 📋 **Document Purpose**: Provide AI agents with comprehensive guidance for maintaining the PikaCSS monorepo project, covering architecture design, development workflows, maintenance decision trees, and best practices.

## 🌍 Language Policy

**CRITICAL RULE: All documentation, code comments, commit messages, and project files MUST be written in English.**

This is a mandatory requirement for:
- ✅ All markdown documentation files (*.md)
- ✅ All code comments (TypeScript, JavaScript, Vue, etc.)
- ✅ JSDoc annotations
- ✅ Git commit messages
- ✅ README files
- ✅ Configuration file comments
- ✅ Test descriptions and assertions
- ✅ Error messages and console logs
- ✅ Variable names and function names (use English naming)

**Rationale**:
- International collaboration and open source contribution
- Better code maintainability and readability
- Easier for global developers to understand and contribute
- Standard practice in the open source community
- Improved IDE support and tooling compatibility

**Enforcement**: All PRs with non-English content (except for test fixtures or translation files) will be rejected.

---

## 📚 Further Reading

This document provides the core overview of project maintenance. For more in-depth technical details, refer to:

- **[pikacss-dev Skill](.github/skills/pikacss-dev/SKILL.md)** - Developer workflow and toolchain details
- **[pikacss-expert Skill](.github/skills/pikacss-expert/SKILL.md)** - PikaCSS usage guide and API reference

---

## 🎯 Core Project Concepts

### What is PikaCSS?

**Atomic CSS-in-JS Engine** - Write CSS-in-JS syntax, output Atomic CSS classes

```typescript
// Write code like this
const styles = pika({
	'color': 'red',
	'fontSize': '16px',
	'&:hover': { color: 'blue' }
})

// Transformed to atomic classes at build time
// Output: "a b c"
// Generated: .a{color:red} .b{font-size:16px} .c:hover{color:blue}
```

### Core Features

- 🛠 **Zero Runtime Overhead** - All transformations happen at build time
- 📖 **Zero Learning Curve** - Use standard CSS property names
- 🤖 **Full TypeScript Support** - Autocomplete and type checking
- 🥰 **Framework Agnostic** - Works with any framework
- ⚡ **High Performance Output** - Automatic deduplication of Atomic CSS

### ⚠️ Critical Constraint: Build-Time Evaluation

**All arguments passed to `pika()` must be statically analyzable**:

```typescript
// ✅ Allowed
const styles = pika({ color: 'red' })
const color = 'blue'
const styles2 = pika({ color })

// ❌ Not allowed (runtime variable)
function Component({ color }) {
	const styles = pika({ color }) // ❌ color is a runtime variable
}

// ✅ Solution: Use CSS variables
const styles = pika({ color: 'var(--dynamic-color)' })
document.documentElement.style.setProperty('--dynamic-color', color)
```

---

## 🏗️ Monorepo Architecture

### Tech Stack

- **Monorepo Tool**: pnpm workspace
- **Build Tool**: tsdown (TypeScript bundler)
- **Test Framework**: Vitest
- **Linter**: ESLint (using @antfu/eslint-config)
- **Documentation System**: VitePress
- **Version Management**: bumpp
- **CI/CD**: GitHub Actions

### Package Layered Architecture

```
┌─────────────────────────────────────────────────────┐
│  Framework Layer (Nuxt, etc.)                       │
│  @pikacss/nuxt-pikacss                             │
├─────────────────────────────────────────────────────┤
│  Unplugin Layer (Multi-bundler support)            │
│  @pikacss/unplugin-pikacss                         │
│  @pikacss/vite-plugin-pikacss                      │
├─────────────────────────────────────────────────────┤
│  Integration Layer (Build-time tools)              │
│  @pikacss/integration                              │
├─────────────────────────────────────────────────────┤
│  Core Layer (Style engine)                         │
│  @pikacss/core                                     │
│                                                     │
│  Official Plugins                                  │
│  @pikacss/plugin-icons                            │
│  @pikacss/plugin-reset                            │
│  @pikacss/plugin-typography                       │
└─────────────────────────────────────────────────────┘
```

### Core Package Responsibilities

#### `@pikacss/core` - Style Processing Engine

**Responsibilities**:
- Parse style definition objects
- Execute plugin hooks
- Generate atomic styles
- Manage preflights, shortcuts, selectors
- Provide plugin API

**Features**:
- Completely independent from build tools
- Only depends on `csstype`
- Provides complete TypeScript types

**Key API**:
```typescript
// Create engine instance
const engine = await createEngine(config)

// Process styles and return class names
const classNames = await engine.use({ color: 'red' })
// → ['a']

// Generate CSS
const css = await engine.renderAtomicStyles(false)
// → '.a{color:red;}'
```

#### `@pikacss/integration` - Integration Tools

**Responsibilities**:
- Scan source code for `pika()` calls
- Evaluate arguments using `new Function()` (at build time)
- Transform code (replace with class names)
- Generate `pika.gen.css` and `pika.gen.ts`
- Coordinate HMR updates

**Features**:
- Provides low-level API for plugin developers
- Handles file watching and incremental updates
- Manages generated file writing

**Key API**:
```typescript
// Create integration context
const ctx = createCtx(options)

// Transform code (called in build tool's transform hook)
const result = await ctx.transform(code, id)

// Generate and write files
await ctx.writeCssCodegenFile()
await ctx.writeTsCodegenFile()

// Or get content
const cssContent = await ctx.getCssCodegenContent()
const tsContent = await ctx.getTsCodegenContent()
```

#### `@pikacss/unplugin-pikacss` - Universal Plugin

**Responsibilities**:
- Wrap Integration layer using unplugin
- Support multiple bundlers (Vite, Webpack, Rollup, Esbuild, Rspack, Farm, Rolldown)
- Handle virtual module (`pika.css`)
- Integrate HMR
- Auto-watch config file changes

**Usage Example**:
```typescript
// Esbuild
import PikaCSS from '@pikacss/unplugin-pikacss/esbuild'

// Farm
import PikaCSS from '@pikacss/unplugin-pikacss/farm'

// Rolldown
import PikaCSS from '@pikacss/unplugin-pikacss/rolldown'

// Rollup
import PikaCSS from '@pikacss/unplugin-pikacss/rollup'

// Rspack
import PikaCSS from '@pikacss/unplugin-pikacss/rspack'

// Vite
import PikaCSS from '@pikacss/unplugin-pikacss/vite'

// Webpack
import PikaCSS from '@pikacss/unplugin-pikacss/webpack'

export default {
	plugins: [
		PikaCSS({
			scan: {
				include: ['**/*.{js,ts,jsx,tsx,vue}'],
				exclude: ['node_modules/**', 'dist/**']
			},
			config: './pika.config.ts', // or pass config object directly
			fnName: 'pika',
			transformedFormat: 'string', // 'string' | 'array' | 'inline'
			tsCodegen: true, // or custom path 'src/pika.gen.ts'
			cssCodegen: true, // or custom path 'src/pika.gen.css'
			autoCreateConfig: true
		})
	]
}
```

**Virtual Module**:
```typescript
// Import virtual module at app entry point
import 'pika.css'
```

#### `@pikacss/vite-plugin-pikacss` - Vite Specific

**Responsibilities**:
- Provide lightweight wrapper specific to Vite
- Simplified API (for Vite users)

#### `@pikacss/nuxt-pikacss` - Nuxt Module

**Responsibilities**:
- Zero-config Nuxt integration
- Auto global injection of `pika()` function (no import needed)
- Auto import virtual module `pika.css`
- Default scan `.vue`, `.tsx`, `.jsx` files
- Uses `@pikacss/unplugin-pikacss/vite` as underlying implementation

**Usage Example**:
```typescript
// nuxt.config.ts
export default defineNuxtConfig({
	modules: [
		'@pikacss/nuxt-pikacss'
	],
	pikacss: {
		// Full options same as @pikacss/unplugin-pikacss
		scan: {
			include: ['**/*.vue', '**/*.tsx', '**/*.jsx'],
			exclude: ['node_modules/**']
		},
		config: './pika.config.ts',
		fnName: 'pika',
		transformedFormat: 'string',
		tsCodegen: true,
		cssCodegen: true,
		autoCreateConfig: true
	}
})
```

```vue
<script setup lang="ts">
// ✅ pika() is globally available, no import needed
const styles = pika({
	display: 'flex',
	alignItems: 'center',
	gap: '1rem'
})
</script>

<template>
	<div :class="styles">
		Hello PikaCSS in Nuxt!
	</div>
</template>
```

#### Official Plugins

**`@pikacss/plugin-icons`** - Icon System
- Provides 100,000+ Iconify icons
- On-demand loading (tree-shakeable)
- Supports custom icon collections
- Default prefix: `i-`
- Supports 3 render modes: `auto`, `mask`, `bg`

**Configuration Example**:
```typescript
import { defineEngineConfig } from '@pikacss/core'
import { icons } from '@pikacss/plugin-icons'

export default defineEngineConfig({
	// 1. Register in plugins array
	plugins: [
		icons() // Note: must call function
	],

	// 2. Configure at root level
	icons: {
		prefix: 'i-', // Default prefix
		scale: 1, // Scale multiplier
		mode: 'auto', // 'auto' | 'mask' | 'bg'
		cdn: 'https://esm.sh/',
		autoInstall: false,
	}
})
```

**Usage Example**:
```typescript
// Direct shortcut usage
const icon = pika('i-mdi:home')

// Combined with styles (recommended)
const styledIcon = pika('i-mdi:home', {
	fontSize: '24px',
	color: 'blue'
})

// Using __shortcut property
const iconWithStyles = pika({
	__shortcut: 'i-mdi:home',
	fontSize: '24px'
})

// Specify render mode
const maskIcon = pika('i-mdi:home?mask') // mask mode (inherits color)
const bgIcon = pika('i-mdi:home?bg') // background mode
```

**`@pikacss/plugin-reset`** - CSS Reset
- 5 popular CSS reset options
- Default uses modern-normalize
- order: 'pre' (executes before other plugins)

**Configuration Example**:
```typescript
import { defineEngineConfig } from '@pikacss/core'
import { reset } from '@pikacss/plugin-reset'

export default defineEngineConfig({
	// 1. Register in plugins array
	plugins: [
		reset() // Note: must call function
	],

	// 2. Select reset option at root level
	reset: 'modern-normalize' // Default value
})
```

**Available Options**:
- `'modern-normalize'` (default) - Modern browser normalization
- `'normalize'` - Classic normalize.css
- `'andy-bell'` - Andy Bell's Modern CSS Reset
- `'eric-meyer'` - Eric Meyer's CSS Reset
- `'the-new-css-reset'` - Elad Shechter's The New CSS Reset

**Usage Example**:
```typescript
// Use default modern-normalize
export default defineEngineConfig({
	plugins: [reset()]
})

// Select different reset option
export default defineEngineConfig({
	plugins: [reset()],
	reset: 'andy-bell'
})
```

**`@pikacss/plugin-typography`** - Typography System
- Provides prose styles
- Modular typography shortcuts (use on-demand)
- Supports size variants (sm, lg, xl, 2xl)
- Customizable via CSS variables

**Configuration Example**:
```typescript
import { defineEngineConfig } from '@pikacss/core'
import { typography } from '@pikacss/plugin-typography'

// Basic usage
export default defineEngineConfig({
	plugins: [
		typography() // Note: must call function
	]
})

// Custom variables (configure at root level)
export default defineEngineConfig({
	plugins: [
		typography() // Note: must call function
	],
	typography: {
		variables: {
			'--pk-prose-color-body': '#374151',
			'--pk-prose-color-headings': '#111827',
			'--pk-prose-color-links': '#2563eb',
		}
	}
})
```

**Usage Example**:
```typescript
// Complete prose styles (all typography elements)
const prose = pika('prose')

// Modular shortcuts (each automatically includes prose-base)
const minimal = pika('prose-headings prose-paragraphs')
const docs = pika('prose-headings prose-code prose-lists')

// Size variants
const large = pika('prose-lg') // Larger font
const small = pika('prose-sm') // Smaller font
```

**Available Modular Shortcuts**:
- `prose-base` - Base styles (color, width, font size)
- `prose-paragraphs` - Paragraph styles
- `prose-links` - Link styles
- `prose-emphasis` - Strong and italic
- `prose-kbd` - Keyboard input styles
- `prose-lists` - List styles
- `prose-hr` - Horizontal rule
- `prose-headings` - Heading styles
- `prose-quotes` - Blockquote styles
- `prose-media` - Media styles (img, video, figure)
- `prose-code` - Code styles
- `prose-tables` - Table styles
- `prose` - Complete styles (combines all above)

---

## 🔧 Development Workflow

### Environment Setup

```bash
# Install dependencies (requires Node.js 18+ and pnpm 10.24.0+)
pnpm install

# Setup git hooks
pnpm prepare
```

### Common Commands

```bash
# Build
pnpm build                              # Build all packages
pnpm --filter @pikacss/core build      # Build single package
pnpm --filter @pikacss/core build:watch # Watch mode

# Test
pnpm test                               # Run all tests
pnpm --filter @pikacss/core test       # Test single package
pnpm --filter @pikacss/core test:watch # Test watch mode

# Type Check
pnpm typecheck                          # All packages

# Lint
pnpm lint                               # ESLint auto-fix

# Documentation
pnpm docs:dev                           # Dev server
pnpm docs:build                         # Build docs
pnpm docs:preview                       # Preview build

# Release (only when preparing official release)
pnpm publint                            # Verify package.json exports
pnpm release                            # Complete release process
```

### Scaffolding Tools

```bash
# Create new package
pnpm newpkg [pkgDirname] [pkgName]

# Create new plugin
pnpm newplugin [pluginName]
```

---

## 🎯 Maintenance Decision Trees

### Decision 1: Adding New Feature

```
Need to add feature
├─ Is it new style processing logic?
│  ├─ Yes → Modify @pikacss/core
│  │      1. Implement in packages/core/src/
│  │      2. Write tests in packages/core/tests/
│  │      3. Update type definitions
│  │      4. Run pnpm --filter @pikacss/core test
│  │      5. Update docs in docs/guide/ or docs/advanced/
│  │
│  └─ No → Is it new build tool integration?
│         ├─ Yes → Modify @pikacss/unplugin-pikacss
│         │      1. Add entry point in packages/unplugin/src/
│         │      2. Update package.json exports
│         │      3. Write tests
│         │      4. Add docs in docs/integrations/
│         │
│         └─ No → Is it new plugin?
│                  1. Run pnpm newplugin <name>
│                  2. Implement plugin logic
│                  3. Write tests
│                  4. Add docs in docs/plugins/
│                  5. Update main docs plugin list
```

### Decision 2: Fixing Bug

```
Bug found
├─ 1. Identify affected package
│     └─ Use grep_search or semantic_search to locate code
│
├─ 2. Create reproduction test
│     └─ Add failing test in packages/<pkg>/tests/
│
├─ 3. Implement fix
│     └─ Use replace_string_in_file or multi_replace_string_in_file
│
├─ 4. Verify fix
│     ├─ pnpm --filter @pikacss/<pkg> test
│     ├─ pnpm typecheck
│     └─ pnpm lint
│
└─ 5. Update docs (if behavior changed)
```

### Decision 3: Release New Version

```
Prepare release
├─ 1. Ensure all tests pass
│     ├─ pnpm build
│     ├─ pnpm test
│     ├─ pnpm typecheck
│     ├─ pnpm lint
│     └─ pnpm publint
│
├─ 2. Check and update documentation
│     ├─ pnpm docs:build (verify build success)
│     └─ Review and update AGENTS.md (if major changes)
│
├─ 3. Update version
│     └─ pnpm release (auto runs bumpp)
│         ├─ patch: 0.0.x (bug fixes)
│         ├─ minor: 0.x.0 (new features)
│         └─ major: x.0.0 (breaking changes)
│
└─ 4. Publish to npm
      └─ pnpm publish:packages
```

### Decision 4: Adding New Plugin

```
Create new plugin
├─ 1. Use scaffolding
│     └─ pnpm newplugin <plugin-name>
│
├─ 2. Implement plugin logic
│     ├─ Define EnginePlugin
│     │   export function myPlugin(options): EnginePlugin {
│     │     return defineEnginePlugin({
│     │       name: 'my-plugin',
│     │       order: 'post',
│     │       async configureEngine(engine) { /* ... */ },
│     │       // ... other hooks
│     │     })
│     │   }
│     │
│     ├─ Register shortcuts/selectors/preflights
│     └─ Provide TypeScript module augmentation
│
├─ 3. Write tests
│     └─ packages/plugin-<name>/tests/*.test.ts
│
├─ 4. Write documentation
│     ├─ packages/plugin-<name>/README.md
│     └─ docs/plugins/<name>.md
│
└─ 5. Update main docs
      └─ docs/guide/plugin-system.md (add to official plugins list)
```

---

## 📋 Maintenance Checklist

### ✅ Before Adding Feature

- [ ] Identify which layer (Core/Integration/Unplugin/Plugin)
- [ ] Check if similar feature exists or can extend existing
- [ ] Confirm if TypeScript module augmentation needed
- [ ] Plan testing strategy

### ✅ During Implementation

- [ ] Follow existing code style and naming conventions
- [ ] Write unit tests concurrently
- [ ] Add JSDoc comments for public APIs
- [ ] Update related type definitions
- [ ] Run `pnpm lint` to ensure code style consistency

### ✅ After Implementation

- [ ] All tests pass (`pnpm test`)
- [ ] Type check passes (`pnpm typecheck`)
- [ ] Build succeeds (`pnpm build`)
- [ ] Update docs (usage guide, API reference)
- [ ] Update example code (if applicable)
- [ ] Check if affects other packages

### ✅ Before Release

- [ ] Run `pnpm publint` to verify exports
- [ ] Build and check documentation site
- [ ] Review and update AGENTS.md (if major changes)
- [ ] Update CHANGELOG (if applicable)
- [ ] Confirm version number follows semantic versioning
- [ ] Clean dist directories (`rimraf ./**/dist`)

---

## 🔍 Important Design Decisions and Conventions

### Naming Conventions

```typescript
// Package names
@pikacss/<name>           // General packages
@pikacss/plugin-<name>    // Plugin packages

// File naming
camelCase.ts              // General files
kebab-case.ts             // Alternative
index.ts                  // Entry point

// Type naming
interface MyInterface {}  // PascalCase
type MyType = {}          // PascalCase

// Function naming
function myFunction() {}  // camelCase
export const myFunction = () => {}  // camelCase
```

### TypeScript Configuration Structure

Each package has **3 tsconfig files**:

```json
// tsconfig.json - Reference config
{
  "extends": ["./tsconfig.package.json", "./tsconfig.tests.json"],
  "references": [...]
}

// tsconfig.package.json - Package code
{
  "extends": "../../tsconfig.json",
  "include": ["src/**/*"]
}

// tsconfig.tests.json - Test code
{
  "extends": "../../tsconfig.json",
  "include": ["tests/**/*"]
}
```

### Module Augmentation Pattern

Standard way for plugins to extend core types:

```typescript
// packages/plugin-my-plugin/src/index.ts

declare module '@pikacss/core' {
  interface EngineConfig {
    myPluginOption?: MyOptions
  }

  interface Shortcuts {
    myShortcut: MyShortcutDefinition
  }

  interface Selectors {
    mySelector: MySelectorDefinition
  }
}

export function myPlugin(options?: MyOptions): EnginePlugin {
  return defineEnginePlugin({
    name: 'my-plugin',
    async configureEngine(engine) {
      // Register shortcuts
      engine.registerShortcut('myShortcut', { ... })
      // Register selectors
      engine.registerSelector('mySelector', (...) => { ... })
    }
  })
}
```

### Plugin System Best Practices

1. **Execution Order**: Use `order` field to control plugin execution order
   - `'pre'`: Execute before built-in plugins
   - `undefined`: Normal order (default)
   - `'post'`: Execute after built-in plugins

2. **Error Handling**: Wrap operations that may fail
   ```typescript
   async transformStyleDefinitions(defs) {
     try {
       // ... processing logic
     } catch (error) {
       console.error(`[my-plugin] Error:`, error)
       return defs // Return original to avoid breaking flow
     }
   }
   ```

3. **Peer Dependencies**: Plugins should list `@pikacss/core` as peer dependency
   ```json
   {
   	"peerDependencies": {
   		"@pikacss/core": "workspace:*"
   	}
   }
   ```

### Auto-Generated Files (Do Not Edit Manually)

These files are auto-generated by tools, **DO NOT edit manually**:

- `pika.gen.css` - Generated CSS styles
- `pika.gen.ts` - TypeScript type definitions (autocomplete)
- `dist/**/*` - Build output

### Zero Runtime Philosophy

All style transformations must happen at build time:

```typescript
// Integration layer uses new Function() for evaluation
const evalResult = new Function(`return ${code}`)()

// ✅ This works (statically analyzable)
const styles = pika({ color: 'red' })
const COLOR = 'blue'
const styles2 = pika({ color: COLOR })

// ❌ This fails (runtime variable)
function Component({ color }) {
	const styles = pika({ color }) // Build time cannot know color value
}
```

---

## 🐛 Common Issues and Debugging

### Build Issues

**Issue**: Cannot find `pika.gen.ts`
```
Solution:
1. Run dev server once (triggers file generation)
2. Check if plugin config is correct
3. Verify file scan patterns include target files
```

**Issue**: `pika is not defined`
```
Solution:
1. Confirm pika.gen.ts is imported or globally injected
2. Check if integration plugin is correctly loaded
3. Nuxt projects: Check pikacss module in nuxt.config.ts
```

**Issue**: Type errors (TypeScript)
```
Solution:
1. Restart TypeScript server (VS Code: Cmd+Shift+P → Restart TS Server)
2. Verify pika.gen.ts is generated and included in tsconfig include
3. Check if plugin's module augmentation is correct
```

### Style Issues

**Issue**: Styles not applied
```
Solution:
1. Confirm virtual module import 'pika.css' is present
2. Check browser dev tools to verify CSS is loaded
3. Verify atomic class names are correctly rendered to DOM
4. Check if pika.gen.css file is generated
```

**Issue**: Styles overridden
```
Solution:
1. Use __important: true property
2. Adjust CSS load order (ensure pika.gen.css loads last)
3. Use more specific selectors
```

**Issue**: HMR not working
```
Solution:
1. Check if dev server has HMR correctly configured
2. Verify file watch settings include target files
3. Try restarting dev server
```

### Performance Issues

**Issue**: Slow build
```
Solution:
1. Use --filter to limit build scope
   pnpm --filter @pikacss/core build
2. Use watch mode for incremental builds
3. Check for unnecessary dependency rebuilds
```

**Issue**: Slow tests
```
Solution:
1. Use project filters
   pnpm --filter @pikacss/core test
2. Use watch mode to run only changed tests
3. Use test.only() to focus on specific tests
```

---

## 🎓 Learning Resources

### Internal Documentation

- **[Architecture](docs/advanced/architecture.md)** - Deep dive into internal architecture
- **[Plugin Development](docs/advanced/plugin-development.md)** - Complete plugin development guide
- **[API Reference](docs/advanced/api-reference.md)** - Complete API documentation
- **[Troubleshooting](docs/advanced/troubleshooting.md)** - Troubleshooting guide

### Skill Files

- **[pikacss-dev SKILL](.github/skills/pikacss-dev/SKILL.md)** - Developer in-depth guide
- **[pikacss-expert SKILL](.github/skills/pikacss-expert/SKILL.md)** - Usage expert guide

### External References

- **[UnoCSS](https://github.com/unocss/unocss)** - Inspiration source and design philosophy reference
- **[unplugin](https://github.com/unjs/unplugin)** - Universal plugin system docs
- **[tsdown](https://github.com/sxzz/tsdown)** - TypeScript bundler
- **[Iconify](https://iconify.design/)** - Icon system (used by plugin-icons)
- **[Vitest](https://vitest.dev/)** - Test framework documentation

---

## 🔄 Transformation Pipeline Deep Dive

```
Source Code
    ↓
[1] Detect pika() calls
    ├─ Scan files using RegExp
    └─ Extract argument code
    ↓
[2] Build-time evaluation
    ├─ new Function('return ' + code)()
    └─ Get style definition object
    ↓
[3] Core Engine processing
    ├─ Execute plugin hooks (transformStyleDefinitions)
    ├─ Parse style definitions (expand shortcuts)
    ├─ Flatten nested selectors
    ├─ Atomization (each prop-value combo → unique ID)
    └─ Store in engine.styles Map
    ↓
[4] Code rewriting
    └─ Replace pika() → class name string
    ↓
[5] CSS generation
    ├─ Generate atomic rules
    ├─ Generate preflights
    ├─ Generate keyframes
    └─ Output pika.gen.css
    ↓
[6] TypeScript type generation
    └─ Output pika.gen.ts (autocomplete)
    ↓
Final Output
```

### Example: Complete Transformation Flow

**Input**:
```typescript
// App.tsx
import { pika } from './pika.gen'

const buttonStyles = pika({
	'color': 'red',
	'fontSize': '16px',
	'&:hover': { color: 'blue' }
})
```

**Steps 1-2: Detection and Evaluation**
```javascript
// Integration layer
const matches = code.matchAll(/pika\(([\s\S]*?)\)/g)
const styleObj = new Function('return ' + '{ color: "red", ... }')()
// → { color: 'red', fontSize: '16px', '&:hover': { color: 'blue' } }
```

**Step 3: Core Processing**
```javascript
// Core Engine
const classNames = await engine.use({
	'color': 'red',
	'fontSize': '16px',
	'&:hover': { color: 'blue' }
})

// Internally generates 3 atomic styles:
// { id: 'a', content: { selector: ['.%'], property: 'color', value: ['red'] } }
// { id: 'b', content: { selector: ['.%'], property: 'fontSize', value: ['16px'] } }
// { id: 'c', content: { selector: ['.%:hover'], property: 'color', value: ['blue'] } }

// Returns: ['a', 'b', 'c']
```

**Step 4: Code Rewriting**
```typescript
// Transformed App.tsx
import { pika } from './pika.gen'

const buttonStyles = 'a b c'
```

**Steps 5-6: Generate Output**
```css
/* pika.gen.css */
.a{color:red}
.b{font-size:16px}
.c:hover{color:blue}
```

```typescript
// pika.gen.ts
export function pika(styles: StyleDefinition): string
```

---

## 📊 Project Statistics

### Package Overview

| Package Name | Responsibility | Dependency Level |
|---------|------|---------|
| `@pikacss/core` | Style processing engine | 0 (no internal deps) |
| `@pikacss/integration` | Build tool integration | 1 (depends on core) |
| `@pikacss/unplugin-pikacss` | Universal plugin | 2 (depends on integration) |
| `@pikacss/vite-plugin-pikacss` | Vite specific | 3 (depends on unplugin) |
| `@pikacss/nuxt-pikacss` | Nuxt module | 3 (depends on unplugin) |
| `@pikacss/plugin-icons` | Icon plugin | 1 (depends on core) |
| `@pikacss/plugin-reset` | CSS reset | 1 (depends on core) |
| `@pikacss/plugin-typography` | Typography system | 1 (depends on core) |

### Version Management

- **Current Version**: 0.0.38
- **Release Strategy**: All packages use unified version number
- **Version Tool**: bumpp

---

## 🤝 Contribution Guidelines (for Agents)

### Agent Working Principles

1. **Understand before acting**
   - Use `read_file`, `grep_search`, `semantic_search` to understand code
   - Check related documentation and tests
   - Confirm scope of changes

2. **Follow existing conventions**
   - Code style consistent with existing files
   - Naming follows project standards
   - Test patterns consistent with existing tests

3. **Incremental changes**
   - Handle one logical change at a time
   - Ensure project still builds after each change
   - Run tests frequently to verify

4. **Complete changes**
   - Code implementation + tests + docs + type definitions
   - No half-finished features
   - Ensure lint and typecheck pass

5. **Clear communication**
   - Explain reasons and impact of changes
   - List changed files
   - Describe how to verify changes

### Tool Usage Priority

```
Understanding phase:
1. semantic_search (find related concepts)
2. grep_search (find specific strings/patterns)
3. read_file (read complete files)
4. list_dir (explore directory structure)

Implementation phase:
1. multi_replace_string_in_file (multiple independent edits)
2. replace_string_in_file (single edit)
3. create_file (create new files)

Verification phase:
1. run_in_terminal (run tests/build)
2. get_errors (check compile errors)
3. read_file (verify change results)
```

### Typical Workflow Example

**Task: Add a core feature**

```
1. Research phase
   ├─ semantic_search("similar feature implementation")
   ├─ read_file("packages/core/src/related-file.ts")
   └─ read_file("packages/core/tests/related-test.test.ts")

2. Planning phase
   ├─ Confirm scope of changes (which files need modification)
   ├─ Design API (function signatures, type definitions)
   └─ Plan test cases

3. Implementation phase
   ├─ multi_replace_string_in_file (modify multiple files simultaneously)
   ├─ create_file (add test files)
   └─ replace_string_in_file (modify type definitions)

4. Verification phase
   ├─ run_in_terminal("pnpm --filter @pikacss/core test")
   ├─ run_in_terminal("pnpm typecheck")
   ├─ get_errors (check for errors)
   └─ run_in_terminal("pnpm lint")

5. Documentation phase
   ├─ replace_string_in_file (update related docs)
   └─ create_file (add usage examples)
```

---

## 🚨 Important Notes

### ⚠️ Never Do These

1. **Do not manually edit generated files**
   - `pika.gen.css`
   - `pika.gen.ts`
   - `dist/**/*`

2. **Do not bypass build-time constraints**
   - Do not attempt runtime style evaluation
   - Do not use `eval()` or similar runtime code generation

3. **Do not break backward compatibility** (unless major version)
   - Remove public APIs
   - Change public API behavior
   - Modify default config values

4. **Do not skip tests**
   - All changes should have corresponding tests
   - Must ensure all tests pass before release

5. **Do not ignore TypeScript errors**
   - `pnpm typecheck` must pass completely
   - Do not use `@ts-ignore` unless with good reason

### ✅ Recommended Practices

1. **Prioritize parallel tool calls**
   - Use `multi_replace_string_in_file` instead of multiple `replace_string_in_file`
   - Read multiple related files simultaneously

2. **Keep changes atomic**
   - Each commit should be a complete logical change
   - Can build, test, and deploy

3. **Provide clear change descriptions**
   - Explain why making this change
   - Describe scope of impact
   - List verification steps

4. **Follow semantic versioning**
   - patch: bug fixes
   - minor: new features (backward compatible)
   - major: breaking changes

5. **Maintain documentation currency**
   - Update docs when code changes
   - Ensure example code is executable

---

## 📝 Version History

- **v0.0.38** (2026-01-04) - Current version
- For earlier version history, refer to Git commit log

---

## 📄 License

MIT License - See [LICENSE](LICENSE) file

---

**Last Updated**: 2026-01-04
**Maintainers**: PikaCSS Team
**Document Version**: 1.0.0
