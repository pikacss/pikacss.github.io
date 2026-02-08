# Phase 12: Configuration - Research Findings

## 1. Current State Assessment

### Existing Package
- **Package:** `@pikacss/eslint-config` exists.
- **Location:** `packages/eslint-config`
- **Content:**
  - `src/rules/pika-build-time.ts`: Implements the `pika-build-time` rule (Phase 11 output).
  - `src/index.ts`: Currently exports a basic plugin object.
  - `package.json`: Contains build scripts (tsdown), basic metadata.
  - `tests/rules/pika-build-time.test.ts`: Unit tests for the rule using `@typescript-eslint/rule-tester`.

### Dependencies
- **Runtime:** None currently (except implicit `@typescript-eslint/utils` usage).
- **Dev:** `eslint`, `@typescript-eslint/utils`, `@typescript-eslint/parser`, `vitest`.
- **Issue:** The rule implementation imports `ESLintUtils` and `AST_NODE_TYPES` from `@typescript-eslint/utils`. This creates a runtime dependency.
- **Goal Check:** "Zero-dependency" and "Lightweight". We should remove the runtime dependency on `@typescript-eslint/utils` if possible.

## 2. Implementation Strategy

### A. Dependency Removal (Optimization)
To adhere to "Zero-dependency" and "Lightweight":
- Refactor `src/rules/pika-build-time.ts` to remove `@typescript-eslint/utils`.
- Use standard string literals for AST node types (e.g., `'Literal'` instead of `AST_NODE_TYPES.Literal`).
- Remove `ESLintUtils.RuleCreator` and use a simple helper function for the rule metadata/url.
- This ensures the package has **no runtime dependencies** other than ESLint itself (peer).

### B. Configuration Structure
The package will export a "Flat Config" compatible object.

**File Structure:**
```
packages/eslint-config/
├── src/
│   ├── rules/
│   │   └── pika-build-time.ts   # Rule implementation (refactored)
│   ├── configs/
│   │   └── recommended.ts       # The preset configuration
│   └── index.ts                 # Main entry point
```

**Export Interface (`src/index.ts`):**
```typescript
import { recommended } from './configs/recommended'
import { plugin } from './plugin' // Refactor plugin definition to separate file or keep here

export default {
  ...plugin,
  configs: {
    recommended
  }
}
```

**Recommended Config (`src/configs/recommended.ts`):**
```typescript
import { plugin } from '../plugin'

export const recommended = [
  {
    plugins: {
      pika: plugin
    },
    rules: {
      'pika/pika-build-time': 'error'
    }
  }
]
```
*Note: Exporting as an array allows for future expansion (e.g. ignores) and easier composition.*

### C. Testing Strategy
- **Unit Tests:** `tests/rules/pika-build-time.test.ts` already exists. Keep it.
- **Integration Tests:** Create `tests/config.test.ts`.
  - Use `ESLint` class to load the config.
  - Verify the rule is active and reports errors on invalid code.
  - Verify it works without explicitly setting `languageOptions.parser` in the config (inheriting from test setup).

## 3. Plan Requirements

1.  **Refactor Rule:** Remove `@typescript-eslint/utils` dependency.
2.  **Define Plugin:** explicit plugin object with the rule.
3.  **Define Config:** `recommended` preset.
4.  **Update Entry:** Export the structure.
5.  **Verify:** Run tests (unit + integration).
6.  **Build:** Ensure `tsdown` builds correctly (check ESM/CJS output).

## 4. Open Questions / Assumptions
- **Assumption:** Users will spread the config: `export default [ ...pika.configs.recommended ]`.
- **Assumption:** The rule logic is compatible with standard ESTree (JS) and TSESTree (TS) since it checks standard node types (`CallExpression`, `Literal`, etc.).

## 5. Next Steps
Proceed to planning Phase 12 with the above architecture.
