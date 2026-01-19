# PikaCSS Package Architecture

## Monorepo Overview

**Version Management**: Unified versioning for all packages (currently 0.0.39)
**Workspace Tool**: pnpm with workspace protocol (`workspace:*`)
**Build Tool**: tsdown
**Test Framework**: Vitest

## Layered Architecture

```
┌─────────────────────────────────────────────────────┐
│  Framework Layer                                    │
│  @pikacss/nuxt-pikacss                             │
│  → Nuxt integration with style compilation         │
├─────────────────────────────────────────────────────┤
│  Unplugin Layer (Multi-bundler support)            │
│  @pikacss/unplugin-pikacss                         │
│  @pikacss/vite-plugin-pikacss                      │
│  → Universal bundler plugin system                 │
├─────────────────────────────────────────────────────┤
│  Integration Layer (Build-time tools)              │
│  @pikacss/integration                              │
│  → Scan, evaluate, transform code at build time    │
├─────────────────────────────────────────────────────┤
│  Core Layer (Style engine)                         │
│  @pikacss/core                                     │
│  → Parse styles, execute plugins, generate CSS     │
│                                                     │
│  Official Plugins                                  │
│  @pikacss/plugin-icons                            │
│  @pikacss/plugin-reset                            │
│  @pikacss/plugin-typography                       │
└─────────────────────────────────────────────────────┘
```

## Core Responsibilities

### @pikacss/core (Zero external dependencies)

The heart of the system. Never depends on build tools.

**Responsibilities**:
- Parse style definition objects
- Execute plugin hooks
- Generate atomic styles, preflights, shortcuts, selectors
- Manage style output and TypeScript types
- Provide complete TypeScript type definitions

**Key Interfaces**:
- `Engine` - Main style processing engine
- `EnginePlugin` - Plugin system interface
- `StyleDefinition` - User-provided style object
- `EngineConfig` - Configuration interface

**Scope**: Style processing logic only. No filesystem or bundler concerns.

### @pikacss/integration (Low-level build tools)

Bridges core engine with build systems.

**Responsibilities**:
- Scan source code for `pika()` calls using RegExp
- Evaluate `pika()` arguments at build time using `new Function()`
- Transform source code to replace calls with generated class names
- Generate `pika.gen.css` (atomic styles)
- Generate `pika.gen.ts` (TypeScript definitions)
- Provide low-level API for plugin developers

**Key Functions**:
- `scanSource()` - Find pika() calls
- `evaluateArguments()` - Build-time evaluation
- `generateCode()` - Output transformation

**Scope**: Build-time integration. No framework knowledge.

### @pikacss/unplugin-pikacss (Universal bundler support)

Wraps integration layer for all bundlers.

**Responsibilities**:
- Wrap integration layer using unplugin
- Support multiple bundlers: Vite, Webpack, Rollup, Esbuild, Rspack, Farm, Rolldown
- Handle virtual modules
- Implement HMR (hot module replacement)
- Manage plugin lifecycle

**Scope**: Bundler abstraction. No framework-specific logic.

### @pikacss/vite-plugin-pikacss (Vite-specific)

Convenience wrapper for Vite users.

**Responsibilities**:
- Re-export unplugin with Vite defaults
- Handle Vite-specific configuration

### @pikacss/nuxt-pikacss (Nuxt integration)

Framework-specific integration.

**Responsibilities**:
- Integrate with Nuxt module system
- Handle Nuxt-specific build processes
- Provide auto-import functionality

## Dependency Graph

**Build Order**: core → integration → unplugin → framework adapters

```
@pikacss/core
  ├─ Exports: Engine API
  ├─ Dependencies: csstype only
  └─ Used by: All other packages

@pikacss/integration
  ├─ Depends on: @pikacss/core
  ├─ Exports: Integration API
  └─ Used by: unplugin

@pikacss/unplugin-pikacss
  ├─ Depends on: @pikacss/integration
  ├─ Exports: Unplugin instance
  └─ Used by: vite-plugin, nuxt-pikacss

@pikacss/vite-plugin-pikacss
  └─ Depends on: @pikacss/unplugin-pikacss

@pikacss/nuxt-pikacss
  └─ Depends on: @pikacss/unplugin-pikacss

Official Plugins
  └─ All depend on: @pikacss/core only
```

## Package Relationships

### No Circular Dependencies Allowed

The dependency graph must remain acyclic. Use `pnpm --filter` to test isolated package builds.

### Internal Dependency Pattern

Always use workspace protocol:

```json
{
  "dependencies": {
    "@pikacss/core": "workspace:*"
  }
}
```

### Peer Dependencies

For plugins and frameworks, always list `@pikacss/core` as peer dependency:

```json
{
  "peerDependencies": {
    "@pikacss/core": "workspace:*"
  }
}
```

## File Organization

### Standard Package Structure

```
packages/<name>/
├── src/
│   ├── index.ts          # Main entry point
│   ├── types/            # Type definitions
│   └── utils/            # Helper functions
├── tests/
│   ├── unit/             # Pure function tests
│   ├── integration/      # Multi-module tests
│   └── e2e/             # End-to-end tests
├── dist/                 # Built output (auto-generated)
├── package.json
├── tsconfig.json
├── tsconfig.package.json
├── tsconfig.tests.json
└── README.md
```

### TypeScript Configuration

Each package has 3 tsconfig files:

- `tsconfig.json` - References package and test configs
- `tsconfig.package.json` - Code in `src/**/*`
- `tsconfig.tests.json` - Tests in `tests/**/*`

## Build-Time Evaluation Constraint

All `pika()` arguments must be statically analyzable:

```typescript
// ✅ Allowed (static)
const styles = pika({ color: 'red' })
const COLOR = 'blue'
const styles2 = pika({ color: COLOR })

// ❌ Not allowed (runtime)
function Component({ color }) {
  const styles = pika({ color }) // Error: runtime variable
}

// ✅ Solution: CSS variables
const styles = pika({ color: 'var(--color)' })
```

## Plugin Module Augmentation Pattern

Plugins extend core types via declaration merging:

```typescript
declare module '@pikacss/core' {
  interface EngineConfig {
    myPluginOption?: MyOptions
  }
  interface Shortcuts {
    myShortcut: MyShortcutDefinition
  }
}

export function myPlugin(options?: MyOptions): EnginePlugin {
  return defineEnginePlugin({
    name: 'my-plugin',
    order: 'post', // 'pre' | undefined (default) | 'post'
    async configureEngine(engine) {
      engine.registerShortcut('myShortcut', { ... })
    }
  })
}
```

## Auto-Generated Files

**Never manually edit these files**:
- `pika.gen.css` - Generated atomic styles
- `pika.gen.ts` - Generated TypeScript definitions
- `dist/**/*` - Build output from tsdown

## Monorepo Commands

### Filter Usage

```bash
# Single package
pnpm --filter @pikacss/core build

# Multiple packages
pnpm --filter @pikacss/{core,integration} test

# Exclude packages
pnpm --filter '!@pikacss/docs' build
```

### Scaffolding

```bash
pnpm newpkg [dirname] [name]       # Create new package
pnpm newplugin [name]              # Create new plugin (sets up module augmentation)
```

## Version Management

- **Current Version**: 0.0.39
- **Strategy**: Unified version for all packages
- **Tool**: bumpp
- **Release Command**: `pnpm release`

All packages maintain the same version number and are released together.
