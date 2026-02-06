# Feature Research

**Domain:** Documentation Correction & Verification Systems
**Researched:** 2026-02-03
**Confidence:** HIGH

## Feature Landscape

### Table Stakes (Users Expect These)

Features users assume exist. Missing these = documentation stays broken.

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| **Code Example Extraction** | Documentation contains code blocks that must be validated | MEDIUM | Parse Markdown AST to extract TypeScript/JavaScript code blocks with proper context preservation |
| **Type Checking Integration** | TypeScript project requires type-safe examples | LOW | Leverage existing `tsc --noEmit` and project's tsconfig.json |
| **Test Execution** | Examples must actually run and work | LOW | Use existing Vitest infrastructure already in project |
| **API Signature Verification** | Documented APIs must match actual exports | HIGH | Compare documented function signatures against actual TypeScript type definitions |
| **Link Validation** | Internal and external links must work | LOW | Check all `[text](url)` links resolve correctly |
| **Broken Example Detection** | Know which code examples fail before users do | LOW | Run extracted code as tests, report failures with file:line context |
| **Source of Truth Mapping** | Every doc claim traces back to specific code location | HIGH | Map documentation statements to actual implementation files |

### Differentiators (Competitive Advantage)

Features that set the product apart. Not required, but valuable.

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| **Build-Time Constraint Verification** | PikaCSS has unique constraint: all `pika()` args must be statically evaluable | MEDIUM | Verify examples follow the build-time evaluation rule specific to PikaCSS |
| **Cross-Reference Validation** | Detect when docs contradict each other | HIGH | Find inconsistencies between different documentation files |
| **Coverage Metrics** | Show what percentage of codebase is documented | MEDIUM | Track which exports/APIs lack documentation |
| **Auto-Generated File Awareness** | Don't validate docs for `pika.gen.css` or `dist/*` | LOW | Respect project's "never edit these" rules from AGENTS.md |
| **Multi-Layer Verification** | Validate docs follow package dependency order (core → integration → unplugin → frameworks) | MEDIUM | Ensures lower-layer docs are correct before validating higher layers that depend on them |
| **Plugin System Documentation** | Verify plugin hooks, module augmentation patterns | HIGH | Complex TypeScript patterns require specialized validation |
| **Skill Documentation Sync** | Keep `skills/*/SKILL.md` in sync with main docs | LOW | Three skill files must not contradict docs/ content |
| **VitePress Integration** | Validation works with VitePress's markdown extensions | MEDIUM | Handle VitePress-specific syntax like `::: code-group` and custom containers |

### Anti-Features (Commonly Requested, Often Problematic)

Features that seem good but create problems.

| Feature | Why Requested | Why Problematic | Alternative |
|---------|---------------|-----------------|-------------|
| **Auto-Fixing Documentation** | "Just make AI fix all the docs automatically" | Creates new hallucinations; no verification; breaks trust | Test-driven correction: write tests first, manual fix with verification |
| **Style Guide Enforcement** | "Use Vale/alex for writing quality" | Wastes time on style when accuracy is broken; style != correctness | Focus on accuracy first; defer style improvements |
| **Runtime Monitoring** | "Check docs against production traffic" | Documentation project, not a running service; no production environment | Static analysis against codebase directly |
| **Visual Regression Testing** | "Screenshot docs and compare" | Doesn't catch factual errors; only catches layout changes | Content validation, not appearance validation |
| **AI-Generated Documentation** | "Use LLM to rewrite all docs" | This is literally the problem we're solving; repeats original mistake | Human verification with automated testing |
| **Comprehensive Rewrite** | "Start from scratch" | Loses working parts; massive scope creep; never finishes | Incremental correction with test coverage |

## Feature Dependencies

```
API Signature Verification
    └──requires──> Code Example Extraction
                       └──requires──> Markdown Parsing

Type Checking Integration
    └──requires──> Code Example Extraction

Test Execution
    └──requires──> Code Example Extraction
    └──requires──> Type Checking Integration

Source of Truth Mapping
    └──enhances──> API Signature Verification
    └──enhances──> Cross-Reference Validation

Multi-Layer Verification
    └──requires──> Source of Truth Mapping
    └──requires──> Package Dependency Graph

Coverage Metrics
    └──requires──> API Signature Verification
    └──requires──> Source of Truth Mapping

Cross-Reference Validation ──conflicts──> Auto-Fixing (creates contradictions)
Test-Driven Correction ──conflicts──> AI-Generated Documentation (no verification)
```

### Dependency Notes

