# Phase 6: Plugin System Correction - Research

**Researched:** 2026-02-05
**Domain:** Plugin documentation verification with TypeScript module augmentation
**Confidence:** HIGH

## Summary

Phase 6 applies the complete verification infrastructure to all three official PikaCSS plugins (@pikacss/plugin-icons, @pikacss/plugin-reset, @pikacss/plugin-typography). Research confirms that PikaCSS plugins follow a consistent module augmentation pattern where plugins extend the core `EngineConfig` interface via TypeScript declaration merging. The verification approach must validate both runtime behavior (shortcuts, preflights, variables) and compile-time types (module augmentation correctness).

All three plugins already have basic functional tests but lack comprehensive coverage, particularly for TypeScript type verification and external consumer testing. The user has decided on progressive documentation depth (complex plugins get more detail), multi-scenario module augmentation examples, and selective multi-plugin testing.

The standard stack is already in place:
- **Vitest 4.0.16** with built-in `expectTypeOf` for type assertions
- **TypeScript 5.x Compiler API** for API extraction (Phase 3 infrastructure)
- **Existing test patterns** from plugin-reset and plugin-typography

**Primary recommendation:** Use three-layer verification (functional tests + type assertion tests + external consumer tests) with module augmentation examples that show declaration + multiple real-world usage scenarios.

## Standard Stack

All required tools are already installed in the PikaCSS monorepo:

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Vitest | 4.0.16 | Test framework with `expectTypeOf` | Built-in type testing, already used across all packages |
| TypeScript Compiler API | 5.x | API extraction and type checking | Official TypeScript API, Phase 3 infrastructure exists |
| @pikacss/core | 0.0.39 | Plugin foundation | All plugins peer-depend on core and extend its types |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| unified/remark | Latest | Markdown parsing | API verifier for doc parsing (Phase 3) |
| pnpm pack | Built-in | Package tarball creation | External consumer testing with real npm install |
| tsx | Latest | TypeScript execution | Running module augmentation verification scripts |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Vitest expectTypeOf | tsd, tsc type tests | Vitest 4.x has built-in expectTypeOf; tsd requires separate tool; tsc requires complex setup |
| pnpm pack + install | npm link | npm link uses symlinks (not real consumer experience); pack creates actual tarball |
| Monorepo workspace tests | Separate consumer repo | Workspace tests faster; separate repo needed for final validation only |

**Installation:**
```bash
# No additional dependencies needed - all tools already installed
pnpm install  # Installs existing dependencies
```

## Architecture Patterns

### Recommended Test Organization
```
packages/plugin-{name}/
├── src/
│   └── index.ts              # Plugin implementation with module augmentation
├── tests/
│   ├── functional.test.ts    # Runtime behavior tests (shortcuts, preflights)
│   ├── types.test.ts         # TypeScript type assertion tests
│   └── integration.test.ts   # Multi-plugin combination tests (selective)
├── examples/                 # NEW: Documented usage examples
│   ├── basic-usage.ts        # Basic configuration example
│   └── advanced-usage.ts     # Advanced scenarios with module augmentation
└── README.md                 # Plugin documentation

packages/api-verifier/
└── tests/
    └── plugins/
        ├── plugin-icons.test.ts      # Verify icons plugin API docs
        ├── plugin-reset.test.ts      # Verify reset plugin API docs
        └── plugin-typography.test.ts # Verify typography plugin API docs
```

### Pattern 1: Module Augmentation Pattern (Standard)

**What:** TypeScript declaration merging to extend `EngineConfig` interface from `@pikacss/core`

**When to use:** Every plugin that adds configuration options

