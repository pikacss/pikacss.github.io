# Phase 1: Foundation & Verification Infrastructure - Research

**Researched:** 2026-02-03
**Domain:** Markdown documentation verification, ESLint configuration, CI/CD integration
**Confidence:** HIGH

## Summary

Phase 1 establishes automated verification infrastructure for 73 markdown files across PikaCSS documentation. The core challenge is enabling ESLint markdown validation without false positives from code blocks, while integrating with existing CI pipeline through lint-staged + simple-git-hooks.

**Current blocker:** All markdown files are ignored in `eslint.config.mjs` due to code block false positives (ellipsis syntax, incomplete examples causing ESLint to treat them as standalone TypeScript files).

**Solution approach:** Use ESLint's official `@eslint/markdown` plugin (v5.x, flat config compatible) which provides a processor to handle code blocks as virtual files, allowing granular rule configuration. For code examples requiring execution verification, VitePress transclusion (`<<< @/path/to/file.ts`) imports external test files that Vitest can verify.

**Primary recommendation:** Configure `@eslint/markdown` plugin with flat config, disable problematic rules for code snippets (e.g., `no-undef`, `no-unused-vars`), and defer code block migration to Phase 2 while establishing structural validation baseline in Phase 1.

## Standard Stack

The established libraries/tools for this domain:

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| `@eslint/markdown` | 5.x+ | Markdown linting with code block extraction | Official ESLint plugin, flat config native, virtual file processor |
| `eslint` | 9.39.2 | JavaScript/TypeScript linter (already installed) | Industry standard, flat config (eslint.config.mjs) |
| `markdownlint` | Latest | Markdown style checking | Comprehensive rule set (60+ rules), used by GitHub, VS Code extension |
| `vitepress` | 2.0.0-alpha.15 | Documentation framework (already installed) | Native transclusion support, used by PikaCSS |
| `vitest` | 4.0.16 | Test runner (already installed) | Fast, Vite-native, existing monorepo setup |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `lint-staged` | 16.2.7 | Pre-commit hook execution (already installed) | Already configured, runs `eslint --fix` |
| `simple-git-hooks` | 2.13.1 | Git hooks manager (already installed) | Already configured with pre-commit |
| `lychee` | Latest | Link checker (Rust-based) | Fast external link validation, rate-limit handling |
| `markdown-link-check` | Latest | Node-based link checker | Fallback if Rust toolchain unavailable |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| `@eslint/markdown` | `remark-lint` | Remark ecosystem powerful but requires different workflow, ESLint already integrated |
| `markdownlint` | Built-in ESLint rules only | ESLint markdown rules cover structural issues but miss markdown-specific style (heading levels, list formatting) |
| `lychee` | GitHub Action only | CI-only validation misses local pre-commit verification |

**Installation:**
```bash
# Install markdown linting plugins
pnpm add -D @eslint/markdown markdownlint-cli2

# Optional: Link checker (Rust-based, requires cargo)
cargo install lychee
# OR Node-based fallback
pnpm add -D markdown-link-check
```

## Architecture Patterns

### Recommended Project Structure
```
.planning/
├── phases/
│   └── 01-foundation-verification-infrastructure/
│       ├── 01-CONTEXT.md                    # User decisions
│       ├── 01-RESEARCH.md                   # This file
│       └── 01-PLAN.md                       # To be created
docs/
├── .vitepress/
│   └── config.ts                            # VitePress config with transclusion
├── examples/                                # External code files for transclusion
│   └── basics/
│       └── simple-example.ts                # Actual test files
└── **/*.md                                  # 73 markdown files to validate
tests/
└── docs/                                    # Test suite for code examples
    └── examples.test.ts                     # Vitest tests
eslint.config.mjs                            # Flat config with markdown support
.markdownlint.json                           # Markdown style rules
```

### Pattern 1: ESLint Flat Config with Markdown Processor
**What:** Use `@eslint/markdown` plugin to extract code blocks into virtual files
**When to use:** All markdown validation, replaces ignored patterns
**Example:**
```javascript
// Source: https://github.com/eslint/markdown
import markdown from "@eslint/markdown";

export default [
  {
    files: ["**/*.md"],
    plugins: { markdown },
    processor: "markdown/markdown"
  },
  {
    // Code blocks treated as virtual files: README.md/0.js
    files: ["**/*.md/*.js", "**/*.md/*.ts"],
    rules: {
      "no-unused-vars": "off",     // Examples often incomplete
      "no-undef": "off",            // Examples don't include imports
      "no-console": "off"           // Examples use console.log
    }
  }
];
```

### Pattern 2: VitePress Code Transclusion
**What:** Import external files as code blocks using `<<< @/filepath`
**When to use:** Code examples that must execute successfully
**Example:**
```markdown
<!-- In docs/guide/basics.md -->
## Basic Usage

<<< @/examples/basics/simple-example.ts{2-5}

<!-- Imports lines 2-5 from actual test file -->
```

