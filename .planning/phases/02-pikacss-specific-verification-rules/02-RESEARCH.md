# Phase 2: PikaCSS-Specific Verification Rules - Research

**Researched:** 2026-02-03
**Domain:** ESLint custom rules, multi-bundler testing, package simulation
**Confidence:** HIGH

## Summary

This phase requires building internal ESLint rules to validate PikaCSS-specific constraints in documentation code examples. The standard approach uses ESLint's flat config system with custom TypeScript rules, leveraging the existing `@deviltea/eslint-config` which already parses markdown code blocks. Multi-bundler testing requires fixture-based testing with Vitest, and package simulation benefits from `packlink` for fast local iteration.

The key technical foundation:
- ESLint 9.x flat config with custom rules as TypeScript modules using ESM
- AST analysis via TypeScript ESLint parser for detecting `pika()` call patterns
- Custom ESLint formatters for PikaCSS-specific error reporting
- Vitest workspace for isolated fixture testing across Vite/Webpack/Nuxt
- `packlink` for local package tarball simulation during development

**Primary recommendation:** Build internal ESLint rules using `@typescript-eslint/utils`, create custom formatter for detailed PikaCSS errors, use Vitest fixture testing with isolated temp directories per bundler, and leverage `packlink` for fast local package testing iteration.

## Standard Stack

The established libraries/tools for this domain:

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| ESLint | ^9.39.2 | Linting infrastructure | Already in use, flat config is 2026 standard, markdown parsing via `@deviltea/eslint-config` |
| @typescript-eslint/utils | ^8.x | Custom rule creation | Official TypeScript rule toolkit, provides AST types, RuleCreator, and testing utilities |
| Vitest | ^4.0.16 | Test runner | Already project standard, supports workspace mode for fixture isolation |
| unplugin | ^2.3.11 | Multi-bundler abstraction | Already in use for PikaCSS, provides unified testing interface |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| @typescript-eslint/rule-tester | ^8.x | Rule testing | Testing custom ESLint rules with proper type checking support |
| packlink | latest | Local package simulation | Development-time fast iteration for package installation testing |
| @nuxt/test-utils | ^4.2.2 | Nuxt testing | E2E fixture tests for Nuxt-specific integration |
| happy-dom | ^20.0.11 | DOM simulation | Already in use, for Vitest browser environment when needed |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| packlink | pnpm pack + file: protocol | file: slower, packlink designed for this use case |
| Vitest | Jest | Vitest is project standard, faster, better ESM support |
| Custom formatter | Built-in formatters | Custom formatter provides PikaCSS-specific error context and fix suggestions |

**Installation:**
```bash
# Already available in project
pnpm add -D @typescript-eslint/utils @typescript-eslint/rule-tester

# For packlink (global or project)
pnpm add -D packlink
```

## Architecture Patterns

### Recommended Project Structure
```
.eslint/
├── rules/                    # Custom PikaCSS rules
│   ├── pika-build-time.ts   # PIKA-01: Static analysis check
│   ├── pika-package-boundaries.ts  # PIKA-02: Import path validation
│   ├── pika-module-augmentation.ts # PIKA-06: TypeScript pattern check
│   └── index.ts             # Export all rules
├── formatters/              # Custom formatters
│   └── pikacss-detailed.ts  # PikaCSS-specific error format
└── tests/                   # Rule tests
    ├── rules/               # Unit tests for each rule
    │   ├── pika-build-time.test.ts
    │   ├── pika-package-boundaries.test.ts
    │   └── pika-module-augmentation.test.ts
    └── fixtures/            # Test fixtures
        ├── vite/            # Vite project fixture
        ├── webpack/         # Webpack project fixture
        └── nuxt/            # Nuxt project fixture
```

### Pattern 1: ESLint Custom Rule with TypeScript AST Analysis
**What:** Create type-aware ESLint rules that analyze `pika()` function calls for build-time constraint violations
**When to use:** PIKA-01 build-time constraint validation, detecting runtime-dynamic arguments

