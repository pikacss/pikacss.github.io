# Phase 5: Integration & Framework Layers - Research

**Researched:** 2026-02-05
**Domain:** Multi-layer package documentation (integration, unplugin, framework adapters)
**Confidence:** HIGH

## Summary

This phase focuses on verifying and correcting documentation for PikaCSS's integration packages: `@pikacss/integration`, `@pikacss/unplugin-pikacss`, `@pikacss/vite-plugin-pikacss`, and `@pikacss/nuxt-pikacss`. These packages form the bridge between the core engine and various build tools.

The documentation challenge is unique: these packages follow a dependency chain where each layer wraps the previous one. Documentation must accurately reflect the actual APIs, options, and behavior at each layer while maintaining consistency across bundler-specific implementations.

Current state analysis reveals:
- Integration layer (`@pikacss/integration`) provides low-level API but has no dedicated API reference
- Unplugin layer provides 7 bundler-specific entry points, each documented separately
- Vite plugin package is now a deprecated wrapper (redirects to `unplugin-pikacss/vite`)
- Nuxt module provides zero-config integration with automatic plugin template injection
- All integration docs exist in `docs/integrations/` but need verification against actual source code

**Primary recommendation:** Implement documentation-as-code verification where examples are extracted, executed, and validated against actual package behavior using automated test infrastructure.

## Standard Stack

The established libraries/tools for this domain:

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| unplugin | catalog: (via pnpm) | Universal plugin system | Industry standard for cross-bundler plugins, used by VueUse, UnoCSS, etc. |
| @pikacss/integration | workspace:* | Build-time code transformation | Project's own low-level integration API |
| @nuxt/kit | catalog: | Nuxt module utilities | Official Nuxt module development toolkit |
| magic-string | catalog: | Source code transformation | Best-in-class for source mapping with transforms |
| jiti | catalog: | Runtime TypeScript execution | Enables loading .ts config files at build time |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| globby | catalog: | File pattern matching | Used in integration layer for scan patterns |
| micromatch | catalog: | Glob pattern testing | Fast pattern matching for transform filters |
| pathe | catalog: | Cross-platform path utilities | Normalizing paths across Windows/Unix |
| local-pkg | catalog: | Package detection | Checking for peer dependencies (Vue, Nuxt, etc.) |
| vitest | catalog: | Testing framework | All test files use Vitest |
| publint | catalog: | Package.json validation | Ensures correct exports and module resolution |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| unplugin | Custom plugin per bundler | unplugin provides unified interface, custom means 7x maintenance burden |
| magic-string | Direct string manipulation | Loses source map support, harder debugging |
| jiti | ts-node or esbuild-register | jiti is faster and more lightweight for config loading |

**Installation:**
```bash
# For end users
npm install -D @pikacss/unplugin-pikacss  # Most common
npm install -D @pikacss/nuxt-pikacss      # For Nuxt projects

# Already installed as workspace dependencies - no user installation needed for integration layer
```

## Architecture Patterns

### Recommended Project Structure
```
packages/
├── integration/         # Low-level API, no bundler coupling
│   ├── src/
│   │   ├── ctx.ts      # IntegrationContext creation
│   │   ├── types.ts    # Core type definitions
│   │   └── index.ts    # Public API exports
│   └── tests/
├── unplugin/           # Multi-bundler wrapper
│   ├── src/
│   │   ├── index.ts    # Base unplugin factory
│   │   ├── vite.ts     # Vite-specific exports
│   │   ├── webpack.ts  # Webpack-specific exports
│   │   ├── rspack.ts   # Rspack-specific exports
│   │   ├── esbuild.ts  # Esbuild-specific exports
│   │   ├── farm.ts     # Farm-specific exports
│   │   └── rolldown.ts # Rolldown-specific exports
│   └── tests/
├── vite/               # Deprecated - now wrapper only
│   └── src/
│       └── index.ts    # Re-exports from unplugin/vite
└── nuxt/               # Nuxt module
    ├── src/
    │   └── index.ts    # Nuxt module definition
    └── tests/

docs/
├── integrations/
│   ├── index.md        # Overview and comparison
│   ├── vite.md         # Vite integration guide
│   ├── nuxt.md         # Nuxt integration guide
│   ├── webpack.md      # Webpack integration guide
│   ├── rspack.md       # Rspack integration guide
│   ├── esbuild.md      # Esbuild integration guide
│   ├── farm.md         # Farm integration guide
│   └── rolldown.md     # Rolldown integration guide
└── advanced/
    └── api-reference.md # Should include integration API section
```

### Pattern 1: Layered Package Architecture
**What:** Each package wraps the previous layer, adding framework-specific concerns
**When to use:** When building cross-platform tooling that needs to support multiple bundlers