- **Code Example Extraction is foundational:** Nearly all other features need to extract code from Markdown first
- **Type Checking → Test Execution:** Must type-check before attempting to run code (TypeScript requirement)
- **Source of Truth Mapping enables advanced features:** Once you know doc → code mapping, coverage and cross-reference become possible
- **Multi-Layer Verification requires dependency graph:** Can't validate packages in order without understanding the monorepo structure
- **Anti-features conflict with core methodology:** Auto-fixing and AI generation directly oppose test-driven correction approach

## MVP Definition

### Launch With (v1)

Minimum viable product — what's needed to validate the concept.

- [x] **Markdown Parsing** — Foundation for all other features; use `remark` ecosystem
- [x] **Code Example Extraction** — Extract TypeScript/JavaScript blocks with metadata (file, line, language)
- [x] **Type Checking Integration** — Run `tsc --noEmit` on extracted examples with project's tsconfig
- [x] **Test Execution via Vitest** — Execute examples as tests using existing test infrastructure
- [x] **Link Validation** — Check internal links (`.md` files) and external links (HTTP/HTTPS) resolve
- [x] **Failure Reporting** — Report which doc file and line number has broken examples or links

### Add After Validation (v1.x)

Features to add once core is working.

- [ ] **API Signature Verification** — Trigger: after MVP proves test-driven approach works; compare documented APIs against actual exports
- [ ] **Source of Truth Mapping** — Trigger: when manual correction becomes repetitive; helps locate implementation
- [ ] **Build-Time Constraint Verification** — Trigger: after core examples pass; add PikaCSS-specific validation
- [ ] **VitePress Integration** — Trigger: when basic Markdown validation works; add support for VitePress-specific syntax
- [ ] **Multi-Layer Verification** — Trigger: after API verification works; add dependency-order validation

### Future Consideration (v2+)

Features to defer until product-market fit is established.

- [ ] **Cross-Reference Validation** — Why defer: complex; requires semantic understanding of documentation
- [ ] **Coverage Metrics** — Why defer: nice to have but not blocking correction work
- [ ] **Skill Documentation Sync** — Why defer: only three skill files; can manually verify
- [ ] **Plugin System Documentation** — Why defer: complex TypeScript patterns; validate manually first

## Feature Prioritization Matrix

| Feature | User Value | Implementation Cost | Priority |
|---------|------------|---------------------|----------|
| Markdown Parsing | HIGH | LOW | P1 |
| Code Example Extraction | HIGH | MEDIUM | P1 |
| Type Checking Integration | HIGH | LOW | P1 |
| Test Execution | HIGH | LOW | P1 |
| Link Validation | HIGH | LOW | P1 |
| Failure Reporting | HIGH | LOW | P1 |
| API Signature Verification | HIGH | HIGH | P2 |
| Source of Truth Mapping | MEDIUM | HIGH | P2 |
| Build-Time Constraint Verification | MEDIUM | MEDIUM | P2 |
| VitePress Integration | MEDIUM | MEDIUM | P2 |
| Multi-Layer Verification | MEDIUM | MEDIUM | P2 |
| Cross-Reference Validation | MEDIUM | HIGH | P3 |
| Coverage Metrics | LOW | MEDIUM | P3 |
| Skill Documentation Sync | LOW | LOW | P3 |
| Plugin System Documentation | MEDIUM | HIGH | P3 |

**Priority key:**
- P1: Must have for launch (MVP)
- P2: Should have, add when possible (v1.x)
- P3: Nice to have, future consideration (v2+)

## Competitor Feature Analysis

Documentation correction is not a competitive product space, but we can analyze similar tools:

| Feature | Docusaurus + Twoslash | TypeDoc Validation | Rust cargo test --doc | Our Approach |
|---------|----------------------|-------------------|------------------------|--------------|
| **Code Extraction** | Via plugin | N/A (generates from code) | Built-in to rustdoc | `remark` + custom plugin |
| **Type Checking** | TypeScript Compiler API | Built-in | Rust compiler | Leverage project's `tsc` |
| **Test Execution** | Build-time only | No execution | Runs during `cargo test` | Vitest integration |
| **Link Checking** | Manual tools (lychee) | Built-in | Not applicable | Custom validator |
| **API Verification** | Manual comparison | Automatic (source of truth is code) | Automatic | Custom AST comparison |
| **Reporting** | Build failure | CLI warnings | Test output | Vitest reporter |

**Our differentiation:**
- **Test-driven correction methodology** — Write tests for claims, fix docs to pass tests (not just linting)
- **Monorepo-aware** — Understands package layers and validates in dependency order
- **PikaCSS-specific rules** — Validates build-time constraints unique to the project
- **Codebase as source of truth** — Does not trust docs; verifies everything against implementation

## Domain-Specific Considerations

### PikaCSS Unique Constraints

1. **Build-Time Evaluation Rule**: All `pika()` arguments must be statically analyzable
   - Examples must demonstrate this constraint
   - Must detect examples that violate this (runtime variables)
   - Need to show correct patterns (CSS variables for runtime values)