**Example:**
```typescript
// Source: https://typescript-eslint.io/developers/custom-rules
import { ESLintUtils, TSESTree } from '@typescript-eslint/utils';

const createRule = ESLintUtils.RuleCreator(
  name => `https://docs.pikacss.io/verification/${name}`
);

export const pikaBuildTimeRule = createRule({
  name: 'pika-build-time',
  meta: {
    type: 'problem',
    docs: {
      description: 'Enforce build-time analyzable arguments in pika() calls',
    },
    messages: {
      runtimeArg: 'pika() argument must be statically analyzable at build time. Found runtime variable: {{ varName }}',
      suggestCssVar: 'Consider using CSS variables: pika({ color: "var(--color)" })',
    },
    schema: [],
    hasSuggestions: true,
  },
  defaultOptions: [],
  create(context) {
    return {
      CallExpression(node: TSESTree.CallExpression) {
        if (
          node.callee.type === 'Identifier' &&
          node.callee.name === 'pika'
        ) {
          // Check if arguments are statically analyzable
          const arg = node.arguments[0];
          if (arg?.type === 'ObjectExpression') {
            // Traverse object properties to detect runtime variables
            // Report violations with messageId and suggestions
          }
        }
      },
    };
  },
});
```

### Pattern 2: Multi-Bundler Fixture Testing
**What:** Isolated test projects for each bundler with complete environment setup
**When to use:** PIKA-03, PIKA-04, PIKA-05 bundler integration validation

**Example:**
```typescript
// Source: Research on unplugin testing patterns 2026
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { execa } from 'execa';
import { mkdtemp, rm, writeFile } from 'fs/promises';
import { tmpdir } from 'os';
import { join } from 'pathe';

describe('Vite Integration', () => {
  let testDir: string;

  beforeEach(async () => {
    testDir = await mkdtemp(join(tmpdir(), 'pika-vite-test-'));
    // Copy fixture files to testDir
    // Install packages via packlink or pnpm
  });

  afterEach(async () => {
    await rm(testDir, { recursive: true, force: true });
  });

  it('should compile valid pika() examples', async () => {
    const result = await execa('pnpm', ['build'], { cwd: testDir });
    expect(result.exitCode).toBe(0);
    // Verify generated CSS and types
  });

  it('should fail on runtime-dynamic pika() calls', async () => {
    await writeFile(
      join(testDir, 'src/invalid.ts'),
      'export const styles = pika({ color: props.color });'
    );
    const result = await execa('pnpm', ['build'], { cwd: testDir, reject: false });
    expect(result.exitCode).not.toBe(0);
    expect(result.stderr).toContain('build-time constraint');
  });
});
```

### Pattern 3: Custom ESLint Formatter
**What:** Specialized formatter that provides detailed PikaCSS constraint violation information
**When to use:** All rule violations, provides actionable fix suggestions and documentation links

**Example:**
```typescript
// Source: https://eslint.org/docs/latest/extend/custom-formatters
import type { ESLint } from 'eslint';

const formatter: ESLint.Formatter['format'] = (results, context) => {
  let output = '';
  let errorCount = 0;
  let warningCount = 0;

  for (const result of results) {
    if (result.messages.length === 0) continue;

    output += `\n${result.filePath}\n`;

    for (const message of result.messages) {
      const level = message.severity === 2 ? 'ERROR' : 'WARN';
      const position = `${message.line}:${message.column}`;
      
      output += `  ${position}  ${level}  ${message.message}  ${message.ruleId}\n`;
      
      // Add PikaCSS-specific context
      if (message.ruleId?.startsWith('pikacss/')) {
        output += `    Fix: ${message.suggestions?.[0]?.desc || 'See docs'}\n`;
        output += `    Docs: https://docs.pikacss.io/verification/${message.ruleId}\n`;
      }

      if (message.severity === 2) errorCount++;
      else warningCount++;
    }
  }

  output += `\n✖ ${errorCount} errors, ${warningCount} warnings\n`;
  return output;
};