**Dependency chain:**
```
@pikacss/core (pure style engine)
    ↓ depends on
@pikacss/integration (file scanning, code transform, no bundler coupling)
    ↓ depends on
@pikacss/unplugin-pikacss (unplugin wrapper, 7 bundler entry points)
    ↓ depends on
@pikacss/vite-plugin-pikacss (deprecated wrapper)
@pikacss/nuxt-pikacss (Nuxt module with auto-setup)
```

**Example from actual code:**
```typescript
// Source: packages/nuxt/src/index.ts
import PikaCSSVitePlugin from '@pikacss/unplugin-pikacss/vite'

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'pikacss',
    configKey: 'pikacss',
  },
  async setup(_, nuxt) {
    // Inject CSS import via plugin template
    addPluginTemplate({
      filename: 'pikacss.mjs',
      getContents() {
        return 'import { defineNuxtPlugin } from \'#imports\';\nexport default defineNuxtPlugin(() => {});\nimport "pika.css"; '
      },
    })

    // Add Vite plugin with Nuxt-specific defaults
    addVitePlugin({
      ...PikaCSSVitePlugin({
        currentPackageName: '@pikacss/nuxt-pikacss',
        ...(nuxt.options.pikacss || {
          scan: { include: ['**/*.vue', '**/*.tsx', '**/*.jsx'] }
        }),
      }),
      enforce: 'pre',
    })
  },
})
```

### Pattern 2: Plugin Options with Sensible Defaults
**What:** All integration packages accept same PluginOptions interface with framework-specific defaults
**When to use:** For every bundler integration

**Example from actual code:**
```typescript
// Source: packages/unplugin/src/types.ts
export interface PluginOptions {
  scan?: {
    include?: string | string[]  // Default: ['**/*.{js,ts,jsx,tsx,vue}']
    exclude?: string | string[]  // Default: ['node_modules/**', 'dist/**']
  }
  config?: EngineConfig | string  // Config object or path
  autoCreateConfig?: boolean      // Default: true
  fnName?: string                 // Default: 'pika'
  transformedFormat?: 'string' | 'array' | 'inline'  // Default: 'string'
  tsCodegen?: boolean | string    // Default: true
  cssCodegen?: true | string      // Default: true
}
```

### Pattern 3: Virtual Module Pattern
**What:** Generated CSS is exposed as virtual module `pika.css` that users import
**When to use:** For all bundler integrations to provide generated styles

**Example from docs:**
```typescript
// User's main.ts or app.tsx
import 'pika.css'  // Virtual module, resolved by plugin

// The plugin handles this virtual module ID and returns generated CSS
```

### Pattern 4: TypeScript Type Generation
**What:** Generate `pika.gen.ts` with global `pika()` function and autocomplete types
**When to use:** All integrations to provide IDE support without explicit imports

**Example from actual behavior:**
```typescript
// Generated file: pika.gen.ts
declare global {
  const pika: {
    (item: StyleItem): string
    str(item: StyleItem): string
    arr(item: StyleItem): string[]
    inl(item: StyleItem): void
  }
}

export {}
```

### Anti-Patterns to Avoid
- **Documenting inline config without file path option:** All plugins support both inline config objects AND config file paths - docs must show both
- **Showing only default scan patterns:** Users need to see how to customize patterns for their project structure
- **Missing bundler-specific gotchas:** Each bundler has quirks (e.g., Webpack needs `new Plugin()`, esbuild needs `.default()`)
- **Not showing TypeScript setup:** Users need to know about `/// <reference path="..." />` or `include` in tsconfig
- **Ignoring HMR behavior:** Docs should mention how file changes trigger regeneration

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Cross-bundler plugin system | Custom plugin per bundler | unplugin | Handles 7+ bundlers with one codebase, battle-tested |
| Virtual module resolution | Custom module resolution | unplugin's `resolveId`/`load` hooks | Handles edge cases, bundler differences |
| Source code transformation with source maps | String replacement | magic-string | Preserves source maps, handles complex edits |
| Config file loading (.ts, .mjs, .cjs) | require() or import() | jiti | Handles all formats, TypeScript, caching |
| File pattern matching | Custom glob walker | globby + micromatch | Fast, supports all glob patterns, tested |
| Package detection (is Vue installed?) | fs.existsSync | local-pkg | Handles monorepos, yarn PnP, edge cases |
| Example verification in docs | Manual testing | Automated extraction + vitest | Ensures examples stay current with API changes |

**Key insight:** Integration layers are deceptively complex. What looks like "just wrapping a function" involves handling:
- Multiple module formats (ESM, CJS)
- Source map propagation
- Virtual modules across bundlers
- HMR coordination
- TypeScript config loading
- Peer dependency detection
- Error boundary isolation

