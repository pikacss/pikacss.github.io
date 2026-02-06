# Architecture Research

**Domain:** Documentation Verification/Correction System
**Researched:** 2026-02-03
**Confidence:** HIGH

## Standard Architecture

### System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    Verification Layer                        │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐        │
│  │  Link   │  │ Example │  │  Code   │  │  Type   │        │
│  │ Checker │  │  Tester │  │  Ref    │  │  Check  │        │
│  └────┬────┘  └────┬────┘  └────┬────┘  └────┬────┘        │
│       │            │            │            │              │
├───────┴────────────┴────────────┴────────────┴──────────────┤
│                   Test Runner Layer                          │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────────┐    │
│  │             Vitest Test Suite                        │    │
│  │  (test/docs/*.test.ts)                               │    │
│  └─────────────────────────────────────────────────────┘    │
├─────────────────────────────────────────────────────────────┤
│                   Analysis Layer                             │
├─────────────────────────────────────────────────────────────┤
│  ┌──────────┐  ┌──────────┐  ┌──────────┐                   │
│  │ Markdown │  │   Code   │  │  Source  │                   │
│  │  Parser  │  │ Extractor│  │  Reader  │                   │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘                   │
│       │             │              │                         │
├───────┴─────────────┴──────────────┴─────────────────────────┤
│                    Source Layer                              │
├─────────────────────────────────────────────────────────────┤
│  ┌──────────┐  ┌──────────┐  ┌──────────┐                   │
│  │  docs/   │  │ .github/ │  │packages/ │                   │
│  │   *.md   │  │ skills/  │  │  src/    │                   │
│  └──────────┘  └──────────┘  └──────────┘                   │
└─────────────────────────────────────────────────────────────┘
```

### Component Responsibilities

| Component | Responsibility | Typical Implementation |
|-----------|----------------|------------------------|
| **Link Checker** | Verify internal/external links in docs | Parse markdown links, validate file paths, check HTTP URLs |
| **Example Tester** | Execute code examples in documentation | Extract code blocks, run against actual package APIs, verify outputs |
| **Code Reference** | Validate `file:line` references | Parse `path:line` patterns, verify file existence, check line validity |
| **Type Checker** | Ensure API examples type-check | Run TypeScript compiler on embedded code, verify type definitions |
| **Markdown Parser** | Extract testable elements from docs | Parse markdown AST, identify code blocks, extract links |
| **Code Extractor** | Pull API signatures from source | Read package source code, extract exported functions/types |
| **Source Reader** | Load documentation files | File I/O, glob patterns, dependency-aware ordering |

## Recommended Project Structure

```
test/
├── docs/                          # Documentation verification tests
│   ├── links.test.ts              # Link validation (internal + external)
│   ├── examples.test.ts           # Code example execution
│   ├── references.test.ts         # file:line reference validation
│   ├── types.test.ts              # Type correctness verification
│   └── utils/                     # Shared test utilities
│       ├── markdown-parser.ts     # Parse markdown for testable elements
│       ├── code-extractor.ts      # Extract source code signatures
│       └── test-helpers.ts        # Common assertion helpers
│
├── fixtures/                      # Test data and examples
│   ├── valid-docs/               # Known-good documentation
│   └── invalid-docs/             # Known-bad documentation (for negative tests)
│
scripts/
├── verify-docs.ts                # CLI tool to run verification suite
└── fix-docs.ts                   # Auto-fix simple issues (optional)

.planning/
└── docs-verification/            # Verification tracking
    ├── core-checklist.md         # @pikacss/core verification status
    ├── integration-checklist.md  # @pikacss/integration verification status
    └── [package]-checklist.md    # Per-package verification tracking
```

### Structure Rationale

- **test/docs/**: Follows existing Vitest test organization in PikaCSS monorepo (`packages/*/tests/`)
- **Separate test files by concern**: Makes it easy to run specific verification types (e.g., only link checking)
- **Package-based checklists**: Aligns with monorepo dependency order (core → integration → unplugin → framework adapters)
- **utils/ folder**: Reusable parsers and extractors avoid duplication across test files
- **fixtures/**: Standard testing practice for regression testing

## Architectural Patterns

### Pattern 1: Source-of-Truth Verification

**What:** Verification tests compare documentation against actual source code, not against expected static values

**When to use:** Always - documentation should reflect reality, not assertions

**Trade-offs:**
- ✅ PRO: Tests automatically detect when code changes break docs
- ✅ PRO: Forces documentation to stay synchronized with implementation
- ❌ CON: Requires parsing source code and type definitions
- ❌ CON: Tests depend on build artifacts being available

**Example:**
```typescript
// Test: docs/advanced/api-reference.md
import { Engine } from '@pikacss/core'

describe('API Reference - Engine class', () => {
  it('should document all public methods', async () => {
    // Extract from actual source code
    const sourceMethods = await extractExportedMethods('@pikacss/core', 'Engine')
    
    // Extract from documentation
    const docMethods = await extractApiMethodsFromDocs('docs/advanced/api-reference.md', 'Engine')
    
    // Verify completeness
    expect(docMethods).toEqual(sourceMethods)
  })
})
```

### Pattern 2: Dependency-Ordered Verification

**What:** Verify documentation in dependency order: core → integration → framework adapters → plugins

**When to use:** When running full verification suite to minimize cascading failures

**Trade-offs:**
- ✅ PRO: Core package errors don't pollute dependent package reports
- ✅ PRO: Matches natural workflow (fix foundation first)
- ❌ CON: Requires test orchestration (can't rely on pure test parallelization)
- ❌ CON: Slower than full parallel execution

**Example:**
```typescript
// scripts/verify-docs.ts
const verificationOrder = [
  '@pikacss/core',
  '@pikacss/integration',
  '@pikacss/unplugin-pikacss',
  '@pikacss/vite-plugin-pikacss',
  '@pikacss/nuxt-pikacss',
  '@pikacss/plugin-icons',
  '@pikacss/plugin-reset',
  '@pikacss/plugin-typography'
]

for (const pkg of verificationOrder) {
  await runTests(`test/docs/${pkg}.test.ts`)
  if (hasFailed()) break // Don't continue if foundation broken
}
```

### Pattern 3: Test-Driven Documentation Correction

**What:** Write failing tests first that specify what correct documentation should contain, then update docs to pass

**When to use:** For systematic documentation correction (this project's approach)

**Trade-offs:**
- ✅ PRO: Clear verification of what's fixed vs. still broken
- ✅ PRO: Prevents regression after fixing documentation
- ✅ PRO: Provides measurable progress tracking
- ❌ CON: Requires upfront test-writing effort
- ❌ CON: Test suite maintenance as codebase evolves

**Example:**
```typescript
// Step 1: Write failing test
describe('docs/guide/basics.md', () => {
  it('should mention pika() function signature', async () => {
    const content = await readDocs('docs/guide/basics.md')
    expect(content).toContain('pika(styles: StyleDefinition)')
  })
})

// Step 2: Run test → FAILS
// Step 3: Update docs/guide/basics.md to include pika() signature
// Step 4: Run test → PASSES
```

### Pattern 4: Progressive Enhancement Verification

**What:** Start with basic checks (links, syntax), then add semantic checks (types, examples), then deep checks (cross-references)

**When to use:** When building verification system incrementally

**Trade-offs:**
- ✅ PRO: Get value early (catch broken links immediately)
- ✅ PRO: Natural prioritization (syntax errors before semantic errors)
- ✅ PRO: Easier to implement and debug
- ❌ CON: May miss integration issues until later phases

**Build order:**
1. **Phase 1 - Structural**: Links, file references, markdown syntax
2. **Phase 2 - Syntactic**: Code examples syntax-check (no execution)
3. **Phase 3 - Semantic**: Type checking, example execution
4. **Phase 4 - Integration**: Cross-package references, consistency

## Data Flow

### Verification Flow

```
Documentation Files (*.md)
    ↓
[Parse] → Extract testable elements
    ↓
    ├─→ Links → [Validate] → Report broken links
    ├─→ Code blocks → [Extract] → [Execute] → Report failures
    ├─→ file:line refs → [Validate] → Report invalid references
    └─→ Type examples → [Type-check] → Report type errors
    ↓
[Aggregate Results] → Test Report
    ↓
[Update Docs] ← Failing tests guide corrections
    ↓
[Re-run Tests] → Verify fixes
```

### Correction Workflow

```
Source Code (packages/*/src/)
    ↓
[Extract Signatures] → API inventory
    ↓
    ├─→ Compare with docs/advanced/api-reference.md
    ├─→ Compare with skills/*/references/
    └─→ Compare with docs/guide/*.md examples
    ↓
[Generate Diff Report] → What's missing/incorrect
    ↓
[Update Documentation] ← Manual or semi-automated
    ↓
[Run Verification Tests] → Confirm fixes
```

### Dependency-Based Processing

```
@pikacss/core (docs/, tests/)
    ↓ (verify first - foundation)
@pikacss/integration (docs/, tests/)
    ↓ (depends on core)
@pikacss/unplugin-pikacss (docs/, tests/)
    ↓ (depends on integration)
@pikacss/vite-plugin-pikacss (docs/, tests/)
@pikacss/nuxt-pikacss (docs/, tests/)
    ↓ (depends on unplugin)
@pikacss/plugin-* (docs/, tests/)
    ↓ (depends on core)
AGENTS.md, README.md, skills/ (project-level docs)
```

**Key principle:** Fix foundation before building on top. Don't correct integration docs if core docs are wrong.

## Scaling Considerations

| Scale | Architecture Adjustments |
|-------|--------------------------|
| 73 files (current) | Simple test suite per verification type, run serially by dependency order |
| 200+ files | Introduce caching (parse results, extracted signatures), parallelize within dependency level |
| 1000+ files | Distributed verification (CI matrix), incremental verification (only changed files), pre-computed indexes |

### Scaling Priorities

1. **First bottleneck:** Parsing markdown files repeatedly
   - **Fix:** Cache parsed AST, invalidate on file change
   - **Implementation:** Use vitest's file watching + in-memory cache

2. **Second bottleneck:** Running all code examples on every test run
   - **Fix:** Incremental testing (only run examples in changed docs)
   - **Implementation:** Git diff-based test selection

3. **Third bottleneck:** Type checking embedded code examples
   - **Fix:** Compile examples to single TypeScript project, use tsc once
   - **Implementation:** Generate temporary .ts files, batch type-check

## Anti-Patterns

### Anti-Pattern 1: Manual Synchronization

**What people do:** Manually read code, manually update docs, hope they match

**Why it's wrong:** 
- Human error inevitable with 73+ files
- No verification that docs stayed synchronized after updates
- Time-consuming and error-prone

**Do this instead:** Write verification tests that automatically detect drift between code and docs

### Anti-Pattern 2: Snapshot Testing for Documentation

**What people do:** Use vitest snapshots to "lock in" current documentation state

**Why it's wrong:**
- Snapshots capture current state, not correctness
- Doesn't verify against source code (source of truth)
- Easy to blindly update snapshots without reviewing

**Do this instead:** Compare documentation against actual source code/types/behavior

### Anti-Pattern 3: External Documentation URLs as References

**What people do:** Link to external documentation (GitHub, npm) instead of local files

**Why it's wrong:**
- External links break when pages move
- Version mismatches (link to v0.1, project is v0.39)
- Can't verify correctness locally

**Do this instead:** Reference local files with `file:line` notation, test with link checker

### Anti-Pattern 4: Documentation in Multiple Canonical Sources

**What people do:** Maintain parallel documentation in `docs/` and `docs/llm/` with similar content

**Why it's wrong:**
- Duplication causes divergence (one gets updated, other doesn't)
- Unclear which is authoritative
- Double maintenance burden

**Do this instead:** Single source of truth (main docs/), derive LLM-specific views if needed, or merge fully

### Anti-Pattern 5: Tests That Don't Fail When Docs Are Wrong

**What people do:** Write tests that pass by default or only check documentation syntax

**Why it's wrong:**
- False confidence that docs are correct
- No actionable signal when docs drift from reality

**Do this instead:** Tests should fail when documentation is incorrect or incomplete, providing clear error messages on what to fix

## Integration Points

### Internal System Boundaries

| Boundary | Communication | Notes |
|----------|---------------|-------|
| **Test Layer ↔ Analysis Layer** | Function calls (in-process) | Parsers exposed as utility functions |
| **Analysis Layer ↔ Source Layer** | File I/O (fs.readFile, glob) | Async operations, handle missing files gracefully |
| **Verification Tests ↔ Source Code** | Import actual packages | Requires packages to be built first |

### External Tool Dependencies

| Tool | Purpose | Integration Pattern |
|------|---------|---------------------|
| **Vitest** | Test runner | Standard `vitest.config.ts`, run via `pnpm test` |
| **TypeScript Compiler API** | Type-check embedded examples | `ts.createProgram()`, compile in-memory |
| **markdown-it / remark** | Parse markdown to AST | Parse once, cache results, extract structured data |
| **@pikacss/core (etc.)** | Source of truth for APIs | Import packages, use actual exports in tests |
| **tsx / ts-node** | Execute TypeScript examples | Run extracted code blocks in isolated context |

### Package-Specific Considerations

For PikaCSS monorepo:
- **All packages must be built** before verification (`pnpm build`)
- **Workspace dependencies**: Use `workspace:*` protocol, resolve via pnpm
- **Generated files**: `pika.gen.css`, `pika.gen.ts` excluded from verification
- **Plugin augmentation**: Tests must load plugin type definitions to verify docs

## Build Order and Suggested Implementation Phases

### Phase 1: Foundation (Structural Verification)

**Goal:** Catch basic documentation structure issues

**Components to build:**
1. Markdown parser (extract links, code blocks, file references)
2. Link checker (validate internal file paths)
3. File reference validator (check `file:line` patterns)

**Test coverage:**
- All internal `[text](./path.md)` links resolve
- All `file:line` references point to existing files/lines
- No broken relative paths

**Value:** Immediate payoff - broken links are easy to fix and highly visible

**Estimated effort:** 1-2 days

### Phase 2: Code Example Validation

**Goal:** Ensure code examples are syntactically valid

**Components to build:**
1. Code block extractor (identify TypeScript/JavaScript blocks)
2. Syntax validator (parse with TypeScript, don't execute)
3. Import validator (check imports reference real packages)

**Test coverage:**
- All code examples parse without syntax errors
- All imports reference packages that exist in workspace
- Code examples follow project conventions

**Value:** Prevents embarrassing syntax errors in published docs

**Estimated effort:** 2-3 days

### Phase 3: Type Correctness

**Goal:** Verify code examples type-check against actual APIs

**Components to build:**
1. Type checker integration (use TypeScript compiler API)
2. Example context builder (generate necessary imports/types)
3. Type error reporter (map errors back to documentation lines)

**Test coverage:**
- All code examples type-check correctly
- Type definitions in docs match actual exports
- No outdated API signatures

**Value:** Most impactful - ensures documentation matches reality

**Estimated effort:** 3-5 days (complexity in context setup)

### Phase 4: Execution Testing (Optional)

**Goal:** Run code examples and verify they work as documented

**Components to build:**
1. Isolated execution environment
2. Output capture and assertion
3. Setup/teardown for examples

**Test coverage:**
- Examples that claim output X actually produce output X
- Examples don't throw runtime errors

**Value:** Highest confidence, but most fragile (requires exact environment setup)

**Estimated effort:** 3-4 days

### Phase 5: Cross-Reference and Consistency

**Goal:** Verify documentation is internally consistent and complete

**Components to build:**
1. API inventory extractor (scan source code for all exports)
2. Documentation coverage analyzer (which APIs are documented)
3. Consistency checker (same API described consistently across files)

**Test coverage:**
- Every public API is documented somewhere
- API descriptions don't contradict across files
- Skills/AGENTS.md consistent with main docs

**Value:** Completeness guarantee, prevents hidden features

**Estimated effort:** 2-3 days

## Recommended Build Order

1. **Phase 1 - Foundation** (start here - easy wins)
2. **Phase 2 - Code Examples** (moderate complexity, high value)
3. **Phase 3 - Type Correctness** (hardest, highest impact)
4. **Phase 5 - Coverage** (optional but valuable for completeness)
5. **Phase 4 - Execution** (optional, highest maintenance burden)

**Rationale:**
- Get quick value from structural checks (Phase 1)
- Build parsing infrastructure in Phase 2 (reused in later phases)
- Phase 3 is the core value proposition (docs match reality)
- Phase 5 uses infrastructure from Phases 2-3
- Phase 4 is optional enhancement (runtime execution)

## Correction Workflow Integration

### Test-Driven Correction Loop

```
FOR each package in dependency order:
  1. Identify documentation files (docs/*, skills/*, README.md)
  2. Write verification tests for that package
     - Link validation
     - Code example type checking
     - API reference completeness
  3. Run tests → capture failures
  4. Update documentation to fix failures
  5. Re-run tests → verify fixes
  6. Commit docs + tests together (atomic correction)
  NEXT package
```

### Tracking Progress

Use per-package checklists in `.planning/docs-verification/`:

```markdown
# @pikacss/core Documentation Verification

## Status: IN PROGRESS

### Link Validation
- [x] docs/guide/basics.md
- [x] docs/guide/configuration.md
- [ ] docs/advanced/api-reference.md

### Code Examples
- [x] docs/guide/basics.md
- [ ] docs/advanced/plugin-development.md

### Type Correctness
- [ ] docs/advanced/api-reference.md

### API Coverage
- [ ] All exports documented
```

### Automation Opportunities

**Semi-automated fixes:**
- Broken internal links (can auto-generate correct paths)
- File:line references (can auto-update line numbers)
- Missing imports in examples (can infer from usage)

**Manual fixes required:**
- Outdated API descriptions
- Incorrect conceptual explanations
- Missing documentation for new features

## Sources

- **PikaCSS AGENTS.md**: Project architecture, monorepo structure, testing patterns
- **PikaCSS package.json**: Build system (Vitest, pnpm), existing test infrastructure
- **PikaCSS docs/ directory**: 51 markdown files covering guides, API reference, integrations
- **PikaCSS skills/**: pikacss-dev and pikacss-expert skills with reference documentation
- **Existing test structure**: packages/*/tests/ shows Vitest patterns with unit/integration organization
- **Documentation verification systems**: Common patterns from OSS projects (TypeScript docs, MDN, Rust docs)
- **Markdown testing tools**: remark, markdown-it (parsing), @typescript/twoslash (type checking examples)

---
*Architecture research for: PikaCSS Documentation Correction*
*Researched: 2026-02-03*
*Confidence: HIGH - based on direct analysis of PikaCSS monorepo structure and documentation testing best practices*