**Example:**
```typescript
// Source: packages/plugin-reset/src/index.ts (actual PikaCSS code)
import type { EnginePlugin } from '@pikacss/core'
import { defineEnginePlugin } from '@pikacss/core'

export type ResetStyle = 'modern-normalize' | 'normalize' | 'andy-bell' | 'eric-meyer' | 'the-new-css-reset'

// Module augmentation - extends core types
declare module '@pikacss/core' {
	interface EngineConfig {
		/**
		 * Reset style to use.
		 * @default 'modern-normalize'
		 */
		reset?: ResetStyle
	}
}

// Plugin implementation
export function reset(): EnginePlugin {
	let style: ResetStyle = 'modern-normalize'
	return defineEnginePlugin({
		name: 'reset',
		order: 'pre',
		configureRawConfig: (config) => {
			if (config.reset)  // TypeScript knows 'reset' exists on config
				style = config.reset
		},
		configureEngine: async (engine) => {
			// Add reset CSS as preflight
			engine.addPreflight(resetStyles[style])
		}
	})
}
```

**Key insights:**
- Module augmentation must be in the same file as plugin export
- Interface extends `EngineConfig` not `Engine` (config-level extension)
- JSDoc comments on augmented properties provide IDE autocomplete hints
- Plugin function reads the augmented config property in `configureRawConfig` hook

### Pattern 2: Three-Layer Verification Pattern

**What:** Test plugins at three levels - functional behavior, type safety, external consumer

**When to use:** All plugin documentation verification

**Layer 1: Functional Tests (Runtime Behavior)**
```typescript
// Source: packages/plugin-reset/tests/reset.test.ts (actual test)
import { createEngine } from '@pikacss/core'
import { describe, expect, it } from 'vitest'
import { reset } from '../src'

describe('plugin-reset', () => {
	it('should add modern-normalize reset by default', async () => {
		const engine = await createEngine({
			plugins: [reset()],
		})

		const css = await engine.renderPreflights(false)
		expect(css).toContain('box-sizing: border-box')
		expect(css).toContain('tab-size: 4')
	})

	it('should add normalize reset', async () => {
		const engine = await createEngine({
			reset: 'normalize',  // Uses module-augmented config
			plugins: [reset()],
		})

		const css = await engine.renderPreflights(false)
		expect(css).toContain('line-height: 1.15')
	})
})
```

**Layer 2: Type Assertion Tests (Compile-Time Safety)**
```typescript
// NEW pattern using Vitest expectTypeOf (built-in since 4.x)
import { defineEngineConfig } from '@pikacss/core'
import { reset } from '@pikacss/plugin-reset'
import { describe, expectTypeOf, it } from 'vitest'

describe('plugin-reset types', () => {
	it('should augment EngineConfig with reset property', () => {
		const config = defineEngineConfig({
			plugins: [reset()],
			reset: 'normalize'  // Should type-check
		})

		// Verify type exists and has correct values
		expectTypeOf(config).toHaveProperty('reset')
		expectTypeOf(config.reset).toEqualTypeOf<'modern-normalize' | 'normalize' | 'andy-bell' | 'eric-meyer' | 'the-new-css-reset' | undefined>()
	})

	it('should reject invalid reset values', () => {
		// This should cause a type error (caught by expectTypeOf)
		expectTypeOf({ 
			plugins: [reset()],
			// @ts-expect-error - invalid value
			reset: 'invalid-reset'
		}).not.toMatchTypeOf(defineEngineConfig)
	})
})
```

