# Phase 13: Integration & Dogfooding - Research

**Researched:** 2026-02-09
**Domain:** Monorepo Tooling & Linting
**Confidence:** HIGH

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- **Import Strategy:**
    - Method: Standard package import (`import ... from '@pikacss/eslint-config'`).
    - Dependency: Add explicit `devDependency` in root `package.json` pointing to `workspace:*`.
    - Workflow: Require `pnpm build` before linting. The config will consume the built `dist/` artifacts, not source files.
- **Rule Application Scope:**
    - Scope: Global application to all JS/TS files in the repository.
    - Tests: Enforce rules in test files as well. Use explicit `// eslint-disable` comments for intentional failure tests.
    - Severity: Use the preset's default severity (Error).
- **Legacy Cleanup:**
    - Action: Delete old rule implementation files and configuration references immediately.
    - Verification: Standard `pnpm lint` success is sufficient proof of integration.

### Claude's Discretion
- Exact sequence of operations (cleanup first vs integration first).
- Handling of specific eslint-ignore cases if they arise during migration.

### Deferred Ideas (OUT OF SCOPE)
- None — discussion stayed within phase scope.
</user_constraints>

## Summary

The goal is to replace the locally implemented `pika-build-time` rule with the one from the new `@pikacss/eslint-config` package. The new package exports a `recommended` config that enables this rule.

**Crucial Finding:** The package's `pika-build-time` rule is **AST-based (stricter)** and does not use type information, whereas the legacy local rule was type-aware. This aligns with the "v1 Requirement" to defer strict type checking.

**Primary recommendation:** Integrate `@pikacss/eslint-config` for `pika-build-time`, but **retain** local implementations for `pika-package-boundaries` and `pika-module-augmentation` as they are internal-only rules not included in the public package.

## Standard Stack

### Dependencies
| Package | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| `@pikacss/eslint-config` | `workspace:*` | The new config to dogfood | Project requirement |
| `@deviltea/eslint-config` | Existing | Base configuration | Existing standard |

**Installation:**
```bash
pnpm add -D -w @pikacss/eslint-config
```

## Architecture Patterns

### Root Config Integration (`eslint.config.mjs`)

The root config currently uses a factory function from `@deviltea/eslint-config`. We will append the new config to the result.

```javascript
import deviltea from '@deviltea/eslint-config'
import pikaConfig from '@pikacss/eslint-config' // Import the package

// ... keep local rule imports for boundaries/augmentation ...
import { pikaModuleAugmentationRule, pikaPackageBoundariesRule } from './.eslint/rules/index.ts'

const baseConfig = await deviltea({
    // ... existing options ...
    plugins: {
        pikacss: { // Keep this plugin for LOCAL rules only
            rules: {
                // 'pika-build-time': REMOVED - comes from pikaConfig
                'pika-package-boundaries': pikaPackageBoundariesRule,
                'pika-module-augmentation': pikaModuleAugmentationRule,
            },
        },
    },
    rules: {
        // 'pikacss/pika-build-time': REMOVED
        'pikacss/pika-package-boundaries': 'error',
        'pikacss/pika-module-augmentation': 'error',
    },
})

export default [
    ...baseConfig,
    ...pikaConfig.configs.recommended, // Appends [ { name: 'pika/recommended', plugins: { pika }, rules: { 'pika/pika-build-time': 'error' } } ]
]
```

### Rule Implementations

| Rule | Source | Action |
|------|--------|--------|
| `pika-build-time` | `@pikacss/eslint-config` | **Use Package** (Delete local) |
| `pika-package-boundaries` | Local `.eslint/rules` | **Keep Local** (Not in package) |
| `pika-module-augmentation` | Local `.eslint/rules` | **Keep Local** (Not in package) |

## Common Pitfalls

### Pitfall 1: Build dependency
**What goes wrong:** `pnpm lint` fails because `@pikacss/eslint-config` is not built.
**Why it happens:** The root config imports from `dist/`, which only exists after build.
**How to avoid:** Always run `pnpm build` (or at least `pnpm --filter @pikacss/eslint-config build`) before working on the root config or running lint.

### Pitfall 2: Rule Conflict
**What goes wrong:** `pika-build-time` appears twice or not at all.
**Why it happens:** The package uses plugin name `pika` and rule `pika/pika-build-time`. The local config used `pikacss` and `pikacss/pika-build-time`.
**How to avoid:** Ensure the new config is appended and the old rule is explicitly removed from the manual configuration in `eslint.config.mjs`.

### Pitfall 3: Deleting Internal Rules
**What goes wrong:** Deleting `.eslint/rules/index.ts` entirely removes `pika-package-boundaries`.
**Why it happens:** Assuming all rules were moved to the package.
**How to avoid:** Only delete `pika-build-time.ts` and its export. Keep the other rules.

## Verification

To verify the integration works as expected (dogfooding):

1.  **Positive Case:** `pnpm lint` should pass on the current codebase.
2.  **Negative Case (Manual Verification):**
    - Create a temporary file `packages/core/src/_verify_lint.ts`.
    - Content: `declare const pika: any; pika({ color: someVar });`
    - Run `pnpm lint`.
    - It MUST fail with `pika/pika-build-time` error.
    - Delete the file.

## State of the Art

| Old Approach | Current Approach | Impact |
|--------------|------------------|--------|
| Local `pika-build-time` (Type-Aware) | Package `pika-build-time` (AST-Only) | Faster linting, no type-checking dependency for this rule, stricter enforcement (no variables allowed). |
| Manual rule config | Presets via `configs.recommended` | Easier updates, dogfooding public API. |

## Open Questions

None. Research confirms the package exports and local usage patterns are compatible with the proposed plan.

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - Workspace protocol is standard.
- Architecture: HIGH - Config structure is clear.
- Pitfalls: HIGH - Verified rule differences.

**Research date:** 2026-02-09
**Valid until:** Next major ESLint config refactor.