export default formatter;
```

### Pattern 4: Package Boundary Validation
**What:** Analyze import statements to ensure respect for monorepo layer architecture
**When to use:** PIKA-02, preventing invalid cross-layer imports

**Example:**
```typescript
// Custom ESLint rule implementation
import { ESLintUtils } from '@typescript-eslint/utils';

const LAYER_ORDER = ['core', 'integration', 'unplugin', 'framework'] as const;
const PACKAGE_LAYERS: Record<string, typeof LAYER_ORDER[number]> = {
  '@pikacss/core': 'core',
  '@pikacss/integration': 'integration',
  '@pikacss/unplugin-pikacss': 'unplugin',
  '@pikacss/vite-plugin-pikacss': 'framework',
  '@pikacss/nuxt-pikacss': 'framework',
};

export const packageBoundariesRule = createRule({
  name: 'pika-package-boundaries',
  meta: {
    type: 'problem',
    docs: {
      description: 'Enforce monorepo layer boundaries in imports',
    },
    messages: {
      invalidImport: 'Cannot import {{ imported }} ({{ importedLayer }}) from {{ importer }} ({{ importerLayer }}). Violates layer boundary: {{ expectedOrder }}',
    },
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    return {
      ImportDeclaration(node) {
        const importPath = node.source.value;
        const currentFile = context.filename;
        // Determine current package layer
        // Validate import is from same or lower layer
        // Report violations
      },
    };
  },
});
```

### Anti-Patterns to Avoid
- **Testing bundlers sequentially with shared state:** Always use isolated temp directories per test run to avoid cross-contamination
- **Manually parsing TypeScript in rules:** Use `@typescript-eslint/utils` parser services and AST types instead of regex/manual parsing
- **Generic error messages:** Provide specific context about which PikaCSS constraint was violated and how to fix it
- **Using ESLint's deprecated API:** Use flat config format and avoid context.getSourceCode(), use context.sourceCode instead

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| TypeScript AST traversal | Custom TS parser wrapper | @typescript-eslint/utils | Provides complete TypeScript AST types, parser services, type checker access |
| Multi-bundler test matrix | Custom build scripts | Vitest workspace + fixtures | Handles isolation, parallelization, proper cleanup |
| Local package testing | Manual pnpm pack + copying | packlink | Designed for this exact use case, handles versioning and caching |
| Rule testing | Custom test harness | @typescript-eslint/rule-tester | Handles parser config, type checking setup, assertion helpers |
| Package import resolution | String parsing | typescript-eslint getParserServices | Proper module resolution with type information |
| Error formatting | String concatenation | Custom ESLint Formatter | Proper ESLint formatter API, integrates with tooling |

**Key insight:** ESLint and typescript-eslint provide comprehensive APIs for custom rules and testing. Attempting to parse TypeScript or analyze imports manually will miss edge cases and lack type information that parser services provide for free.

## Common Pitfalls

### Pitfall 1: Not Using Parser Services for Type Information
**What goes wrong:** Rules try to determine if a value is static by examining AST nodes alone, missing complex cases like const references, enums, type narrowing
**Why it happens:** Seems simpler to check node.type === 'Literal', but misses `const COLOR = 'red'; pika({ color: COLOR })`
**How to avoid:** Use `getParserServices(context)` to access TypeScript type checker, check if type is literal type
**Warning signs:** False positives on valid static code, inability to detect certain runtime patterns

### Pitfall 2: Shared Test Fixtures Without Cleanup
**What goes wrong:** Tests fail intermittently, one test's generated files affect another test
**Why it happens:** Using same temp directory or not cleaning up properly between tests
**How to avoid:** Use `beforeEach` to create unique temp dir with `mkdtemp`, `afterEach` to rm -rf with force flag
**Warning signs:** Tests pass individually but fail when run together, "file already exists" errors

### Pitfall 3: Testing Against Published Packages Instead of Local
**What goes wrong:** Tests pass but don't catch bugs in current codebase changes
**Why it happens:** npm install pulls from registry instead of testing local package code
**How to avoid:** Use `packlink publish` from package directory, then `packlink add` in test fixture, or use pnpm workspace protocol
**Warning signs:** Tests don't fail when introducing known bugs, CI passes but local testing fails

### Pitfall 4: Generic ESLint Error Messages
**What goes wrong:** Users don't understand what constraint they violated or how to fix it
**Why it happens:** Using simple string messages instead of structured messageIds with suggestions
**How to avoid:** Define message IDs in meta.messages, use meta.hasSuggestions, provide fix functions
**Warning signs:** User confusion, repeated questions about same error, lack of adoption

### Pitfall 5: Blocking on Webpack When Vite Fails
**What goes wrong:** Cannot merge PR even though primary bundler (Vite) works, blocked by secondary bundler (Webpack) failure
**Why it happens:** All bundler tests set to Error severity instead of differentiated levels
**How to avoid:** Vite/Nuxt failures = Error (blocking), Webpack failures = Warning (non-blocking per CONTEXT.md decision)
**Warning signs:** PRs blocked by non-critical bundler issues, slow iteration velocity

### Pitfall 6: Not Testing Module Augmentation Patterns
**What goes wrong:** Plugin examples compile but don't provide proper type completions for users
**Why it happens:** Only testing runtime behavior, not TypeScript declaration merging
**How to avoid:** Use tsc --noEmit on fixtures, verify type exports exist, test with @ts-expect-error for invalid usage
**Warning signs:** Users report missing autocomplete, type errors when following documented patterns

## Code Examples

Verified patterns from official sources:

### Creating a Type-Aware Rule with Parser Services
```typescript
// Source: https://typescript-eslint.io/developers/custom-rules
import { ESLintUtils } from '@typescript-eslint/utils';
import * as ts from 'typescript';

