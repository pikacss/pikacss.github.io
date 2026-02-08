# Architecture: @pikacss/eslint-config

**Component:** Shared ESLint Configuration Package
**Date:** Feb 08 2026
**Status:** Proposed

## Overview

The `@pikacss/eslint-config` package extracts the monorepo's internal ESLint configuration and custom rules into a standalone, publishable package. This enables:

1.  **Consistency**: Shared linting rules across all PikaCSS packages and potential external ecosystem projects.
2.  **Encapsulation**: Centralized maintenance of custom rules (`pika-build-time`, `pika-package-boundaries`, etc.).
3.  **Dogfooding**: The monorepo uses the exact same configuration it publishes.

## Directory Structure

The package will reside in `packages/eslint-config` and follow the standard monorepo package structure.

```
packages/eslint-config/
├── package.json          # Package manifest
├── tsconfig.json         # TypeScript config
├── tsdown.config.ts      # Build config
├── src/
│   ├── index.ts          # Main entry (factory function)
│   └── rules/            # Custom rules implementation
│       ├── index.ts      # Rule exports
│       ├── pika-build-time.ts
│       ├── pika-package-boundaries.ts
│       └── pika-module-augmentation.ts
└── tests/                # Unit tests for rules
    └── rules/
        ├── pika-build-time.test.ts
        └── ...
```

## Package Configuration

### Dependencies

| Package | Type | Reason |
|---------|------|--------|
| `eslint` | Peer | Required host tool |
| `typescript` | Peer | Required for type-aware rules |
| `@deviltea/eslint-config` | Dependency | Base configuration extended by PikaCSS |
| `@typescript-eslint/utils` | Dependency | Utilities for writing custom rules |

### Exports & Publishing

To support both **local development (dogfooding)** and **production usage**, we use conditional exports with a `publishConfig` override.

**`package.json`**:
```json
{
  "name": "@pikacss/eslint-config",
  "type": "module",
  "exports": {
    ".": "./src/index.ts"  // 👈 Points to source for local dev (handled by tsx/jiti)
  },
  "publishConfig": {
    "exports": {
      ".": {
        "import": "./dist/index.mjs",
        "require": "./dist/index.cjs"
      }
    },
    "main": "./dist/index.cjs",
    "module": "./dist/index.mjs",
    "types": "./dist/index.d.mts"
  },
  "scripts": {
    "build": "tsdown",
    "stub": "tsdown --config tsdown.config.ts"
  }
}
```

This strategy ensures:
1.  **Local Dev**: Linting works immediately without a build step (handled by `tsx` loader or `jiti`).
2.  **Published**: Consumers get the compiled JS/DTS files.

## Core Components

### 1. Configuration Factory (`src/index.ts`)

The package exports a factory function that composes `@deviltea/eslint-config` with PikaCSS-specific rules.

```typescript
import deviltea from '@deviltea/eslint-config'
import { rules } from './rules'

export default function pikacss(options = {}, ...userConfigs) {
  return deviltea({
    ...options,
    // Merge PikaCSS specific defaults
    ignores: [
      ...(options.ignores || []),
      '**/pika.gen.ts',
      '**/pika.gen.css'
    ]
  }, 
  // Add PikaCSS plugin and rules
  {
    plugins: {
      pikacss: { rules }
    },
    rules: {
      'pikacss/pika-build-time': 'error',
      'pikacss/pika-package-boundaries': 'error',
      'pikacss/pika-module-augmentation': 'error',
    }
  },
  ...userConfigs)
}
```

### 2. Custom Rules (`src/rules/`)

Existing rules in `.eslint/rules/` will be migrated here. The implementation remains largely the same, but imports must be updated to use dependencies from the new package's `node_modules`.

## Integration (Dogfooding Strategy)

The monorepo root `eslint.config.mjs` will import the package directly.

**`eslint.config.mjs` (Root)**:
```javascript
import pikacss from '@pikacss/eslint-config'

export default pikacss({
  // Root-specific overrides (e.g. global ignores)
  ignores: [
    '.planning/**',
    'docs/examples/**'
  ]
})
```

**How this works without a build cycle:**
The root `lint` script uses `tsx`:
`"lint": "NODE_OPTIONS='--import tsx' eslint --fix ."`

1.  ESLint loads `eslint.config.mjs`.
2.  Node resolves `@pikacss/eslint-config` to `packages/eslint-config/src/index.ts` (via `exports` field).
3.  `tsx` loader transpiles the TypeScript source on-the-fly.
4.  Linting proceeds without requiring `pika-eslint-config` to be pre-built.

## Build Pipeline

The package uses `tsdown` for bundling, consistent with other packages.

**`tsdown.config.ts`**:
```typescript
import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  clean: true,
  dts: true,
})
```

## Migration Plan

1.  **Scaffold**: Create `packages/eslint-config`.
2.  **Move**: Transfer `.eslint/rules/` -> `packages/eslint-config/src/rules/`.
3.  **Move Tests**: Transfer `.eslint/tests/` -> `packages/eslint-config/tests/`.
4.  **Implement**: Create `src/index.ts` factory.
5.  **Wire Up**: Update root `package.json` devDependencies to point to `workspace:*`.
6.  **Switch**: Update root `eslint.config.mjs` to use the new package.
7.  **Verify**: Run `pnpm lint` and `pnpm test` to ensure no regression.
