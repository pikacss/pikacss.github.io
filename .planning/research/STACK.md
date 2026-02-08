# Technology Stack: @pikacss/eslint-config

**Project:** @pikacss/eslint-config
**Researched:** Sun Feb 08 2026

## Recommended Stack

### Core Framework
| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| [ESLint](https://eslint.org/) | ^9.0.0 | Linting Engine | The standard for JS/TS linting. Version 9+ is required for native Flat Config support. |
| [Flat Config](https://eslint.org/docs/latest/use/configure/configuration-files-new) | (Built-in) | Configuration Format | The mandatory configuration format for ESLint 9+. Enables better dependency management and composability. |

### Build & Tooling
| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| [tsdown](https://github.com/sxzz/tsdown) | Latest | Bundler | Used by other packages in the monorepo. Efficiently bundles TypeScript rules and configs into ESM. |
| [TypeScript](https://www.typescriptlang.org/) | ^5.0.0 | Language | Provides type safety for rule definitions and AST manipulation. |

### Dependencies Strategy

**Philosophy**: "Batteries Included" for rules, "Peer" for core engine.

| Dependency Type | Package | Rationale |
|-----------------|---------|-----------|
| **peerDependencies** | `eslint`, `typescript` | Core engines should be installed by the consumer to avoid version conflicts and ensuring singleton instances. |
| **dependencies** | `@typescript-eslint/utils` | Essential for writing TypeScript-aware rules. Must be a direct dependency to ensure the rules work out-of-the-box. |
| **devDependencies** | `@deviltea/eslint-config` | Used for linting *this* package during development, but NOT bundled for consumers (avoid enforcing unrelated style preferences). |

## Package Structure Recommendation

This package serves two audiences: **PikaCSS Users** and the **PikaCSS Monorepo**.

### Exports
Reflecting the [2026 Hybrid Plugin/Config Pattern](https://eslint.org/docs/latest/extend/plugins#configs-in-plugins), the package should export both the plugin definition and pre-packaged configs.

```javascript
// index.mjs (Entry Point)
export { plugin } from './plugin'; // The plugin object (rules definitions)
export { recommended } from './configs/recommended'; // User-facing config
export { internal } from './configs/internal'; // Monorepo-specific config
```

### Config Presets

1.  **`recommended`** (User Focus):
    *   Enables `pikacss/pika-build-time`.
    *   **Goal**: Prevent runtime arguments in `pika()` calls.
    *   **Usage**: `import pika from '@pikacss/eslint-config'; export default [ ...pika.recommended ]`

2.  **`internal`** (Monorepo Focus):
    *   Enables `pikacss/pika-package-boundaries`.
    *   Enables `pikacss/pika-module-augmentation`.
    *   **Goal**: Enforce architectural boundaries within the PikaCSS workspace.
    *   **Usage**: Used only by `pikacss/eslint.config.mjs`.

## Dependency Management Details

### 1. Peer Dependencies
Strictly define peer dependencies to ensure compatibility.

```json
{
  "peerDependencies": {
    "eslint": "^9.0.0",
    "typescript": "^5.0.0"
  }
}
```

### 2. Workspace Integration (pnpm)
Use the workspace catalog for consistent versioning.

```yaml
# pnpm-workspace.yaml
catalog:
  '@pikacss/eslint-config': workspace:*
```

### 3. Bundling (tsdown)
We must bundle the source code (`src/rules/*.ts`) into distributable JS/MJS files because ESLint rules must be JavaScript at runtime (unless the user uses `tsx`/`ts-node` to run ESLint, which we shouldn't assume).

**Build Target**: `dist/index.mjs` (ESM) and `dist/index.d.ts` (Types).

## Installation

```bash
# For Consumers
npm install -D @pikacss/eslint-config eslint typescript
```

## Migration Plan

1.  **Extract Rules**: Move `.eslint/rules/*.ts` to `packages/eslint-config/src/rules/`.
2.  **Create Plugin**: Wrap rules in a standard ESLint plugin object structure.
3.  **Define Configs**: Create the `recommended` and `internal` config factories.
4.  **Publish**: Release `@pikacss/eslint-config`.
5.  **Consume**: Update root `eslint.config.mjs` to import from `@pikacss/eslint-config/internal`.

## Sources

- [ESLint Flat Config Documentation](https://eslint.org/docs/latest/use/configure/configuration-files-new) (High Confidence)
- [Antfu/ESLint Config Patterns](https://github.com/antfu/eslint-config) (Community Standard)
- Existing PikaCSS `package.json` and `eslint.config.mjs` (Codebase Context)