const createRule = ESLintUtils.RuleCreator(
  name => `https://docs.pikacss.io/verification/${name}`
);

export const rule = createRule({
  name: 'no-runtime-pika-args',
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallow runtime variables in pika() arguments',
    },
    messages: {
      runtimeVariable: 'Argument to pika() uses runtime variable. Must be statically analyzable.',
    },
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    const services = ESLintUtils.getParserServices(context);
    const checker = services.program.getTypeChecker();

    return {
      CallExpression(node) {
        if (node.callee.type === 'Identifier' && node.callee.name === 'pika') {
          const arg = node.arguments[0];
          if (!arg) return;

          // Get TypeScript node from ESTree node
          const tsNode = services.esTreeNodeToTSNodeMap.get(arg);
          
          // Get type information
          const type = checker.getTypeAtLocation(tsNode);
          
          // Check if type is literal or const
          if (!(type.flags & ts.TypeFlags.Literal)) {
            context.report({
              node: arg,
              messageId: 'runtimeVariable',
            });
          }
        }
      },
    };
  },
});
```

### Testing Rule with RuleTester
```typescript
// Source: https://typescript-eslint.io/packages/rule-tester
import { RuleTester } from '@typescript-eslint/rule-tester';
import { rule } from './no-runtime-pika-args';

const ruleTester = new RuleTester({
  languageOptions: {
    parserOptions: {
      projectService: {
        allowDefaultProject: ['*.ts*'],
      },
      tsconfigRootDir: __dirname,
    },
  },
});

ruleTester.run('no-runtime-pika-args', rule, {
  valid: [
    {
      code: `const styles = pika({ color: 'red' });`,
    },
    {
      code: `const COLOR = 'blue'; const styles = pika({ color: COLOR });`,
    },
  ],
  invalid: [
    {
      code: `function Component({ color }) { return pika({ color }); }`,
      errors: [{ messageId: 'runtimeVariable' }],
    },
  ],
});
```

### Vitest Workspace Configuration for Fixtures
```typescript
// Source: Vitest 4.x documentation patterns
// vitest.config.ts for bundler tests
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    // Sequential for local dev (clear logs), parallel for CI
    sequence: {
      concurrent: process.env.CI === 'true',
    },
    isolate: true, // Complete isolation per test file
    setupFiles: ['./tests/setup.ts'],
  },
});
```

### Using Packlink for Local Package Testing
```bash
# Source: https://github.com/souporserious/packlink
# In package directory (e.g., packages/core)
packlink publish --watch