**Layer 3: External Consumer Tests (Real-World Validation)**
```typescript
// NEW pattern: Test as external npm consumer
// packages/plugin-reset/tests/integration.test.ts
import { exec } from 'node:child_process'
import { promisify } from 'node:util'
import { describe, expect, it } from 'vitest'

const execAsync = promisify(exec)

describe('plugin-reset external consumer', () => {
	it('should work when installed from npm tarball', async () => {
		// 1. Pack plugin as tarball
		await execAsync('pnpm pack', { cwd: './packages/plugin-reset' })
		
		// 2. Create test consumer project
		const testDir = './test-consumer'
		await execAsync(`mkdir -p ${testDir}`)
		await execAsync('pnpm init', { cwd: testDir })
		
		// 3. Install from tarball
		await execAsync(`pnpm add ../plugin-reset/*.tgz @pikacss/core`, { cwd: testDir })
		
		// 4. Verify types work
		const testFile = `
			import { defineEngineConfig } from '@pikacss/core'
			import { reset } from '@pikacss/plugin-reset'
			
			export default defineEngineConfig({
				plugins: [reset()],
				reset: 'normalize'  // Should type-check
			})
		`
		// Write and type-check test file
		// ... implementation details
	}, { timeout: 30000 })
})
```

### Pattern 3: Progressive Documentation Depth

**What:** Adjust documentation detail level based on plugin complexity

**When to use:** Balancing completeness vs maintainability

**Simple plugin (reset):**
```markdown
# README structure (111 lines)
## Installation
## Quick Start (minimal config)
## Features (bullet list)
## Usage
  ### Available Reset Styles (simple list)
  ### Basic Usage (default config)
  ### Choose Different Reset (config example)
## Reset Styles Comparison (brief descriptions)
## Configuration (single table)
```

**Complex plugin (icons):**
```markdown
# README structure (316 lines)
## Installation
## Quick Start (3 usage methods shown)
## Features (detailed bullet list)
## Usage
  ### Basic Icon Usage (3 methods)
  ### Supported Icon Collections (with examples)
  ### Usage Examples (5+ scenarios)
  ### Icon Syntax (pattern breakdown)
  ### Icon Rendering Modes (auto/mask/bg)
  ### Customizing Icon Size and Color
## Configuration
  ### Standard plugin pattern example
  ### Available Options (full interface)
  ### Custom Icon Prefix
  ### Custom Icon Scale
## How It Works (4-step process)
## Performance (4 optimization points)
```

**Why this works:** Simple plugins (reset) have straightforward APIs - concise docs prevent bloat. Complex plugins (icons) have many features - detailed docs prevent confusion.

### Anti-Patterns to Avoid

- **No module augmentation in docs:** Showing plugin usage without explaining how types extend is incomplete
- **Runtime-only tests:** Plugin may work but break autocomplete/IntelliSense
- **Workspace-only testing:** Symlinked dependencies hide real npm install issues
- **Uniform documentation depth:** Treating all plugins the same wastes space (simple) or omits details (complex)
- **Forgetting plugin function call:** Documentation showing `plugins: [reset]` instead of `plugins: [reset()]`

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Type testing | Custom TypeScript compilation | Vitest `expectTypeOf` (built-in 4.x) | expectTypeOf provides rich assertions, integrates with test suite, no extra setup |
| External consumer testing | Manual npm publish/install | `pnpm pack` + temporary install | Pack creates real tarball without publishing, safe for testing |
| API extraction | Custom AST parsing | TypeScript Compiler API (Phase 3) | Compiler API is authoritative, handles all edge cases, already integrated |
| Module augmentation verification | Manual inspection | Type assertion tests + tsc --noEmit | Automated verification catches regressions, CI-friendly |

**Key insight:** Type testing historically required separate tools (tsd, dtslint), but Vitest 4.x includes `expectTypeOf` natively. Use the built-in solution.

## Common Pitfalls

### Pitfall 1: Module Augmentation Not Loading

**What goes wrong:** TypeScript doesn't recognize augmented properties on `EngineConfig`

**Why it happens:** 
- Module augmentation in separate file not imported
- `declare module` not at top level
- Wrong module name (e.g., `@pikacss/plugin-reset` instead of `@pikacss/core`)

**How to avoid:**
- Put `declare module '@pikacss/core'` in same file as plugin export
- Ensure module augmentation is top-level (not inside function/class)
- Always augment `@pikacss/core` not plugin's own module

**Warning signs:**
- TypeScript error: Property 'icons' does not exist on type 'EngineConfig'
- No autocomplete for plugin config options
- Tests pass but IDE shows errors

**Verification:**
```typescript
// Test that augmentation loaded
import type { EngineConfig } from '@pikacss/core'
import '@pikacss/plugin-icons'  // Import triggers augmentation

const config: EngineConfig = {
	icons: { prefix: 'i-' }  // Should not error
}
```

### Pitfall 2: Testing Only in Monorepo Workspace

**What goes wrong:** Plugin works in workspace but fails when consumers install from npm

**Why it happens:**
- Workspace uses symlinks, hiding issues with package exports
- Dependency resolution differs (workspace protocol vs npm registry)
- Type definitions not included in published package

**How to avoid:**
- Test with `pnpm pack` + install from tarball
- Verify `dist/` contains all necessary `.d.ts` files
- Check `package.json` exports match actual build output
- Run `pnpm publint` to catch export issues

**Warning signs:**
- Tests pass in workspace but external projects report "cannot find module"
- Types work in workspace but not for consumers
- Built package missing `.d.mts` or `.d.cts` files

**Verification:**
```bash
# Build and pack plugin
cd packages/plugin-icons
pnpm build
pnpm pack

# Create test consumer
mkdir /tmp/test-consumer
cd /tmp/test-consumer
pnpm init
pnpm add /path/to/pikacss/packages/plugin-icons/*.tgz

# Verify imports work
echo "import { icons } from '@pikacss/plugin-icons'" > test.ts
tsc --noEmit test.ts  # Should not error
```

### Pitfall 3: Missing Multi-Plugin Type Interaction

**What goes wrong:** Two plugins independently work but conflict when used together

**Why it happens:**
- Both plugins augment same interface property with incompatible types
- Plugins add shortcuts with same names but different behavior
- Order-dependent initialization not documented

**How to avoid:**
- Test common plugin combinations (icons + typography, reset + typography)
- Document known conflicts in plugin README
- Use TypeScript's `&` intersection types carefully in augmentation

**Warning signs:**
- TypeScript error: Types of property 'X' are incompatible
- One plugin's shortcuts override another's
- Different behavior based on plugin registration order

**Verification:**
```typescript
// Test multi-plugin scenario
import { createEngine } from '@pikacss/core'
import { icons } from '@pikacss/plugin-icons'
import { typography } from '@pikacss/plugin-typography'
import { reset } from '@pikacss/plugin-reset'

const engine = await createEngine({
	plugins: [reset(), icons(), typography()],
	reset: 'normalize',
	icons: { prefix: 'i-' },
	typography: { variables: { /* ... */ } }
})

