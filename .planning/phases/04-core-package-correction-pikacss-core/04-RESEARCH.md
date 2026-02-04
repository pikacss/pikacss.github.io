# Phase 4: Core Package Correction (@pikacss/core) - Research

**Researched:** 2026-02-04
**Domain:** Documentation accuracy verification and correction
**Confidence:** HIGH

## Summary

This phase applies the complete verification infrastructure (Phases 1-3) to systematically correct all @pikacss/core documentation. The research identified that PikaCSS has already built a comprehensive verification pipeline including ESLint markdown validation, custom PikaCSS-specific constraint rules, and a TypeScript Compiler API-based API verification system. The standard approach is test-driven correction: run verifiers, fix issues, re-verify until zero failures.

The verification tools already exist and are operational:
- **ESLint with markdown support** - Structural validation (Phase 1)
- **Custom ESLint rules** - PikaCSS-specific constraints (Phase 2)
- **API verifier package** - TypeScript API extraction and comparison (Phase 3)
- **Multi-bundler tests** - Vite, Nuxt, Webpack example validation (Phase 2)

The core documentation scope includes:
- `docs/advanced/api-reference.md` (466 lines) - Complete API reference
- `docs/guide/basics.md` (272 lines) - Core examples in user guide
- `packages/core/README.md` (201 lines) - Package README
- `AGENTS.md` (architecture section) - Internal documentation

**Primary recommendation:** Use sequential validation workflow (ESLint → API verifier → bundler tests) with zero-tolerance failure handling. Correct AGENTS.md first to establish correct architectural understanding before diving into API details.

## Standard Stack

The verification infrastructure is already built using established monorepo tools:

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| ESLint | 9.x | Markdown validation | Built-in markdown code block parsing via @antfu/eslint-config |
| @typescript-eslint/utils | 8.x | Custom rule creation | Standard for TypeScript-aware ESLint rules |
| TypeScript Compiler API | 5.x | API extraction | Official TypeScript compiler API for type analysis |
| Vitest | Latest | Test framework | Monorepo standard, used across all packages |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| unified/remark | Latest | Markdown AST parsing | API verifier uses for doc parsing |
| execa | Latest | Process execution | Multi-bundler test spawning |
| pathe | Latest | Cross-platform paths | Test fixture management |

### Installation
Already installed - no additional dependencies needed.

## Architecture Patterns

### Verification Pipeline Pattern

**Sequential validation workflow:**
```
1. ESLint (structural)
   ├─ Markdown syntax validation
   ├─ Code block formatting
   └─ Custom PikaCSS constraint rules
   
2. Link checker
   ├─ Internal documentation links
   └─ File references
   
3. API verifier
   ├─ Extract actual APIs from dist/*.d.mts
   ├─ Parse documented APIs from markdown
   ├─ Compare signatures
   └─ Report mismatches and missing coverage
   
4. Bundler tests
   ├─ Vite integration
   ├─ Nuxt integration
   └─ Webpack integration
```

**Why sequential:** Early-stage checks (ESLint) are fast and catch broad issues. Later-stage checks (bundler tests) are slow but precise. Fix issues at each stage before proceeding.

### Pattern 1: Test-Driven Correction

**What:** Run verifier → identify issue → fix → re-verify → repeat until zero failures

**When to use:** All documentation corrections in this phase

**Example workflow:**
```bash
# 1. Run verification
pnpm lint
scripts/verify-api-docs.sh
pnpm --filter @pikacss/api-verifier test

# 2. Fix identified issues in documentation

# 3. Re-verify
pnpm lint
scripts/verify-api-docs.sh

# 4. Repeat until clean
```

### Pattern 2: VitePress Transclusion for Examples

**What:** Store examples as standalone `.ts` files, reference in markdown via `<<< @/path/to/example.ts`

**When to use:** All code examples that need bundler validation

**Example:**
```markdown
<!-- In documentation -->
<<< @/../packages/core/tests/examples/basic-usage.ts

<!-- VitePress renders content of file -->
<!-- Multi-bundler tests validate file compiles -->
```