# In test fixture directory
packlink add @pikacss/core --watch

# packlink automatically:
# 1. Creates tarball with pnpm pack
# 2. Stores in ~/.config/packlink/
# 3. Updates package.json with tarball reference
# 4. Runs pnpm install

# When watched, auto-republishes on changes in dist/
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| .eslintrc.js files | eslint.config.mjs flat config | ESLint 9.x (2024) | Simpler config, better TypeScript support, project already using |
| context.getSourceCode() | context.sourceCode property | ESLint 9.x | Direct property access, old method deprecated |
| Manual tsc + webpack/vite builds | unplugin abstraction layer | 2023+ | Single plugin works across all bundlers, already in use for PikaCSS |
| npm link for local testing | packlink | 2024+ | Faster, more reliable, better version handling |
| Jest | Vitest | 2022+ | Faster, better ESM, native TypeScript, already project standard |

**Deprecated/outdated:**
- `.eslintrc` format: Use `eslint.config.mjs` flat config (ESLint 8.x is EOL)
- `context.getSourceCode()`: Use `context.sourceCode` directly
- Jest for new TypeScript projects: Vitest has better ESM/TS support and is faster

## Open Questions

Things that couldn't be fully resolved:

1. **Packlink Production Reliability**
   - What we know: Packlink is designed for local testing, has 57 GitHub stars, actively maintained
   - What's unclear: Whether it's stable enough for CI environments or if full npm install simulation is needed
   - Recommendation: Use packlink for local dev iteration speed, use full `pnpm pack` + install in CI for accuracy (per CONTEXT.md decision)

2. **TypeScript Module Augmentation Detection**
   - What we know: Can check if `declare module '@pikacss/core'` exists in AST
   - What's unclear: How to verify the augmentation is *correct* (extends right interfaces with right types)
   - Recommendation: Start with presence check (PIKA-06), add semantic validation in follow-up if needed

3. **Webpack vs Rspack Testing**
   - What we know: 2026 trend is testing Rspack instead of Webpack for speed while maintaining compatibility
   - What's unclear: Whether PikaCSS unplugin works identically on both, if we should test Rspack instead
   - Recommendation: Test Webpack as documented (PIKA-05), consider Rspack as optimization after baseline works

## Sources

### Primary (HIGH confidence)
- ESLint Official Docs: https://eslint.org/docs/latest/extend/custom-rules - Custom rule structure, formatter API
- typescript-eslint Custom Rules: https://typescript-eslint.io/developers/custom-rules - Type-aware rule creation, parser services
- Vitest 4.x: Project's package.json shows vitest@^4.0.16, workspace testing is native feature
- Existing PikaCSS Architecture: AGENTS.md documents layered architecture, build-time constraint, unplugin usage

### Secondary (MEDIUM confidence)
- packlink GitHub: https://github.com/souporserious/packlink - README and usage examples verified
- Web search: "ESLint custom rules development best practices 2026" - Confirmed flat config standard, ESM/TypeScript first, selector optimization
- Web search: "unplugin multi-bundler testing Vite Webpack Nuxt 2026" - Confirmed fixture-based testing pattern with isolation

### Tertiary (LOW confidence)
- Web search results on Rspack: Mentioned as 2026 trend but not verified against PikaCSS compatibility needs

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - All tools already in use or official ecosystem choices
- Architecture: HIGH - Patterns from official docs and existing project structure
- Pitfalls: HIGH - Based on documented ESLint/typescript-eslint gotchas and testing best practices

**Research date:** 2026-02-03
**Valid until:** 2026-03-03 (30 days - stable ecosystem, unlikely to change significantly)
