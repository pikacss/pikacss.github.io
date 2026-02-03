# Stack Research

**Domain:** Documentation Verification and Testing for TypeScript Monorepo  
**Researched:** 2026-02-03  
**Confidence:** HIGH

## Recommended Stack

### Core Technologies

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| **Vitest** | Latest (already in project) | Execute tests for code examples in documentation | Already integrated in the project, mature ecosystem for TypeScript testing, supports both unit tests and code block verification |
| **VitePress** | Latest (already in project) | Documentation site generator | Already in use for the project docs, has built-in markdown features including code snippet imports for testing |
| **TypeScript** | Latest (already in project) | Type checking documentation code examples | Ensures type correctness of all documented examples against the actual codebase |

### Supporting Libraries

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| **markdown-link-check** | v3.14.2+ | Verify all hyperlinks in markdown files | Check for broken links in all 73 markdown files (internal and external) |
| **markdownlint** | v0.39.0+ | Enforce markdown quality standards | Ensure consistent markdown formatting and catch common markdown mistakes |
| **eslint-plugin-markdown** | v5.0.0+ | Lint code blocks within markdown files | Validate JavaScript/TypeScript syntax in code examples without running them |
| **TypeDoc** | v0.26.0+ | Extract API signatures from TypeScript source | Generate reference documentation from source code to compare against manual docs |
| **@microsoft/api-extractor** | v7.47.0+ | Extract and validate public API surface | Create API report files to detect unintended API changes documented incorrectly |
| **ts-morph** | v23.0.0+ | Parse TypeScript AST programmatically | Extract function signatures, types, and interfaces for verification against docs |

### Development Tools

| Tool | Purpose | Notes |
|------|---------|-------|
| **markdownlint-cli2** | CLI for markdown linting | Better for CI/CD, supports glob patterns |
| **remark-lint** | Alternative markdown linter | More extensible, can create custom rules for project-specific patterns |
| **markdown-it** | Markdown parser | Used by VitePress, needed if writing custom validation logic |
| **micromark** | CommonMark-compliant parser | Used by markdownlint, lightweight and spec-compliant |

## Installation

```bash
# Core testing (already installed)
# pnpm add -D vitest

# Documentation verification
pnpm add -D markdown-link-check markdownlint-cli2 markdownlint

# Code block linting
pnpm add -D eslint-plugin-markdown

# API extraction and verification
pnpm add -D typedoc @microsoft/api-extractor ts-morph

# Optional: Additional markdown tooling
pnpm add -D remark-lint remark-cli
```

## Alternatives Considered

| Recommended | Alternative | When to Use Alternative |
|-------------|-------------|-------------------------|
| **markdown-link-check** | **lychee** (Rust-based) | When performance is critical for very large doc sets (100+ files); not needed for 73 files |
| **markdownlint** | **remark-lint** | When you need highly customized markdown rules beyond standard conventions |
| **Vitest** | **Jest** | If the project was already using Jest; Vitest is better for Vite/VitePress integration |
| **TypeDoc** | **API Documenter** | When using Rush monorepo with @microsoft/api-extractor |
| **eslint-plugin-markdown** | **prettier** | Prettier is for formatting, not verification; use both together |

## What NOT to Use

| Avoid | Why | Use Instead |
|-------|-----|-------------|
| **eslint-plugin-markdown v4.x** | Deprecated, only works with old ESLint config format | **eslint-plugin-markdown v5.x+** with flat config |
| **remark-validate-links** | No longer maintained, many false positives | **markdown-link-check** with configuration |
| **documentation.js** | Focused on JavaScript, poor TypeScript support | **TypeDoc** for TypeScript projects |
| **Manual verification scripts** | Error-prone, not maintainable | Automated test suite with Vitest |

## Stack Patterns by Use Case

### Pattern 1: Code Example Verification (PRIMARY)

**Use when:** Verifying that code examples in docs actually work

**Stack:**
```
VitePress (<<< @/examples/file.ts transclusion)
    ↓
Vitest (test the example files directly)
    ↓
TypeScript (type-check examples)
```

**Why:** This is the "source of truth" pattern recommended by VitePress community. Store all code examples as actual testable files, import them into docs, and test them independently.

**Confidence:** HIGH - This is the standard 2025 best practice for VitePress documentation.

### Pattern 2: API Documentation Verification

**Use when:** Ensuring API docs match actual implementation

**Stack:**
```
TypeDoc (extract actual API from source)
    ↓
Custom Vitest tests (compare docs to extracted API)
    ↓
ts-morph (parse both docs and source AST)
```