// All three configs should be recognized
```

### Pitfall 4: Incomplete Module Augmentation Examples

**What goes wrong:** Documentation shows `declare module` but not actual usage

**Why it happens:**
- Copy-pasting type declaration without context
- Assuming users understand TypeScript declaration merging
- Not showing how augmentation enables IntelliSense

**How to avoid:**
- Show complete workflow: 1) declaration, 2) plugin registration, 3) config usage
- Include "before/after" comparison (with vs without augmentation)
- Demonstrate autocomplete benefit explicitly

**Warning signs:**
- Users report "how do I actually use this?"
- GitHub issues asking if types work
- Examples only show type declaration, not usage

**Complete example pattern:**
```typescript
// BAD: Only shows declaration
declare module '@pikacss/core' {
	interface EngineConfig {
		myOption?: string
	}
}

// GOOD: Shows declaration + usage + benefit
// Step 1: Plugin declares augmentation (in plugin source)
declare module '@pikacss/core' {
	interface EngineConfig {
		myOption?: 'a' | 'b' | 'c'  // Specific types enable autocomplete
	}
}

// Step 2: Register plugin
export default defineEngineConfig({
	plugins: [myPlugin()],
	
	// Step 3: Use augmented config - TypeScript provides autocomplete and validation
	myOption: 'a'  // ✅ Autocomplete shows 'a' | 'b' | 'c'
	// myOption: 'invalid'  // ❌ TypeScript error
})
```

## Code Examples

Verified patterns from PikaCSS source code:

### Complete Plugin with Module Augmentation

```typescript
// Source: packages/plugin-reset/src/index.ts
import type { EnginePlugin } from '@pikacss/core'
import { defineEnginePlugin } from '@pikacss/core'