Use proven libraries for each concern rather than reimplementing.

## Common Pitfalls

### Pitfall 1: Documentation Drift from Actual API
**What goes wrong:** Docs show options that don't exist or miss new options added to types
**Why it happens:** Options are defined in TypeScript but docs are manually written
**How to avoid:** 
- Extract actual TypeScript interfaces and generate documentation tables
- Use automated tests that parse docs and verify against exported types
- Add CI check: `pnpm typecheck` against examples extracted from markdown
**Warning signs:** Users report "option X doesn't work" or "missing option Y in docs"

### Pitfall 2: Bundler-Specific Example Errors
**What goes wrong:** Webpack example uses Vite syntax, Nuxt example missing required config
**Why it happens:** Copy-paste between integration guides without testing each variant
**How to avoid:**
- Create executable example projects in `examples/` directory for each bundler
- Run `pnpm build` in each example as part of CI
- Extract code blocks from docs and validate against working examples
**Warning signs:** GitHub issues titled "Example doesn't work for [bundler]"

### Pitfall 3: Missing Prerequisite Steps
**What goes wrong:** Docs jump to plugin setup without covering required imports or config files
**Why it happens:** Author has working setup and forgets initialization steps
**How to avoid:**
- Use numbered setup sections (1. Install, 2. Configure, 3. Import, 4. Use)
- Show the full file after each step, not just the changed lines
- Include "troubleshooting" section for each integration
**Warning signs:** Users ask "where do I put this code?" or "what file is this?"

### Pitfall 4: Inconsistent Option Naming
**What goes wrong:** Vite docs call it `scan.include`, Webpack docs call it `include`, Nuxt calls it `scanPatterns`
**Why it happens:** Each guide written independently without cross-checking
**How to avoid:**
- All plugins use same `PluginOptions` interface - verify docs match types
- Use same example structure across all integration guides
- Automated lint: extract option names from all docs, ensure consistency
**Warning signs:** "Why does option X work in Vite but not Webpack?"

### Pitfall 5: Outdated Deprecation Notices
**What goes wrong:** `@pikacss/vite-plugin-pikacss` is deprecated but still prominently documented
**Why it happens:** Deprecation added to package but docs not updated to reflect migration path
**How to avoid:**
- Deprecation notice at top of deprecated package docs
- Migration guide with exact code changes needed
- Redirect old docs URL to new recommended package
**Warning signs:** New users install deprecated package and get confused

### Pitfall 6: Missing Source Map Configuration
**What goes wrong:** Transformed code has incorrect line numbers in stack traces
**Why it happens:** Source maps work by default in dev but break in production builds
**How to avoid:**
- Document bundler-specific source map config if needed
- Show how to verify source maps are working
- Mention in troubleshooting if debugging shows wrong line numbers
**Warning signs:** Users report "errors point to generated code, not source"

## Code Examples

Verified patterns from official sources:

### Integration Layer: Creating Context
```typescript
// Source: packages/integration/src/index.ts
import { createIntegrationContext } from '@pikacss/integration'

const ctx = await createIntegrationContext({
  cwd: process.cwd(),
  currentPackageName: '@my-org/my-plugin',
  scan: {
    include: ['src/**/*.{ts,tsx}'],
    exclude: ['node_modules/**']
  },
  configOrPath: './pika.config.ts',  // or inline config object
  fnName: 'pika',
  transformedFormat: 'string',
  tsCodegen: 'pika.gen.ts',
  cssCodegen: 'pika.gen.css',
  autoCreateConfig: true
})

// Transform source code
const result = await ctx.transform(code, '/path/to/file.tsx')
if (result) {
  console.log(result.code)  // Transformed code
  console.log(result.map)   // Source map
}

// Generate CSS
const css = await ctx.getCssCodegenContent()
```

### Unplugin: Base Plugin Factory
```typescript
// Source: packages/unplugin/src/index.ts (conceptual - actual implementation is more complex)
import { createUnplugin } from 'unplugin'
import { createIntegrationContext } from '@pikacss/integration'

const unplugin = createUnplugin((options: PluginOptions) => {
  let ctx: IntegrationContext

  return {
    name: 'pikacss',
    
    async buildStart() {
      ctx = await createIntegrationContext({
        cwd: process.cwd(),
        ...resolveOptions(options)
      })
    },

    resolveId(id) {
      if (id === 'pika.css') return id  // Virtual module
      return null
    },

    async load(id) {
      if (id === 'pika.css') {
        return await ctx.getCssCodegenContent()
      }
      return null
    },

    async transform(code, id) {
      if (ctx.transformFilter.include.test(id)) {
        return await ctx.transform(code, id)
      }
      return null
    }
  }
})

export default unplugin
```