**Why:** TypeDoc provides structured JSON output of actual API, which can be programmatically compared against documented claims.

**Confidence:** MEDIUM - Requires custom test logic, but all tools are mature.

### Pattern 3: Markdown Quality and Link Verification

**Use when:** Checking markdown syntax and link validity

**Stack:**
```
markdownlint (markdown syntax rules)
    ↓
eslint-plugin-markdown (code block syntax)
    ↓
markdown-link-check (verify links work)
```

**Why:** Each tool has a specific job - markdown structure, code syntax, and link validation are separate concerns.

**Confidence:** HIGH - All three are industry standard tools.

### Pattern 4: Deep Code Block Testing

**Use when:** Testing code snippets that aren't in separate files

**Stack:**
```
Custom script to extract code blocks
    ↓
Write to temp files
    ↓
Run through TypeScript compiler (tsc --noEmit)
    ↓
Run through Vitest if runnable
```

**Why:** Not all code examples should be in files (some are intentionally broken or partial). Extract, validate syntax, and optionally test.

**Confidence:** MEDIUM - Custom tooling required, but straightforward implementation.

## Version Compatibility

| Package A | Compatible With | Notes |
|-----------|-----------------|-------|
| eslint-plugin-markdown@5.x | ESLint@9.x | Requires flat config format (eslint.config.js) |
| markdownlint@0.39.x | Node.js@18+ | No specific ESLint version requirement |
| TypeDoc@0.26.x | TypeScript@5.0+ | Keep TypeDoc version in sync with TS version |
| Vitest@latest | VitePress@1.x+ | Both use Vite, so version alignment is natural |
| @microsoft/api-extractor@7.47.x | TypeScript@5.0+ | Works best with monorepo structure (already in place) |

## Rationale

### Why Vitest over Jest?

1. **Already integrated:** The project uses Vitest for core testing
2. **VitePress alignment:** Both use Vite, reducing configuration complexity
3. **ESM native:** Better for modern TypeScript monorepo structure
4. **Speed:** Faster test execution for rapid feedback during doc corrections

**Confidence:** HIGH

### Why markdown-link-check over alternatives?

1. **Mature:** 681 GitHub stars, actively maintained
2. **Configuration:** Supports patterns for ignoring false positives
3. **CI/CD ready:** Well-documented GitHub Actions integration
4. **Rate limiting:** Handles 429 responses with retry logic (important for external links)

**Confidence:** HIGH - Verified from official GitHub repo (last updated Nov 2025)

### Why markdownlint?

1. **Standard:** 5.8k GitHub stars, widely adopted
2. **Configurable:** 60+ rules, can disable/customize per project needs
3. **Extensible:** Custom rules for project-specific requirements
4. **IDE integration:** VSCode extension available for developer experience

**Confidence:** HIGH - Verified from official GitHub repo

### Why eslint-plugin-markdown v5+?

1. **Modern:** Supports ESLint 9 flat config (2025 standard)
2. **Virtual file system:** Treats code blocks as separate files for precise linting
3. **Language support:** Handles JS, TS, JSX, TSX code blocks
4. **Common practice:** Disable strict rules (no-undef, no-unused-vars) in docs is standard

**Confidence:** HIGH - Verified from official ESLint GitHub repo and 2025 best practices article

### Why TypeDoc?

1. **TypeScript native:** Designed specifically for TypeScript projects
2. **JSON output:** Provides structured data for programmatic verification
3. **Plugin ecosystem:** Can extend with custom themes and validation
4. **Widely used:** Standard tool for TypeScript library documentation

**Confidence:** HIGH - Verified from official TypeDoc site

### Why @microsoft/api-extractor?

1. **Microsoft maintained:** Used by VSCode, TypeScript, and other major projects
2. **API reports:** Generates `.api.md` files that can be committed and diffed
3. **Breaking change detection:** Automatically detects unintended API changes
4. **Monorepo support:** Designed for multi-package repos (matches PikaCSS structure)

**Confidence:** MEDIUM - Could not verify latest version from NPM (403), but tool is well-known and documented

### Why ts-morph?

1. **TypeScript Compiler API wrapper:** Easier to use than raw TS Compiler API
2. **AST manipulation:** Can extract detailed type information from source files
3. **Type checking:** Programmatically verify types match across docs and code
4. **Active maintenance:** Part of the TS ecosystem, regularly updated