// 1. Define plugin-specific types
export type ResetStyle = 'modern-normalize' | 'normalize' | 'andy-bell' | 'eric-meyer' | 'the-new-css-reset'

// 2. Augment core config interface
declare module '@pikacss/core' {
	interface EngineConfig {
		/**
		 * Reset style to use.
		 * @default 'modern-normalize'
		 */
		reset?: ResetStyle
	}
}

// 3. Implement plugin
export function reset(): EnginePlugin {
	let style: ResetStyle = 'modern-normalize'
	return defineEnginePlugin({
		name: 'reset',
		order: 'pre',  // Run before other plugins
		configureRawConfig: (config) => {
			if (config.reset)  // config.reset is type-safe
				style = config.reset
		},
		configureEngine: async (engine) => {
			// Plugin logic here
		}
	})
}
```

### Functional Test Pattern (Runtime Verification)

```typescript
// Source: packages/plugin-typography/tests/typography.test.ts
import { createEngine } from '@pikacss/core'
import { describe, expect, it } from 'vitest'
import { typography } from '../src'

describe('plugin-typography', () => {
	it('should add prose shortcut and variables', async () => {
		const engine = await createEngine({
			plugins: [typography()],
		})

		// Test shortcut exists and works
		const ids = await engine.use('prose')
		const css = await engine.renderAtomicStyles(true, { atomicStyleIds: ids })

		expect(css).toContain('color: var(--pk-prose-color-body)')
		expect(css).toContain('max-width: 65ch')

		// Test variables registered
		const preflights = await engine.renderPreflights(true)
		expect(preflights).toContain('--pk-prose-color-body: currentColor')
	})

	it('should support custom variables', async () => {
		const engine = await createEngine({
			plugins: [typography()],
			typography: {  // Module augmentation makes this type-safe
				variables: {
					'--pk-prose-color-body': '#333',
				},
			},
		})

		await engine.use('prose')
		const preflights = await engine.renderPreflights(true)
		expect(preflights).toContain('--pk-prose-color-body: #333')
	})
})
```

### Type Assertion Test Pattern (Compile-Time Verification)

```typescript
// NEW: Using Vitest 4.x expectTypeOf
import { defineEngineConfig } from '@pikacss/core'
import { typography } from '@pikacss/plugin-typography'
import { describe, expectTypeOf, it } from 'vitest'

describe('plugin-typography types', () => {
	it('should augment EngineConfig with typography property', () => {
		const config = defineEngineConfig({
			plugins: [typography()],
			typography: {
				variables: {
					'--pk-prose-color-body': '#333',
				}
			}
		})

		// Verify property exists with correct type
		expectTypeOf(config).toHaveProperty('typography')
		expectTypeOf(config.typography).toMatchTypeOf<{
			variables?: Partial<Record<string, string>>
		} | undefined>()
	})

	it('should enforce correct variable keys', () => {
		// Valid config
		const validConfig = {
			plugins: [typography()],
			typography: {
				variables: {
					'--pk-prose-color-body': '#333',  // Valid CSS variable
				}
			}
		}
		expectTypeOf(validConfig).toMatchTypeOf(defineEngineConfig)

		// Invalid config would be caught at type level
		// (no runtime test needed - TypeScript enforces)
	})
})
```

### Multi-Plugin Test Pattern (Selective Combinations)

```typescript
// Test only known conflict scenarios, not exhaustive permutations
import { createEngine } from '@pikacss/core'
import { icons } from '@pikacss/plugin-icons'
import { reset } from '@pikacss/plugin-reset'
import { typography } from '@pikacss/plugin-typography'
import { describe, expect, it } from 'vitest'