```typescript
// In examples/basics/simple-example.ts
import { pika } from '@pikacss/core'

// #region basic-usage
const styles = pika({ color: 'red' })
console.log(styles) // "pika-abc123"
// #endregion basic-usage
```

### Pattern 3: Vitest Documentation Tests
**What:** Test external code files that are transcluded into docs
**When to use:** Verify VERIFY-02 (all code examples execute successfully)
**Example:**
```typescript
// Source: Vitest documentation patterns
import { describe, it, expect } from 'vitest'
import { pika } from '@pikacss/core'

describe('Documentation Examples', () => {
  it('basic usage example executes', () => {
    const styles = pika({ color: 'red' })
    expect(styles).toMatch(/^pika-[a-z0-9]+$/)
  })
})
```

### Pattern 4: Progressive Directory Enablement
**What:** Remove markdown ignores incrementally by directory
**When to use:** Avoid overwhelming failures, allow gradual migration
**Example:**
```javascript
// Phase 1: Enable only READMEs
export default [
  {
    files: ["**/README.md"],
    ignores: [] // Remove from global ignores
  }
]

// Phase 2: Enable docs/guide/
export default [
  {
    files: ["docs/guide/**/*.md"]
  }
]

// Phase 3: Enable all docs/
export default [
  {
    files: ["docs/**/*.md"]
  }
]
```

### Anti-Patterns to Avoid
- **Checking all links on every commit:** Rate limits, slow CI, unrelated failures
- **Treating warnings as errors initially:** Causes immediate CI failures before migration
- **Hand-rolling markdown parsers:** Complex, misses edge cases (front matter, tables, GFM)
- **Inline code blocks for executable examples:** Can't be tested, no syntax validation
- **Global rule disables without scoping:** Misses real issues in prose vs code

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Markdown parsing | Regex-based link extractor | `@eslint/markdown` processor | Handles front matter, code blocks, nested structures, CommonMark spec |
| Link validation | `fetch()` loop over URLs | `lychee` or `markdown-link-check` | Rate limiting, caching, retry logic, relative path resolution |
| Code block extraction | String splitting on backticks | VitePress transclusion + Vitest | Syntax highlighting, region support, automatic testing |
| Markdown style checking | Custom AST walker | `markdownlint` | 60+ rules, configurable, VS Code integration |
| File reference validation | `fs.existsSync()` checks | ESLint `import/no-unresolved` | Handles aliases (`@/`), module resolution, monorepo paths |

**Key insight:** Markdown linting ecosystem has mature solutions for every verification need. Custom solutions miss edge cases (GFM tables, directives, math blocks) and lack IDE integration.

## Common Pitfalls

### Pitfall 1: ESLint Treating Code Blocks as Standalone Files
**What goes wrong:** Code blocks with `...` ellipsis or incomplete imports cause linting errors
**Why it happens:** ESLint parses each code block independently without document context
**How to avoid:** Use `@eslint/markdown` processor + disable `no-undef`, `no-unused-vars` for `**/*.md/*.js` virtual files
**Warning signs:** Errors like "Unexpected token '...'" or "'someFunction' is not defined" in markdown files

### Pitfall 2: External Link Checkers Hitting Rate Limits
**What goes wrong:** CI fails because GitHub/LinkedIn/Twitter return 403/429 errors
**Why it happens:** Too many requests from CI server IP, no caching between runs
**How to avoid:** Use `lychee` with `--cache` flag, cache file in CI, exclude problematic domains
**Warning signs:** Intermittent CI failures on same links, 403/429 HTTP errors

### Pitfall 3: Markdown Ignores Hide Real Issues
**What goes wrong:** Current `ignores: ["docs/**/*.md"]` in eslint.config.mjs prevents any validation
**Why it happens:** Previous attempt to lint markdown caused code block false positives
**How to avoid:** Replace global ignore with processor-based approach, scope rules per file type
**Warning signs:** No markdown validation runs, broken links/syntax not caught until manual review

### Pitfall 4: VitePress Transclusion Path Resolution
**What goes wrong:** `<<< @/examples/file.ts` paths break when docs are moved
**Why it happens:** `@` alias resolves to source root, not documented consistently
**How to avoid:** Use relative paths for local files, `@` only for cross-directory references
**Warning signs:** Build-time errors "File not found", broken code blocks in rendered docs

### Pitfall 5: Test Files Not Matching Documentation
**What goes wrong:** External file changes, docs outdated, tests still pass
**Why it happens:** No enforcement that transcluded files match test assertions
**How to avoid:** Use region markers (`#region`, `#endregion`), test the exact transcluded region
**Warning signs:** Documentation shows different code than what tests verify

## Code Examples

Verified patterns from official sources:

### ESLint Markdown Configuration (Flat Config)
```javascript
// Source: https://github.com/eslint/markdown#usage
import markdown from "@eslint/markdown";

export default [
  // Step 1: Enable markdown processor
  {
    files: ["**/*.md"],
    plugins: { markdown },
    processor: "markdown/markdown",
    rules: {
      // Prose-level rules (optional)
      "markdown/no-html": "warn"
    }
  },
  
  // Step 2: Configure code block linting
  {
    files: ["**/*.md/*.js", "**/*.md/*.ts"],
    rules: {
      "no-unused-vars": "off",
      "no-undef": "off",
      "@typescript-eslint/no-unused-vars": "off"
    }
  }
];
```

### VitePress Region-Based Transclusion
```markdown
<!-- Source: https://vitepress.dev/guide/markdown#import-code-snippets -->
## Example

<<< @/examples/basics.ts#basic-usage{2}

<!-- Imports only #region basic-usage, highlights line 2 -->
```

```typescript
// examples/basics.ts
// #region basic-usage
export function example() {
  return "highlighted code"
}
// #endregion basic-usage
```

### Markdownlint Configuration
```json
// Source: https://github.com/DavidAnson/markdownlint
{
  "default": true,
  "MD013": false,                    // Disable line length
  "MD033": { "allowed_elements": ["kbd", "br"] },  // Allow specific HTML
  "MD041": false                     // First line doesn't need H1 (front matter)
}
```

### Lychee Link Checker (CI)
```yaml
# Source: https://github.com/lycheeverse/lychee-action
- name: Link Checker
  uses: lycheeverse/lychee-action@v1.9.0
  with:
    args: >
      --cache 
      --max-cache-age 1d
      --exclude "https://localhost:.*"
      --accept 200,429
      "docs/**/*.md"
    fail: true
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `.eslintrc.json` | `eslint.config.mjs` flat config | ESLint 9.0 (2024) | Simpler, JavaScript-based, no `extends` arrays |
| `eslint-plugin-markdown` (unofficial) | `@eslint/markdown` (official) | 2024 | Official support, better maintenance, flat config native |
| `remark-cli` separate workflow | ESLint processor integration | 2024-2025 | Single tool, unified config, IDE integration |
| Check all links every commit | Cached + scheduled checks | 2025-2026 | Faster CI, avoids rate limits, catches link rot |

**Deprecated/outdated:**
- `markdown-it` factory in `markdownlint`: Now optional, only needed for custom rules
- `resultVersion` in markdownlint API: Removed, use helper functions for legacy formats
- Legacy `.eslintrc.*` formats: Not supported by ESLint 9+, must migrate to flat config

## Open Questions

Things that couldn't be fully resolved:

1. **Code block migration scope**
   - What we know: VitePress transclusion works, examples can reference external files
   - What's unclear: Whether to migrate all code blocks in Phase 1 or just establish baseline
   - Recommendation: Phase 1 establishes structural validation (links, syntax), defer code block migration to Phase 2 (allows progressive enablement)

2. **Markdownlint vs ESLint markdown plugin overlap**
   - What we know: Both check markdown, ESLint covers code, markdownlint covers style
   - What's unclear: Whether to use both or just ESLint with markdown plugin
   - Recommendation: Use both - ESLint for integration with existing workflow, markdownlint-cli2 for markdown-specific style rules (heading levels, list indentation)

3. **Link checking frequency**
   - What we know: Every commit is too expensive, manual is too infrequent
   - What's unclear: Optimal schedule for external link validation
   - Recommendation: Pre-commit checks internal links only, scheduled weekly CI run for external links with caching

## Sources

### Primary (HIGH confidence)
- [@eslint/markdown v7.5.1 GitHub](https://github.com/eslint/markdown) - Official ESLint markdown plugin documentation
- [VitePress v2.0 Markdown Guide](https://vitepress.dev/guide/markdown) - Code snippet import documentation
- [markdownlint v0.40.0 GitHub](https://github.com/DavidAnson/markdownlint) - Markdown linting library and rules

### Secondary (MEDIUM confidence)
- [Lychee Link Checker 2026 Best Practices](https://github.com/lycheeverse/lychee) - Rate limiting, caching strategies verified from GitHub discussions
- ESLint flat config patterns from web search (2026) - Syntax verified against official ESLint docs

### Tertiary (LOW confidence)
- None - All findings verified with official documentation

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - All tools actively maintained, versions verified from package.json/pnpm-workspace.yaml
- Architecture: HIGH - Patterns sourced from official documentation, existing project structure confirms approach
- Pitfalls: HIGH - Identified from actual project state (eslint.config.mjs ignores) and official tool documentation

**Research date:** 2026-02-03
**Valid until:** 2026-03-03 (30 days - stable ecosystem, ESLint/VitePress mature)