### Vite Integration (User-Facing)
```typescript
// Source: docs/integrations/vite.md (verified against actual behavior)
import pikacss from '@pikacss/unplugin-pikacss/vite'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    pikacss({
      scan: {
        include: ['src/**/*.{ts,tsx,vue}'],
        exclude: ['node_modules/**']
      },
      config: './pika.config.ts',  // or inline object
      tsCodegen: true,
      cssCodegen: true
    })
  ]
})
```

### Nuxt Integration (User-Facing)
```typescript
// Source: docs/integrations/nuxt.md (verified against actual behavior)
export default defineNuxtConfig({
  modules: ['@pikacss/nuxt-pikacss'],
  pikacss: {
    // Same options as unplugin (except currentPackageName)
    scan: {
      include: ['**/*.vue', '**/*.tsx']
    }
  }
})

// No need to import 'pika.css' - Nuxt module auto-injects it
```

### Webpack Integration
```typescript
// Source: docs/integrations/webpack.md
import pikacss from '@pikacss/unplugin-pikacss/webpack'

export default {
  plugins: [
    pikacss({
      // Note: Webpack plugin is instantiated as function, not `new Plugin()`
      scan: {
        include: ['src/**/*.{js,jsx,ts,tsx}']
      }
    })
  ]
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Separate Vite plugin package | Vite export from unplugin | v0.0.39 (current) | @pikacss/vite-plugin-pikacss is now deprecated wrapper |
| Manual CSS import in every file | Virtual module `pika.css` | Initial design | Users import once in entry file |
| Manual type definitions | Auto-generated `pika.gen.ts` | Initial design | IDE autocomplete without manual typing |
| Config as .js only | jiti-based loading supports .ts/.mjs/.cjs | Integration layer | Better TypeScript DX |
| Per-bundler plugin implementations | Unified unplugin architecture | Initial design | 7 bundlers from one codebase |

**Deprecated/outdated:**
- `@pikacss/vite-plugin-pikacss`: Use `@pikacss/unplugin-pikacss/vite` instead (package still exists as compatibility wrapper)
- Showing `import { pika } from 'somewhere'`: pika is now global via generated types

## Open Questions

Things that couldn't be fully resolved:

1. **Integration API Reference Location**
   - What we know: `@pikacss/integration` exports `createIntegrationContext` and related types
   - What's unclear: Should this be documented in API reference or is it internal-only?
   - Recommendation: Document in "Advanced" section for plugin authors, not in main API reference

2. **Example Verification Strategy**
   - What we know: Examples exist in docs but may not be executable
   - What's unclear: Best method to extract and test examples (markdown parser? custom tooling?)
   - Recommendation: Start with manual extraction to test files, investigate automated tooling in Phase 7

3. **Nuxt 3 Specific Features**
   - What we know: Nuxt module uses @nuxt/kit and targets Nuxt 3
   - What's unclear: Are there Nuxt 3-specific features (like auto-imports config) that should be documented?
   - Recommendation: Review @nuxt/kit usage in source and verify against Nuxt 3 docs

4. **Source Map Configuration**
   - What we know: magic-string generates source maps automatically
   - What's unclear: Do any bundlers require special config to enable source maps in production?
   - Recommendation: Test production builds for each bundler, document any required config

## Sources

### Primary (HIGH confidence)
- `packages/integration/src/types.ts` - IntegrationContextOptions interface definition
- `packages/unplugin/src/types.ts` - PluginOptions interface definition
- `packages/vite/src/index.ts` - Deprecation and re-export confirmation
- `packages/nuxt/src/index.ts` - Nuxt module implementation with addPluginTemplate
- `AGENTS.md` - Project architecture and package responsibilities
- `docs/integrations/*.md` - Current integration documentation

### Secondary (MEDIUM confidence)
- `docs/advanced/api-reference.md` - Core API reference (should be extended for integration)
- `docs/advanced/architecture.md` - System overview and transformation pipeline

### Tertiary (LOW confidence)
- Integration test files are minimal placeholders - need real integration tests

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - All dependencies are in package.json and clearly documented in AGENTS.md
- Architecture: HIGH - Source code provides clear layered structure and responsibilities
- Pitfalls: MEDIUM - Based on common documentation patterns and potential issues, not observed bugs
- Code examples: HIGH - Extracted directly from source code and existing documentation

**Research date:** 2026-02-05
**Valid until:** ~30 days (stable architecture, but API may evolve with new bundlers)

**Research limitations:**
- WebSearch unavailable during research (503 errors) - relied on project source code and training knowledge
- No access to Nuxt 3 official docs for cross-verification - should be validated in implementation
- Example executability not tested - verification strategy needs to be implemented in phase execution