describe('multi-plugin combinations', () => {
	it('should work with all three plugins together', async () => {
		const engine = await createEngine({
			plugins: [
				reset(),      // Adds preflights
				icons(),      // Adds shortcuts
				typography(), // Adds shortcuts + variables
			],
			reset: 'normalize',
			icons: { prefix: 'i-' },
			typography: {
				variables: { '--pk-prose-color-body': '#333' }
			}
		})

		// Verify each plugin's functionality
		const resetCss = await engine.renderPreflights(false)
		expect(resetCss).toContain('line-height: 1.15') // from reset

		const proseIds = await engine.use('prose')
		const proseCss = await engine.renderAtomicStyles(true, { atomicStyleIds: proseIds })
		expect(proseCss).toContain('--pk-prose-color-body') // from typography

		// Icons are dynamic, verify pattern works
		const iconIds = await engine.use('i-mdi:home')
		expect(iconIds.length).toBeGreaterThan(0)
	})

	it('should handle plugin execution order correctly', async () => {
		const engine = await createEngine({
			plugins: [
				reset(),      // order: 'pre'
				typography(), // order: undefined (normal)
			],
		})

		// Reset should inject preflights before typography's variables
		const preflights = await engine.renderPreflights(true)
		const resetIndex = preflights.indexOf('box-sizing: border-box')
		const typoIndex = preflights.indexOf('--pk-prose-color-body')
		
		expect(resetIndex).toBeLessThan(typoIndex)
	})
})
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| tsd for type testing | Vitest expectTypeOf | Vitest 4.0 (2024) | No separate tool needed, unified test suite |
| Documentation.js | TypeScript Compiler API | N/A (always TS-focused) | Better TypeScript type extraction |
| npm publish for testing | pnpm pack + tarball install | N/A (pnpm pattern) | Safe testing without registry pollution |
| Manual type checking | CI type assertion tests | Monorepo standard | Catches type regressions automatically |

**Deprecated/outdated:**
- **tsd (type testing):** Separate tool, doesn't integrate with Vitest - use `expectTypeOf` instead
- **dtslint (DefinitelyTyped):** Deprecated in favor of tsd/expectTypeOf
- **Manual module augmentation verification:** Now testable via expectTypeOf

## Open Questions

Things that couldn't be fully resolved:

1. **IntelliSense verification documentation**
   - What we know: User marked as "Claude's discretion" in CONTEXT.md
   - What's unclear: Whether to include step-by-step IDE screenshots/instructions
   - Recommendation: Include text-based verification instructions (e.g., "Start typing `icons:` in config object and verify autocomplete appears") but skip screenshots (high maintenance cost, low value)

2. **Test environment isolation strategy**
   - What we know: User marked as "Claude's discretion" - workspace vs external install
   - What's unclear: Whether every plugin needs full external consumer test or selective
   - Recommendation: Use workspace tests for primary coverage, add external consumer test only for plugin-icons (most complex, highest user-facing risk)

3. **Multi-plugin testing scope**
   - What we know: User decided "selective" - only test known conflicts
   - What's unclear: What are the "known potential conflicts"?
   - Recommendation: Test these combinations only: (reset + typography), (icons + typography), (all three together). Skip: (reset + icons) - no known interaction points.

## Sources

### Primary (HIGH confidence)
- PikaCSS source code: `packages/plugin-*/src/index.ts` - Module augmentation patterns
- PikaCSS source code: `packages/plugin-*/tests/*.test.ts` - Existing test patterns
- PikaCSS AGENTS.md lines 217-239 - Official module augmentation documentation
- Vitest documentation: Built-in `expectTypeOf` API (https://vitest.dev/api/expect-typeof.html)
- TypeScript Compiler API documentation - API extraction methods

### Secondary (MEDIUM confidence)
- Phase 3 RESEARCH.md - API verification infrastructure patterns
- Phase 4 RESEARCH.md - Documentation correction workflow
- package.json - Vitest 4.0.16 confirmed installed

### Tertiary (LOW confidence)
- None - All findings verified with codebase

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - All tools already installed and in use
- Architecture: HIGH - Patterns derived from actual PikaCSS plugin code
- Pitfalls: HIGH - Based on TypeScript module augmentation known issues + PikaCSS patterns

**Research date:** 2026-02-05
**Valid until:** 2026-03-07 (30 days - stable domain, minimal API churn)