**Current usage:** Already used in `docs/guide/configuration.md`:
```markdown
<<< @/../packages/core/src/internal/types/engine.ts#EngineConfig
```

### Pattern 3: API Verifier Architecture

**How it works:**
```typescript
// 1. Extract actual APIs from compiled .d.ts files
const actualAPIs = extractPackageAPIs('packages/core/dist/index.d.mts')
// Uses TypeScript Compiler API: ts.createProgram() + checker.getExportsOfModule()

// 2. Parse documented APIs from markdown
const documentedAPIs = parseMarkdownAPIs('docs/advanced/api-reference.md')
// Uses unified/remark to parse markdown, extracts code blocks and type signatures

// 3. Compare
const mismatches = compareAPIs(actualAPIs, documentedAPIs)
// Reports: signature mismatches, missing documentation, hallucinated APIs
```

**Key insight:** API verifier treats code as source of truth, never modifies code to match docs.

### Anti-Patterns to Avoid

- **Modifying code to match documentation** - Documentation corrects to match code, never vice versa
- **Skipping verification steps** - Must run all verifiers, not just the ones you think are relevant
- **Fixing issues without re-verification** - Always re-run verifiers after fixes to confirm resolution
- **Manual verification** - Don't eyeball signatures; let TypeScript Compiler API extract precise types
- **Partial corrections** - Complete one file fully before moving to next (don't leave half-fixed files)

## Don't Hand-Roll

Problems that already have existing solutions in the verification infrastructure:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Type signature extraction | Manual string parsing of .d.ts files | TypeScript Compiler API via @pikacss/api-verifier | Handles complex types, generics, constraints correctly |
| Markdown code block validation | Custom regex parsers | ESLint with @antfu/eslint-config | Built-in markdown support, handles fenced blocks properly |
| Example bundler compatibility | Manual test scripts | `.eslint/tests/integration/bundlers.test.ts` | Already tests Vite, Nuxt, Webpack in isolated environments |
| API documentation comparison | Manual diffing | `scripts/verify-api-docs.sh` | Automated extraction + comparison with detailed reports |
| Link validation | Manual grep | `scripts/check-links.sh` | Handles internal links, file refs, anchor links |

**Key insight:** Phase 1-3 already built comprehensive verification infrastructure. Don't rebuild - use what exists.

## Common Pitfalls

### Pitfall 1: Hallucinated Examples in Documentation

**What goes wrong:** Documentation contains code examples that look correct but reference non-existent APIs or use incorrect signatures.

**Why it happens:** Documentation was written based on planned APIs that never shipped, or APIs changed after docs were written.

**How to avoid:** 
- Run API verifier to detect hallucinated APIs
- Move all examples to standalone `.ts` files validated by bundler tests
- Use VitePress transclusion to reference validated examples

**Warning signs:**
- API verifier reports "documented API not found in source"
- Bundler tests fail with "cannot find name X"
- TypeScript compilation errors in docs code blocks

### Pitfall 2: Signature Drift

**What goes wrong:** Documentation shows old API signatures after code evolved. Example: docs show `createEngine(config)` but actual signature is `createEngine(config?)` with optional parameter.

**Why it happens:** Code changes committed without updating documentation.

**How to avoid:**
- Always run `scripts/verify-api-docs.sh` after code changes
- Add API verification to CI pipeline
- Use TypeScript Compiler API extraction to get exact current signatures

**Warning signs:**
- API verifier reports signature mismatch
- Parameter optionality differences (required vs optional)
- Type constraint differences in generics

### Pitfall 3: Cross-File Inconsistency

**What goes wrong:** Same API documented differently in different files. Example: `api-reference.md` says Engine has `setup()` method, but `basics.md` shows usage without calling `setup()`.

**Why it happens:** Files corrected independently without cross-reference validation.

**How to avoid:**
- Correct AGENTS.md architecture section first (establishes ground truth)
- After correcting individual files, run cross-file consistency check
- Search for all occurrences of API name across docs before declaring complete

**Warning signs:**
- Same function shown with different parameter counts
- Conflicting usage examples in different guides
- README contradicts API reference

### Pitfall 4: Incomplete API Coverage

**What goes wrong:** Public APIs exist in code but have zero documentation.

**Why it happens:** APIs added to code but documentation task forgotten.

**How to avoid:**
- API verifier tracks coverage percentage
- Set coverage threshold (e.g., 80% of public APIs must be documented)
- Review API verifier's "missing documentation" report

**Warning signs:**
- API verifier shows low coverage percentage
- Public exports in `packages/core/src/index.ts` not found in docs
- Important utility functions undocumented

### Pitfall 5: Build-Time vs Runtime Confusion

**What goes wrong:** Documentation shows runtime usage of build-time-only constructs, or vice versa.

**Why it happens:** PikaCSS has split between build-time (`pika()` calls evaluated at build) and runtime (CSS variables for dynamic values).

**How to avoid:**
- Clearly mark build-time constraint in examples
- Use custom ESLint rule `pika-build-time` to validate examples
- Test examples in multi-bundler tests (build failures catch this)

**Warning signs:**
- Examples show `pika({ color: props.color })` (runtime variable)
- Missing CSS variable workaround explanation
- Bundler tests fail with evaluation errors

## Code Examples

Verified patterns from project infrastructure:

### Running Complete Verification Pipeline

```bash
# Source: Phases 1-3 verification infrastructure

# Step 1: ESLint validation (structural + PikaCSS constraints)
pnpm lint

# Step 2: Link validation
scripts/check-links.sh

# Step 3: API verification
scripts/verify-api-docs.sh

# Step 4: Multi-bundler tests (if examples changed)
pnpm --filter @pikacss/api-verifier test
cd .eslint && pnpm test:integration
```

### Using API Verifier Programmatically

```typescript
// Source: packages/api-verifier/src/index.ts

import { extractPackageAPIs, parseMarkdownAPIs, compareAPIs } from '@pikacss/api-verifier'

// Extract actual APIs from compiled types
const actualAPIs = await extractPackageAPIs('packages/core/dist/index.d.mts')

// Parse documented APIs
const documentedAPIs = await parseMarkdownAPIs('docs/advanced/api-reference.md')

// Compare and report
const result = compareAPIs(actualAPIs, documentedAPIs)

console.log(`Coverage: ${result.coveragePercent}%`)
console.log(`Mismatches: ${result.mismatches.length}`)
console.log(`Missing docs: ${result.missingDocs.length}`)
```

### VitePress Transclusion Syntax

```markdown
<!-- Source: docs/guide/configuration.md (existing usage) -->

<!-- Transclude entire file -->
<<< @/../packages/core/tests/examples/basic.ts

<!-- Transclude specific region with syntax highlighting -->
<<< @/../packages/core/tests/examples/advanced.ts#region-name {typescript}

<!-- Transclude type definition -->
<<< @/../packages/core/src/internal/types/engine.ts#EngineConfig
```

### Multi-Bundler Test Pattern

```typescript
// Source: .eslint/tests/integration/bundlers.test.ts

describe('vite Integration', () => {
  let testDir: string

  beforeEach(async () => {
    // Create isolated temp directory
    testDir = await mkdtemp(join(process.cwd(), '.temp-test-vite-'))
    
    // Copy fixture
    await cp('.eslint/tests/fixtures/vite', testDir, { recursive: true })
    
    // Install dependencies (workspace:* resolution)
    await execa('pnpm', ['install'], { cwd: testDir })
  })

  afterEach(async () => {
    await rm(testDir, { recursive: true, force: true })
  })

  it('should compile valid pika() examples', async () => {
    const result = await execa('pnpm', ['build'], { cwd: testDir })
    expect(result.exitCode).toBe(0)
  })
})
```

## State of the Art

The verification infrastructure represents current best practices as of Phase 1-3 completion:

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Manual documentation review | Automated API verification using TypeScript Compiler API | Phase 3 (2026-02-04) | Can detect signature mismatches automatically |
| Linting ignores markdown | ESLint validates markdown code blocks | Phase 1 (2026-02-03) | Structural issues caught automatically |
| No PikaCSS-specific validation | Custom ESLint rules for build-time constraints | Phase 2 (2026-02-03) | Invalid pika() patterns detected |
| Manual example testing | Multi-bundler integration tests (Vite/Nuxt/Webpack) | Phase 2 (2026-02-03) | Examples proven to work in real bundlers |

**Current state (2026-02-04):**
- Verification infrastructure complete and operational
- Ready for systematic documentation correction
- All tools tested and validated in Phases 1-3

## Open Questions

Some aspects that couldn't be fully resolved:

1. **API Coverage Threshold**
   - What we know: API verifier can track coverage percentage
   - What's unclear: What percentage is acceptable for @pikacss/core (80%? 100%?)
   - Recommendation: Start with 80% coverage target, aim for 100% of user-facing APIs. Internal utilities (prefixed with `_` or in `/internal/`) can be excluded.

2. **Example Transclusion Migration Timeline**
   - What we know: VitePress supports transclusion, it's already used in one file
   - What's unclear: Should all examples be migrated in Phase 4, or incrementally?
   - Recommendation: Migrate examples that fail bundler tests. Examples that already work can migrate incrementally.

3. **AGENTS.md Correction Depth**
   - What we know: AGENTS.md should be corrected first, focusing on architecture section
   - What's unclear: How much detail is needed in AGENTS.md vs delegating to API reference?
   - Recommendation: AGENTS.md should have accurate high-level architecture and package responsibilities. Detailed API signatures belong in api-reference.md.

4. **Cross-Package Documentation**
   - What we know: Phase 4 focuses on @pikacss/core only
   - What's unclear: If core docs reference integration/unplugin, do those get corrected too?
   - Recommendation: Fix references to other packages only when they appear in core docs. Full correction of other packages happens in later phases.

## Sources

### Primary (HIGH confidence)

- **Project codebase** - Direct inspection of verification infrastructure
  - `.planning/phases/01-foundation-verification-infrastructure/` - ESLint markdown validation
  - `.planning/phases/02-pikacss-specific-verification-rules/` - Custom ESLint rules + multi-bundler tests
  - `.planning/phases/03-api-verification-system/` - API verifier architecture
  - `packages/api-verifier/src/` - TypeScript Compiler API extraction logic
  - `.eslint/tests/integration/bundlers.test.ts` - Multi-bundler test patterns
  - `scripts/verify-api-docs.sh` - Verification execution script

- **Project documentation** - Current state of documentation
  - `docs/advanced/api-reference.md` - 466 lines, complete API reference
  - `docs/guide/basics.md` - 272 lines, core examples
  - `packages/core/README.md` - 201 lines, package README
  - `AGENTS.md` - Architecture and package responsibilities

- **TypeScript ecosystem** - Official APIs used in verifier
  - TypeScript Compiler API documentation
  - @typescript-eslint/utils documentation

### Secondary (MEDIUM confidence)

- **VitePress documentation** - Transclusion feature confirmed by existing usage in `docs/guide/configuration.md` showing `<<< @/...` syntax

### Tertiary (LOW confidence)

None - all findings verified against actual project codebase.

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - All tools already installed and operational in monorepo
- Architecture: HIGH - Verification patterns established in Phases 1-3 with working implementations
- Pitfalls: HIGH - Identified from Phase 1-3 implementation experiences and user context decisions

**Research date:** 2026-02-04
**Valid until:** 2026-03-04 (30 days - stable infrastructure, tools unlikely to change)

**Note on sources:** This research is based entirely on the existing PikaCSS monorepo codebase inspection. Phases 1-3 already built complete verification infrastructure, so no external research needed. All patterns and tools are verified working implementations.
