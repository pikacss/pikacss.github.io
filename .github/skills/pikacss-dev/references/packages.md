# Package Structure & Architecture Reference

Complete guide to PikaCSS packages, their responsibilities, dependencies, and how they fit together.

## Table of Contents

- [Package Architecture](#package-architecture)
- [Package Details](#package-details)
- [Dependency Graph](#dependency-graph)
- [File Organization](#file-organization)
- [Build Order](#build-order)
- [Adding New Packages](#adding-new-packages)

---

## Package Architecture

PikaCSS uses a layered architecture with clear separation of concerns:

```
┌─────────────────────────────────────────────────────┐
│  Framework Layer                                    │
│  • @pikacss/nuxt-pikacss (Nuxt integration)       │
├─────────────────────────────────────────────────────┤
│  Bundler Layer                                      │
│  • @pikacss/vite-plugin-pikacss (Vite wrapper)    │
├─────────────────────────────────────────────────────┤
│  Universal Plugin Layer                             │
│  • @pikacss/unplugin-pikacss (Multi-bundler)      │
├─────────────────────────────────────────────────────┤
│  Build-time Integration Layer                       │
│  • @pikacss/integration (Code scanning & transform)│
├─────────────────────────────────────────────────────┤
│  Core Engine Layer                                  │
│  • @pikacss/core (Style processing)                │
│                                                     │
│  Official Plugins                                  │
│  • @pikacss/plugin-icons (Icon system)             │
│  • @pikacss/plugin-reset (CSS reset)               │
│  • @pikacss/plugin-typography (Typography)         │
└─────────────────────────────────────────────────────┘
```

---

## Package Details

### @pikacss/core

**Location**: `packages/core/`

**Purpose**: Core style processing engine - the heart of PikaCSS.

**Responsibilities**:
- Parse style definition objects
- Execute plugin hooks (pre-process, transform, post-process)
- Generate atomic CSS rules
- Manage preflights, shortcuts, selectors, and keyframes
- Provide complete TypeScript type system

**Key Features**:
- Independent from build tools (zero build tool dependencies)
- Only depends on `csstype` for CSS property types
- Exports both ESM and CJS formats
- Full TypeScript support with typed config

**When to modify**:
- Adding style processing features
- Implementing new utility systems
- Changing how atomic rules are generated
- Modifying plugin hooks or architecture
- Improving TypeScript types

**Testing**: `pnpm --filter @pikacss/core test`

**Build**: `pnpm --filter @pikacss/core build`

---

### @pikacss/integration

**Location**: `packages/integration/`

**Purpose**: Build-time tools for scanning and transforming code.

**Responsibilities**:
- Scan source code for `pika()` function calls
- Evaluate `pika()` arguments at build time using `new Function()`
- Transform source code (replace `pika()` calls with class names)
- Generate `pika.gen.css` containing all CSS output
- Generate `pika.gen.ts` with TypeScript type definitions
- Provide low-level API for plugin developers
- Handle cache invalidation and incremental builds

**Key Features**:
- Works at build time, not runtime
- Static analysis of all `pika()` calls
- Generates optimized CSS and type files
- Independent from specific bundlers

**Dependencies**: 
- `@pikacss/core` (style processing)

**When to modify**:
- Changing how code is scanned for `pika()` calls
- Modifying code transformation logic
- Altering CSS/TypeScript generation
- Implementing caching strategies
- Changing build-time evaluation

**Testing**: `pnpm --filter @pikacss/integration test`

**Build**: `pnpm --filter @pikacss/integration build`

---

### @pikacss/unplugin-pikacss

**Location**: `packages/unplugin/`

**Purpose**: Universal bundler plugin using unplugin framework.

**Responsibilities**:
- Wrap integration layer for bundler compatibility
- Support multiple bundlers:
  - Vite
  - Webpack
  - Rollup
  - Esbuild
  - Rspack
  - Farm
  - Rolldown
- Handle virtual module registration
- Implement Hot Module Replacement (HMR)
- Normalize plugin configuration across bundlers
- Provide bundler-specific optimizations

**Key Features**:
- Single plugin works in multiple bundlers via unplugin
- Automatic HMR support
- Virtual module system for generated files
- Bundler-agnostic plugin API

**Dependencies**:
- `@pikacss/integration` (build-time tools)

**Entry Points**:
- Default: ESM entry for universal use
- CJS: CommonJS for Node.js compatibility
- Framework-specific: Nuxt, Webpack, etc.

**When to modify**:
- Adding support for new bundlers
- Improving HMR behavior
- Handling bundler-specific edge cases
- Optimizing performance per bundler
- Adding virtual module handling

**Testing**: `pnpm --filter @pikacss/unplugin-pikacss test`

**Build**: `pnpm --filter @pikacss/unplugin-pikacss build`

---

### @pikacss/vite-plugin-pikacss

**Location**: `packages/vite/`

**Purpose**: Vite-specific wrapper around unplugin.

**Responsibilities**:
- Provide Vite-specific plugin interface
- Thin wrapper around unplugin
- Handle Vite plugin lifecycle
- Provide Vite configuration examples

**Key Features**:
- Simple, opinionated Vite defaults
- Better IDE support in Vite projects
- Type-safe configuration for Vite

**Dependencies**:
- `@pikacss/unplugin-pikacss` (universal plugin)

**When to modify**:
- Adding Vite-specific features
- Improving Vite integration
- Handling Vite config edge cases

**Testing**: `pnpm --filter @pikacss/vite-plugin-pikacss test`

**Build**: `pnpm --filter @pikacss/vite-plugin-pikacss build`

---

### @pikacss/nuxt-pikacss

**Location**: `packages/nuxt/`

**Purpose**: Nuxt module for seamless PikaCSS integration.

**Responsibilities**:
- Provide Nuxt module interface
- Integrate with Nuxt's build system
- Handle Nuxt-specific configuration
- Support Nuxt DevTools integration
- Provide Nuxt component examples

**Key Features**:
- Auto-imported in Nuxt projects
- Nuxt module conventions support
- DevTools integration
- Nuxt layers support

**Dependencies**:
- `@pikacss/unplugin-pikacss` (universal plugin)

**When to modify**:
- Adding Nuxt-specific features
- Improving Nuxt integration
- Supporting new Nuxt versions

**Testing**: `pnpm --filter @pikacss/nuxt-pikacss test`

**Build**: `pnpm --filter @pikacss/nuxt-pikacss build`

---

### Official Plugins

#### @pikacss/plugin-icons

**Location**: `packages/plugin-icons/`

**Purpose**: Icon system plugin providing icon utilities.

**Responsibilities**:
- Integrate with UnoCSS icon presets
- Generate icon class utilities
- Support multiple icon libraries (Material, Heroicons, etc.)
- Provide icon name validation and autocomplete

**Key Features**:
- Lazy-loaded icons (only imported icons included in CSS)
- Support for custom icon libraries
- TypeScript autocomplete for icon names

**Dependencies**:
- `@pikacss/core` (style engine)
- `@unocss/preset-icons` (icon library)

**When to modify**:
- Adding new icon library support
- Changing icon system behavior
- Improving icon name autocomplete

**Testing**: `pnpm --filter @pikacss/plugin-icons test`

---

#### @pikacss/plugin-reset

**Location**: `packages/plugin-reset/`

**Purpose**: CSS reset plugin for normalizing browser styles.

**Responsibilities**:
- Provide CSS reset ruleset
- Define preflight rules
- Support different reset philosophies (modern, classic)

**Key Features**:
- Minimal, opinionated reset
- Customizable reset rules

**Dependencies**:
- `@pikacss/core` (style engine)

**When to modify**:
- Updating CSS reset rules
- Adding new reset presets

**Testing**: `pnpm --filter @pikacss/plugin-reset test`

---

#### @pikacss/plugin-typography

**Location**: `packages/plugin-typography/`

**Purpose**: Typography plugin for semantic text utilities.

**Responsibilities**:
- Provide typography scale utilities
- Support text hierarchy (heading sizes, body, etc.)
- Handle font size and line height relationships

**Key Features**:
- Semantic typography scale
- Configurable scales
- Automatic line height calculation

**Dependencies**:
- `@pikacss/core` (style engine)

**When to modify**:
- Extending typography features
- Adding new scales
- Supporting variable fonts

**Testing**: `pnpm --filter @pikacss/plugin-typography test`

---

## Dependency Graph

```
┌─────────────────────┐
│  @pikacss/core      │  (independent, zero deps except csstype)
└──────────┬──────────┘
           │
    ┌──────┴──────┐
    │             │
    │         ┌───┴──────────────────┐
    │         │  Official Plugins    │
    │         │  • plugin-icons      │
    │         │  • plugin-reset      │
    │         │  • plugin-typography │
    │         └────────────────────────┘
    │
┌───┴────────────────┐
│ @pikacss/integration│  (depends on core)
└───┬────────────────┘
    │
┌───┴──────────────────────────┐
│ @pikacss/unplugin-pikacss    │  (depends on integration)
└───┬──────────────────────────┘
    │
    ├─ @pikacss/vite-plugin-pikacss     (Vite wrapper)
    └─ @pikacss/nuxt-pikacss            (Nuxt integration)
```

**Build order** (dependencies first):
1. `core` and plugins (no dependencies)
2. `integration` (depends on core)
3. `unplugin-pikacss` (depends on integration)
4. `vite-plugin-pikacss` (depends on unplugin)
5. `nuxt-pikacss` (depends on unplugin)

---

## File Organization

### Directory Structure

```
packages/
├── core/
│   ├── src/
│   │   ├── types/           (TypeScript type definitions)
│   │   ├── engine/          (core engine logic)
│   │   ├── plugins/         (plugin system)
│   │   └── index.ts
│   ├── tests/
│   │   ├── unit/
│   │   └── integration/
│   └── package.json
│
├── integration/
│   ├── src/
│   │   ├── scan/            (code scanning)
│   │   ├── transform/       (code transformation)
│   │   ├── generate/        (CSS/TS generation)
│   │   └── index.ts
│   ├── tests/
│   └── package.json
│
├── unplugin/
│   ├── src/
│   │   ├── vite.ts
│   │   ├── webpack.ts
│   │   ├── rollup.ts
│   │   ├── esbuild.ts
│   │   ├── rspack.ts
│   │   └── index.ts
│   ├── tests/
│   └── package.json
│
├── vite/
│   ├── src/
│   │   └── index.ts
│   ├── tests/
│   └── package.json
│
├── nuxt/
│   ├── src/
│   │   ├── module.ts
│   │   └── index.ts
│   ├── tests/
│   └── package.json
│
├── plugin-icons/
│   ├── src/
│   ├── tests/
│   └── package.json
│
├── plugin-reset/
│   ├── src/
│   ├── tests/
│   └── package.json
│
└── plugin-typography/
    ├── src/
    ├── tests/
    └── package.json
```

### TypeScript Configuration

Each package has three `tsconfig` files:

- `tsconfig.json` - References both package and test configs
- `tsconfig.package.json` - Compilation settings for `src/**/*`
- `tsconfig.tests.json` - Compilation settings for `tests/**/*`

---

## Build Order

Commands respect the dependency graph. Correct build order:

```
1. core              (independent)
   ↓
2. integration       (depends on core)
   ↓
3. unplugin-pikacss  (depends on integration)
   ↓
4. vite, nuxt       (depend on unplugin)
```

pnpm workspace automatically handles this order via `pnpm build`.

---

## Adding New Packages

### Create Using Scaffolding

```bash
pnpm newpkg [dirname] [name]
```

Example:
```bash
pnpm newpkg my-feature @pikacss/my-feature
```

Creates:
- `packages/my-feature/`
- `src/index.ts` entry point
- `package.json` with proper exports
- `tsconfig.json` configuration
- `tests/` directory

### Manual Steps

1. Create package directory: `packages/my-package/`
2. Create `package.json` with:
   - Correct `name` field
   - `version` matching monorepo (currently 0.0.39)
   - Proper `exports` map
   - `peerDependencies` for core
3. Create `src/index.ts` entry point
4. Create `tsconfig.json` files
5. Create `tests/` directory with sample test
6. Add to root `pnpm-workspace.yaml` if not covered by glob

### Package.json Template

```json
{
  "name": "@pikacss/my-package",
  "version": "0.0.39",
  "description": "Description here",
  "type": "module",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.mjs",
      "require": "./dist/index.cjs"
    }
  },
  "main": "./dist/index.cjs",
  "module": "./dist/index.mjs",
  "types": "./dist/index.d.ts",
  "files": ["dist"],
  "scripts": {
    "build": "tsdown",
    "test": "vitest run"
  },
  "devDependencies": {
    "@pikacss/core": "workspace:*"
  },
  "peerDependencies": {
    "@pikacss/core": "workspace:*"
  }
}
```

### Dependencies

- `@pikacss/core` - Base for all packages (required)
- Other packages in monorepo as needed
- External libraries minimally
- Peer dependencies for stability

---

## Package Modification Guidelines

### Before Modifying a Package

1. Understand its responsibility (see Package Details above)
2. Check if change affects dependent packages
3. Run existing tests: `pnpm --filter @pikacss/core test`
4. Review imports to avoid circular dependencies

### After Modifying a Package

1. Build the package: `pnpm --filter @pikacss/core build`
2. Run tests: `pnpm --filter @pikacss/core test`
3. Check types: `pnpm --filter @pikacss/core typecheck`
4. Build dependent packages
5. Run full test suite: `pnpm test`

### Common Modification Patterns

**Adding a new export:**
1. Add to `src/index.ts`
2. Add TypeScript types in `src/types/`
3. Update `package.json` exports if new entry point
4. Write tests
5. Build and verify

**Fixing a bug:**
1. Write reproduction test
2. Fix in `src/`
3. Verify test passes
4. Run full test suite
5. Check for type errors

**Adding a feature:**
1. Add to appropriate `src/` file
2. Write comprehensive tests
3. Update TypeScript types
4. Build and verify
5. Check dependent packages still work

---

## Version Management

All packages share the same version (currently 0.0.39). Versioning is unified:

- Patch: Bug fixes
- Minor: New features (backward compatible)
- Major: Breaking changes

Use `pnpm release` to bump version across all packages.

---

## Performance Considerations

### Build Performance

- Core builds fastest (no dependencies)
- Integration depends on core
- Unplugin depends on integration
- Framework adapters depend on unplugin

Build in this order for optimal incremental builds.

### Runtime Performance

- Core is used at build time and runtime
- Integration is build-time only
- Unplugin is build-time only
- Runtime includes only core and plugins in final output

### Caching

- tsdown caches builds in `dist/`
- Clear with `rimraf packages/*/dist` if issues
- Incremental builds reuse cache

---

## Troubleshooting Package Issues

**Circular dependencies:**
- Check imports: `grep -r "from '\." packages/[package]/src/`
- Build fails if circular detected
- Use `pnpm lint` to verify

**Missing exports:**
- Check `package.json` exports map
- Verify `dist/` contains built files
- Run `pnpm publint --filter @pikacss/[package]`

**Type errors:**
- Check `tsconfig.package.json` includes correct files
- Verify imports reference exported types
- Run `pnpm --filter @pikacss/[package] typecheck`

**Build failures:**
- Clear cache: `rimraf packages/*/dist`
- Check dependencies are built: `pnpm build`
- Look for breaking changes in dependencies

---

## Reference

- [Development Commands](./commands.md) - All pnpm commands
- [Debugging Guide](./debugging.md) - Troubleshooting development issues
- [Development Workflows](./workflow.md) - Typical development patterns