**Confidence:** MEDIUM - Well-known tool, but version specifics not verified

## Testing Strategy Integration

The stack supports a comprehensive testing approach:

```
1. Static Analysis Layer
   ├─ markdownlint (markdown quality)
   ├─ eslint-plugin-markdown (code block syntax)
   └─ TypeScript compiler (type checking)

2. Link Verification Layer
   └─ markdown-link-check (internal/external links)

3. API Verification Layer
   ├─ TypeDoc (extract actual API)
   ├─ @microsoft/api-extractor (API surface reports)
   └─ ts-morph (detailed type comparisons)

4. Example Execution Layer
   ├─ VitePress transclusion (import examples into docs)
   └─ Vitest (test all imported examples)

5. Custom Verification Layer (project-specific)
   └─ Vitest tests comparing docs to source
```

## VitePress-Specific Patterns

### Code Snippet Transclusion (CRITICAL for this project)

VitePress supports importing code from actual files:

```markdown
<<< @/examples/basic-usage.ts{ts}
```

**Why this matters:**

1. Examples are real, executable TypeScript files
2. Tests run against the same files displayed in docs
3. Single source of truth - no copy-paste drift
4. IDE support for example files (autocomplete, errors)

**Implementation:**

```typescript
// examples/basic-usage.ts (stored in docs folder)
import { pika } from '@pikacss/core'

const styles = pika({ color: 'red' })

// examples/basic-usage.test.ts
import { test, expect } from 'vitest'
import { pika } from '@pikacss/core'

test('basic usage example works', () => {
  const styles = pika({ color: 'red' })
  expect(styles).toBeDefined()
})
```

**Confidence:** HIGH - This is VitePress's recommended pattern from official docs

### Inline Code Block Testing

For code blocks that can't be in separate files:

```typescript
// tests/docs/inline-examples.test.ts
import { describe, test } from 'vitest'
import * as fs from 'fs'
import { extractCodeBlocks } from './helpers'

describe('README.md code blocks', () => {
  const readme = fs.readFileSync('README.md', 'utf-8')
  const blocks = extractCodeBlocks(readme, 'typescript')
  
  blocks.forEach((block, index) => {
    test(`code block ${index + 1} is valid TypeScript`, () => {
      // Write to temp file, run tsc --noEmit
    })
  })
})
```

**Confidence:** MEDIUM - Common pattern but requires custom implementation

## CI/CD Integration

```yaml
# .github/workflows/docs-verification.yml
name: Verify Documentation

on: [push, pull_request]

jobs:
  verify:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Install dependencies
        run: pnpm install
      
      - name: Lint markdown
        run: pnpm exec markdownlint-cli2 "**/*.md"
      
      - name: Check markdown links
        run: pnpm exec markdown-link-check **/*.md --config .markdown-link-check.json
      
      - name: Lint code blocks
        run: pnpm exec eslint "**/*.md"
      
      - name: Type-check examples
        run: pnpm exec tsc --noEmit --project docs/tsconfig.json
      
      - name: Test examples
        run: pnpm test:docs
      
      - name: Verify API documentation
        run: pnpm run verify-api-docs
```

**Confidence:** HIGH - Standard CI patterns for documentation verification

## Sources

- **VitePress Markdown Documentation** (HIGH confidence) - https://vitepress.dev/guide/markdown - Verified Feb 2026
- **VitePress Code Snippet Best Practices** (HIGH confidence) - Web search result from recent VitePress community discussion, verified pattern from official docs
- **markdown-link-check GitHub** (HIGH confidence) - https://github.com/tcort/markdown-link-check - Latest release v3.14.2, Nov 2025
- **markdownlint GitHub** (HIGH confidence) - https://github.com/DavidAnson/markdownlint - Active maintenance, 5.8k stars
- **eslint-plugin-markdown GitHub** (HIGH confidence) - https://github.com/eslint/markdown - Official ESLint plugin
- **eslint-plugin-markdown 2025 Best Practices** (HIGH confidence) - Web search result describing flat config and v5+ features
- **TypeDoc Official Site** (HIGH confidence) - https://typedoc.org/ - Verified current documentation
- **@microsoft/api-extractor** (MEDIUM confidence) - Tool existence and purpose verified, but latest version not confirmed (NPM returned 403)
- **ts-morph** (MEDIUM confidence) - Well-known tool in TypeScript ecosystem, but specific version not verified

---
*Stack research for: PikaCSS Documentation Correction*  
*Researched: 2026-02-03*