2. **Layered Architecture**: 4-layer package structure
   - Core → Integration → Unplugin → Framework adapters
   - Documentation must respect this ordering
   - Can't document integration features before core is validated

3. **Auto-Generated Files**: `pika.gen.css`, `pika.gen.ts`, `dist/*`
   - Must never include these in documentation validation
   - Examples should not reference generated files
   - Need awareness of what's generated vs. authored

4. **Plugin Module Augmentation**: TypeScript declaration merging pattern
   - Complex type system usage
   - Examples must show correct augmentation syntax
   - Need to verify augmentation actually works

5. **Unified Version**: All packages share version 0.0.39
   - Documentation must not show per-package versions
   - Installation instructions must be consistent

### Testing Strategy

**Three-tier validation:**

1. **Syntactic** (Fast, P1)
   - Markdown parses correctly
   - Code blocks have valid syntax
   - Links have correct format

2. **Semantic** (Medium, P2)
   - Types check correctly
   - APIs actually exist
   - Examples execute successfully

3. **Logical** (Slow, P3)
   - Documentation doesn't contradict itself
   - Architecture descriptions match implementation
   - Coverage is comprehensive

**Incremental correction:**
- Start with one doc file (e.g., `getting-started/installation.md`)
- Write verification tests for all claims in that file
- Fix doc to pass all tests
- Move to next file
- Repeat for all 73 markdown files

## Tools Ecosystem

### Required Tools (Already in Project)

| Tool | Current Usage | Documentation Correction Use |
|------|---------------|------------------------------|
| **Vitest** | Unit testing packages | Execute extracted code examples as tests |
| **TypeScript** | Project language | Type-check documentation examples |
| **tsdown** | Build packages | Not directly used (no code changes) |
| **VitePress** | Documentation site | Parse VitePress-specific markdown syntax |
| **pnpm** | Monorepo management | Install test dependencies |

### Additional Tools (To Add)

| Tool | Purpose | Why This Tool | Confidence |
|------|---------|---------------|------------|
| **remark** | Markdown parsing | Industry standard AST parser; extensive plugin ecosystem | HIGH |
| **remark-parse** | Markdown → AST | Core remark parsing plugin | HIGH |
| **remark-frontmatter** | Parse YAML frontmatter | VitePress uses frontmatter for metadata | HIGH |
| **unist-util-visit** | AST traversal | Find code blocks and links in parsed Markdown | HIGH |
| **ts-morph** | TypeScript AST | Compare documented API signatures against actual types | HIGH |
| **execa** | Process execution | Run `tsc` and other CLI tools from Node.js | HIGH |

### Tools to Avoid

| Tool | Why Avoid |
|------|----------|
| **Vale** | Style enforcement, not accuracy verification |
| **markdownlint** | Structural linting, not content validation |
| **alex** | Inclusive language, not factual correctness |
| **Schemathesis** | OpenAPI testing, not applicable to library docs |
| **Optic** | API traffic inspection, no runtime environment |

## Success Metrics

### Quantitative

- **100% test pass rate** — Every documented claim has a passing verification test
- **0 broken links** — All internal and external links resolve
- **0 type errors** — All code examples type-check successfully
- **0 execution failures** — All executable examples run without errors
- **73/73 files validated** — Every markdown file has been corrected

### Qualitative

- **Trust restored** — Users can copy-paste examples with confidence they work
- **Maintenance enabled** — Test suite catches regressions when code changes
- **Consistency achieved** — No contradictions between documentation files
- **Policy enforced** — All content is in English per project requirements

## Sources

**Documentation Testing:**
- Shiki Twoslash (TypeScript documentation standard) — HIGH confidence
- Docusaurus TypeScript plugins — MEDIUM confidence (WebSearch verified)
- Vitest documentation — HIGH confidence (official docs)

**Markdown Processing:**
- Remark ecosystem (unified.js) — HIGH confidence (official docs)
- VitePress documentation — HIGH confidence (official docs)

**Linting Tools:**
- Vale, markdownlint, alex comparison — HIGH confidence (multiple sources)
- Link checkers (lychee) — MEDIUM confidence (community standard)

**Domain Knowledge:**
- PikaCSS AGENTS.md — HIGH confidence (project file)
- PikaCSS package.json — HIGH confidence (project file)
- PROJECT.md — HIGH confidence (project file)

**API Testing:**
- TypeDoc validation — HIGH confidence (official docs)
- TypeScript Compiler API — HIGH confidence (official docs)
- ts-morph library — MEDIUM confidence (popular library)

---
*Feature research for: PikaCSS Documentation Correction*
*Researched: 2026-02-03*
