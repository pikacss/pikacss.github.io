# Research Findings: Phase 11 - Rules Engine

## 1. Goal
Implement the `pika-build-time` ESLint rule to enforce static analysis constraints on `pika()` and its variants. The rule must ensure all arguments are statically evaluable literals.

## 2. Existing State
- **Package**: `packages/eslint-config` (created in Phase 10).
- **Structure**:
  - `src/index.ts`: Currently empty.
  - `package.json`: Missing test scripts and some dev dependencies.
- **Related Logic**: `scripts/verify-code-rules.ts` contains a primitive regex-based check, confirming the need for a robust AST-based rule.
- **Testing**:
  - `vitest` is set up at the root and works for the package.
  - `RuleTester` from `eslint` works with `vitest` globals (`describe`, `it`).
  - `@typescript-eslint/parser` is missing from package `devDependencies` but required for testing TS code.

## 3. Implementation Plan

### 3.1 Dependencies
Add the following `devDependencies` to `packages/eslint-config/package.json`:
- `@typescript-eslint/parser`: Required for `RuleTester` to parse TypeScript test cases.
- `@typescript-eslint/utils`: Already present, use for strictly typed rule definitions.

### 3.2 Rule Logic (`src/rules/pika-build-time.ts`)
- **Target**: `CallExpression`.
- **Callee Check**:
  - `Identifier`: check if name is in configured list (default `['pika', 'pikap']`).
  - `MemberExpression`: check if `object.name` is in list (e.g., `pika.str`, `pika.arr`).
- **Argument Validation**:
  - Iterate through `node.arguments`.
  - **Allowed Nodes**:
    - `Literal` (string, number, boolean, null).
    - `ObjectExpression`: Recursively check all properties. Keys must be static (Literal or Identifier). Values must be allowed nodes.
    - `ArrayExpression`: Recursively check all elements.
    - `TemplateLiteral`: Only if `quasis` has 1 element and `expressions` is empty (effectively a static string).
    - `Identifier`: Strictly forbidden (even `undefined` unless explicitly allowed, but requirements say "Strict literals only").
  - **Forbidden**:
    - `Identifier` (variables).
    - `BinaryExpression` (e.g., `'a' + 'b'`).
    - `CallExpression`.
    - `ConditionalExpression`.
    - `TemplateLiteral` with expressions.
    - `SpreadElement`.

### 3.3 Rule Configuration
- **Options Schema**:
  ```json
  [
    {
      "type": "object",
      "properties": {
        "functions": {
          "type": "array",
          "items": { "type": "string" },
          "default": ["pika", "pikap", "styled"]
        }
      },
      "additionalProperties": false
    }
  ]
  ```

### 3.4 Testing (`tests/rules/pika-build-time.test.ts`)
- Use `RuleTester` with `parser: '@typescript-eslint/parser'`.
- **Test Cases**:
  - **Valid**:
    - `pika({ color: 'red' })`
    - `pika.str('foo')`
    - `pika({ nested: { val: 1 } })`
    - `pika(['a', 'b'])`
  - **Invalid**:
    - `pika(someVar)`
    - `pika({ color: someVar })`
    - `pika('a' + 'b')`
    - `pika(\`val-${x}\`)`
    - `pika(condition ? 'a' : 'b')`

### 3.5 Exports (`src/index.ts`)
Export the plugin object structure:
```typescript
import { pikaBuildTime } from './rules/pika-build-time'

export const plugin = {
  meta: { ... },
  rules: {
    'pika-build-time': pikaBuildTime
  }
}
// Default export for Flat Config usage in future
export default plugin 
```

## 4. Risks & Mitigations
- **TS Parsing**: Ensure `RuleTester` is correctly configured with `parserOptions`.
- **Scope Analysis**: Requirement explicitly defers complex scope analysis. Rule should remain purely syntactic (AST node type check).
- **False Positives**: "Strict literals" might be too strict for some valid use cases (e.g., `const RED = 'red'; pika({ color: RED })`). However, the requirement is explicit: "No dynamic values... strictly forbidden". We will implement this strict version first.
