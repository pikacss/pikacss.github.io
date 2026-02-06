# Project Research Summary

**Project:** PikaCSS Documentation Correction
**Domain:** Documentation Verification and Testing for TypeScript Monorepo
**Researched:** 2026-02-03
**Confidence:** HIGH

## Executive Summary

PikaCSS is a TypeScript monorepo with 8 packages across 4 architectural layers (Core → Integration → Unplugin → Framework Adapters/Plugins), documented across 73 markdown files. The documentation contains AI-generated hallucinations requiring systematic correction through test-driven verification. This project will verify every documented claim against the actual codebase, treating the code as the source of truth.

The recommended approach is progressive enhancement verification: start with structural checks (links, file references), advance to syntactic validation (code block syntax), then semantic verification (type checking, example execution), and finally integration validation (cross-package consistency). Build verification infrastructure using existing tools (Vitest, TypeScript, VitePress) augmented with documentation-specific tooling (markdown-link-check, markdownlint, TypeDoc, ts-morph). Process corrections in dependency order (core → integration → unplugin → frameworks) to avoid cascading failures.

The primary risk is "hallucination detection theater"—using automated tools that provide false confidence by checking syntax without verifying semantic correctness. Mitigation requires manual verification of API semantics, configuration effects, and plugin behavior, with automation handling compilation, link checking, and basic structural validation. Critical to success is understanding PikaCSS's build-time constraint (all `pika()` arguments must be statically analyzable) and testing examples through actual bundler integrations, not just TypeScript compilation.

## Key Findings

### Recommended Stack

The stack leverages existing PikaCSS infrastructure while adding documentation-specific verification tools. Core testing uses Vitest (already integrated), TypeScript for type checking, and VitePress for documentation site generation. Documentation verification adds markdown-link-check for link validation, markdownlint for markdown quality, eslint-plugin-markdown for code block linting, TypeDoc for API extraction, @microsoft/api-extractor for API surface validation, and ts-morph for TypeScript AST analysis.

**Core technologies:**
- **Vitest (latest)**: Execute tests for code examples — already integrated, mature ecosystem for TypeScript testing
- **VitePress (latest)**: Documentation site generator — already in use, supports code snippet transclusion for single source of truth
- **TypeScript (latest)**: Type checking documentation examples — ensures type correctness against actual codebase
- **markdown-link-check (v3.14.2+)**: Verify hyperlinks in 73 markdown files — handles internal and external link validation
- **markdownlint (v0.39.0+)**: Enforce markdown quality standards — catch common markdown mistakes
- **TypeDoc (v0.26.0+)**: Extract API signatures from TypeScript source — compare against manual documentation
- **ts-morph (v23.0.0+)**: Parse TypeScript AST programmatically — extract function signatures and types for verification

**Critical pattern: VitePress Code Transclusion**
```markdown
<<< @/examples/basic-usage.ts{ts}
```
This pattern stores all code examples as actual testable files, imports them into docs, and tests them independently—the "source of truth" pattern recommended by VitePress community.

### Expected Features

**Must have (table stakes):**
- **Code Example Extraction** — Parse markdown AST to extract TypeScript/JavaScript blocks with proper context
- **Type Checking Integration** — Leverage existing `tsc --noEmit` and project's tsconfig.json to verify examples
- **Test Execution** — Use existing Vitest infrastructure to run examples as tests
- **API Signature Verification** — Compare documented function signatures against actual TypeScript exports
- **Link Validation** — Check all internal and external links resolve correctly
- **Broken Example Detection** — Run extracted code as tests, report failures with file:line context
- **Source of Truth Mapping** — Map documentation statements to actual implementation files

**Should have (competitive differentiators):**
- **Build-Time Constraint Verification** — Verify examples follow PikaCSS-specific rule: all `pika()` args must be statically evaluable
- **Multi-Layer Verification** — Validate docs follow package dependency order (core → integration → unplugin → frameworks)
- **Cross-Reference Validation** — Detect contradictions between different documentation files
- **VitePress Integration** — Handle VitePress-specific syntax like `::: code-group` and custom containers
- **Auto-Generated File Awareness** — Don't validate docs for `pika.gen.css` or `dist/*` per project's AGENTS.md rules

**Defer (v2+):**
- **Coverage Metrics** — Track which exports/APIs lack documentation (nice to have but not blocking)
- **Skill Documentation Sync** — Keep `skills/*/SKILL.md` in sync with main docs (only 3 files, can manually verify)
- **Plugin System Documentation** — Complex TypeScript patterns; validate manually first before automating

**Anti-features (commonly requested but problematic):**
- **Auto-Fixing Documentation** — Creates new hallucinations without verification; use test-driven correction instead
- **Style Guide Enforcement** — Wastes time on style when accuracy is broken; focus on accuracy first
- **AI-Generated Documentation** — This is literally the problem being solved; requires human verification with automated testing

### Architecture Approach

The verification system consists of four layers: (1) Source Layer providing documentation files and package source code, (2) Analysis Layer with markdown parser, code extractor, and source reader, (3) Test Runner Layer using Vitest test suite, and (4) Verification Layer with specialized checkers for links, examples, code references, and types. This follows the test-driven correction pattern: write failing tests specifying correct documentation content, update docs to pass tests, verify with test suite.

**Major components:**
1. **Link Checker** — Parse markdown links, validate file paths, check HTTP URLs for broken references
2. **Example Tester** — Extract code blocks, run against actual package APIs, verify outputs match documentation claims
3. **Type Checker** — Run TypeScript compiler on embedded code, verify type definitions and inference work as documented
4. **Code Reference Validator** — Parse `file:line` references, verify file existence and line validity
5. **Markdown Parser** — Extract testable elements using remark/markdown-it, identify code blocks and links
6. **Source Reader** — Load documentation files with dependency-aware ordering (core → integration → frameworks)

**Architectural pattern: Source-of-Truth Verification**
Tests compare documentation against actual source code (not static expected values). This ensures tests automatically detect when code changes break docs and forces synchronization. Example: extract public methods from `@pikacss/core` source, extract documented methods from API reference, assert they match.

**Architectural pattern: Dependency-Ordered Verification**
Verify documentation in dependency order (core → integration → unplugin → frameworks → plugins) to minimize cascading failures. Fix foundation first—don't correct integration docs if core docs are wrong. Test orchestration required (can't rely on pure parallel execution).

**Architectural pattern: Progressive Enhancement Verification**
Build verification incrementally: (1) Structural checks (links, syntax), (2) Syntactic checks (code syntax without execution), (3) Semantic checks (type checking, example execution), (4) Integration checks (cross-package references, consistency). This provides early value and natural prioritization.

### Critical Pitfalls

1. **Trusting "Code is Truth" Without Context** — Blindly copying code signatures without understanding intent leads to technically accurate but semantically wrong documentation. Prevention: check git blame, search related issues/PRs, verify behavior matches package responsibility from AGENTS.md, consult maintainers if contradictory.

2. **Testing Examples in Isolation (Not in Context)** — Code examples tested as standalone snippets fail when users integrate into real projects due to missing imports, version incompatibilities, or incorrect build configurations. Prevention: create test projects for each integration (Vite, Nuxt, Webpack), test examples in documented context, verify with documented version constraints, test both TypeScript compilation AND actual build output.

3. **Build-Time vs Runtime Confusion (The `pika()` Constraint)** — Documentation examples showing runtime-dynamic patterns violate PikaCSS's build-time static analysis requirement, causing integration failures. Prevention: test every `pika()` example through actual bundler (not just ts-node), flag examples using variables/expressions and verify valid static pattern, add explicit warnings for CSS variable workarounds, test in both dev and prod builds.

4. **Hallucination Detection Theater (False Confidence)** — Using automated tools (AI verification, linters, type checkers) that only verify syntactic validity, not semantic correctness, creates false confidence. Prevention: automated checks are necessary but not sufficient—require human verification; create validation tests (assert expected output), not just compilation tests; manual verification required for API semantics, configuration effects, plugin behavior.

5. **Monorepo Package Boundary Confusion** — Documentation incorrectly shows importing features from wrong package (e.g., from `@pikacss/core` when in `@pikacss/integration`), or documents cross-package features without explaining dependency chain. Prevention: study AGENTS.md architecture diagram, verify import paths against package.json "exports" field, confirm which package exports each API, test examples with only documented packages installed (not whole monorepo).

## Implications for Roadmap

Based on research, suggested phase structure follows progressive enhancement with dependency-ordered execution:

### Phase 1: Foundation (Structural Verification)

**Rationale:** Establish verification protocols and catch basic structural issues before semantic validation. Broken links are easy to fix and highly visible—provides immediate value and builds infrastructure for later phases.

**Delivers:** 
- Markdown parser extracting links, code blocks, file references
- Link checker validating internal file paths and external HTTP URLs
- File reference validator checking `file:line` patterns
- Verification protocols defining what automation can/cannot verify
- Version tracking protocol (cross-reference CHANGELOG.md, add version badges to examples)
- Build-time constraint verification as mandatory for all examples

**Addresses Features:**
- Markdown parsing (foundation for all features)
- Link validation (table stakes)
- Source of truth mapping (foundation)

**Avoids Pitfalls:**
- Trusting "Code is Truth" Without Context — protocol includes git history review, architecture alignment
- Over-Correcting Without Version Tracking — version protocol established, CHANGELOG cross-referenced
- Hallucination Detection Theater — clear definition of automated vs manual verification scope
- Build-Time vs Runtime Confusion — all examples tested through bundler, constraint tests in place

**Research Flag:** Standard patterns (link checking, markdown parsing) — skip additional research

**Estimated Effort:** 1-2 days

### Phase 2: Verification Infrastructure (Code Example Validation & Multi-Bundler Testing)

**Rationale:** Build parsing infrastructure and multi-bundler test harness before correcting content. Ensures examples work in documented integrations, not just in monorepo. Reusable parsers avoid duplication across test files.

**Delivers:**
- Code block extractor identifying TypeScript/JavaScript blocks
- Syntax validator parsing with TypeScript (no execution yet)
- Import validator checking references to real packages
- Multi-bundler test harness (Vite, Nuxt, Webpack as documented)
- External consumer test suite (install packages separately, not workspace protocol)
- Package boundary validation tests

**Uses Stack Elements:**
- remark/markdown-it for parsing
- TypeScript Compiler API for syntax checking
- Vitest for test infrastructure
- eslint-plugin-markdown for code block linting

**Implements Architecture:**
- Analysis Layer (markdown parser, code extractor)
- Test Runner Layer (Vitest test suite structure)

**Addresses Features:**
- Code example extraction (table stakes)
- Type checking integration (table stakes)
- Build-time constraint verification (differentiator)

**Avoids Pitfalls:**
- Testing Examples in Isolation — multi-bundler harness operational, examples tested in all documented contexts
- Package Boundary Confusion — package boundary tests pass, external consumer test suite operational
- Monorepo-Centric Infrastructure — tests install as external consumer, not workspace protocol

**Research Flag:** May need research-phase for bundler-specific integration patterns (Webpack config structure differs from Vite)

**Estimated Effort:** 2-3 days

### Phase 3: Type Correctness & Execution

**Rationale:** Core value proposition—verify code examples type-check against actual APIs and execute successfully. This is the most impactful verification layer, ensuring documentation matches reality.

**Delivers:**
- Type checker integration using TypeScript Compiler API
- Example context builder generating necessary imports/types
- Type error reporter mapping errors to documentation lines
- Isolated execution environment for running examples
- Output capture and assertion for validating documented behavior

**Uses Stack Elements:**
- TypeScript Compiler API (`ts.createProgram()`, compile in-memory)
- TypeDoc for extracting actual API from source
- ts-morph for parsing TypeScript AST and detailed type comparisons
- Vitest for test execution

**Implements Architecture:**
- Verification Layer (type checker, example tester)
- Source-of-Truth Verification pattern (compare docs against source code)

**Addresses Features:**
- Test execution (table stakes)
- API signature verification (table stakes)
- Broken example detection (table stakes)

**Avoids Pitfalls:**
- Hallucination Detection Theater — validation tests assert expected output, not just compilation
- Build-Time Constraint — examples tested through actual bundler integration

**Research Flag:** Standard TypeScript API patterns — skip additional research

**Estimated Effort:** 3-5 days (complexity in context setup for execution environment)

### Phase 4: Package-by-Package Correction (@pikacss/core)

**Rationale:** Start with foundation package (@pikacss/core) using test-driven correction methodology. Core has zero external dependencies (only csstype), making it ideal starting point. Later packages depend on core docs being accurate.

**Delivers:**
- All @pikacss/core documentation corrected and verified
- docs/guide/basics.md accuracy verified
- docs/advanced/api-reference.md (core sections) verified
- AGENTS.md (core package section) verified
- skills/pikacss-expert/references/ (core API) verified
- Verification test suite for core package

**Addresses Features:**
- API signature verification for core exports
- Source of truth mapping (docs → code)
- All table stakes features applied to core package

**Avoids Pitfalls:**
- Testing in isolation — examples tested through bundler
- Package boundary confusion — verify all imports from @pikacss/core exist
- Missing expected output — examples include output comments

**Research Flag:** Skip research (core package well-documented, standard patterns)

**Estimated Effort:** 3-4 days

### Phase 5: Integration & Framework Layers (@pikacss/integration, @pikacss/unplugin-*, @pikacss/nuxt-*)

**Rationale:** Process in dependency order. Integration depends on core, unplugin depends on integration, framework adapters depend on unplugin. Each layer builds on verified foundation.

**Delivers:**
- @pikacss/integration docs corrected (depends on core)
- @pikacss/unplugin-pikacss docs corrected (depends on integration)
- @pikacss/vite-plugin-pikacss docs corrected (wrapper, depends on unplugin)
- @pikacss/nuxt-pikacss docs corrected (Nuxt module, depends on unplugin)
- Integration guides verified (docs/guide/integrations/)
- Multi-bundler examples tested per Phase 2 infrastructure

**Addresses Features:**
- Multi-layer verification (dependency-ordered processing)
- VitePress integration (handle VitePress-specific syntax)

**Avoids Pitfalls:**
- Integration-specific mistakes (Nuxt module vs manual Vite setup distinction clear)
- Cross-version incompatibility (version matrix testing from Phase 2)

**Research Flag:** May need research-phase for Webpack/Rspack/Farm integration specifics (less documented than Vite)

**Estimated Effort:** 4-5 days (multiple packages, complex integrations)

### Phase 6: Plugin System (@pikacss/plugin-*)

**Rationale:** Plugins depend on core but are independent of each other. Process after core is verified. Plugin documentation requires understanding TypeScript module augmentation pattern.

**Delivers:**
- @pikacss/plugin-icons docs corrected
- @pikacss/plugin-reset docs corrected  
- @pikacss/plugin-typography docs corrected
- Plugin development guide verified (docs/advanced/plugin-development.md)
- Module augmentation examples verified (complex TypeScript patterns)

**Addresses Features:**
- Plugin system documentation (deferred differentiator, now implemented)

**Avoids Pitfalls:**
- Module augmentation verification — test type augmentation in separate package context, not monorepo

**Research Flag:** Skip research (plugin patterns documented in AGENTS.md, straightforward application)

**Estimated Effort:** 2-3 days

### Phase 7: Cross-Reference Consistency & Coverage

**Rationale:** After all package-specific docs corrected, verify consistency across files and check completeness. Ensures no contradictions and every public API is documented.

**Delivers:**
- API inventory extractor scanning source for all exports
- Documentation coverage analyzer (which APIs documented)
- Consistency checker (same API described consistently across files)
- Skills documentation sync (skills/* consistent with main docs)
- docs/llm/ merged into main documentation (eliminate duplication)

**Addresses Features:**
- Cross-reference validation (v2+ feature, now implemented)
- Coverage metrics (v2+ feature, now implemented)
- Skill documentation sync (v2+ feature, now implemented)

**Avoids Pitfalls:**
- Documentation in multiple canonical sources — single source of truth established

**Research Flag:** Skip research (applies Phase 1-6 verification to cross-cutting concerns)

**Estimated Effort:** 2-3 days

### Phase Ordering Rationale

- **Foundation first:** Phase 1 establishes protocols and catches easy wins (broken links)
- **Infrastructure before content:** Phase 2 builds reusable tools for Phases 3-6
- **Dependency order:** Phases 4-6 follow package dependency chain (core → integration → frameworks → plugins)
- **Progressive complexity:** Start with structural (Phase 1), advance to semantic (Phase 3), finish with integration (Phase 7)
- **Avoid cascading failures:** Don't correct integration docs (Phase 5) if core docs (Phase 4) are wrong
- **Defer optional execution:** Phase 3 execution testing is valuable but can be iterative—prioritize type checking first

### Research Flags

**Phases likely needing deeper research during planning:**
- **Phase 2:** Multi-bundler integration patterns — Webpack/Rspack/Farm config structure differs from Vite; may need research-phase for framework-specific patterns
- **Phase 5:** Framework adapter specifics — Nuxt module conventions, SSR considerations, HMR behavior may need targeted research

**Phases with standard patterns (skip research-phase):**
- **Phase 1:** Link checking, markdown parsing — well-established tools and patterns
- **Phase 3:** TypeScript Compiler API — documented in official TypeScript docs, common pattern
- **Phase 4:** Core package correction — straightforward application of Phase 1-3 infrastructure
- **Phase 6:** Plugin system — patterns documented in AGENTS.md, TypeScript module augmentation is known pattern
- **Phase 7:** Cross-reference validation — applies existing infrastructure to cross-cutting concerns

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | All tools verified from official sources (VitePress, Vitest, TypeDoc, markdownlint, markdown-link-check). VitePress transclusion pattern confirmed from official docs. Existing PikaCSS infrastructure (Vitest, TypeScript, VitePress) already integrated. |
| Features | HIGH | Feature landscape derived from actual project files (AGENTS.md, PROJECT.md), industry-standard documentation testing practices, and comparison with established patterns (Rust cargo test --doc, TypeScript Twoslash). Table stakes vs differentiators clear from domain analysis. |
| Architecture | HIGH | Architecture directly analyzed from PikaCSS monorepo structure (packages/*/tests/, existing Vitest patterns). Verification system design follows proven patterns (test-driven correction, source-of-truth verification, progressive enhancement). Component responsibilities align with standard testing practices. |
| Pitfalls | HIGH | Pitfalls derived from known PROJECT.md issues (API mismatches, broken examples, hallucinations), AGENTS.md constraints (build-time evaluation, package boundaries), and 2026 AI documentation trends. Prevention strategies tested in other TypeScript projects. |

**Overall confidence:** HIGH

All research based on verifiable sources: official tool documentation, actual PikaCSS codebase analysis, and established industry patterns. No speculation required—PROJECT.md clearly defines problem (AI-generated hallucinations in 73 markdown files), AGENTS.md provides architectural context (8 packages, 4 layers, build-time constraints), and existing infrastructure (Vitest, VitePress, TypeScript) provides foundation.

### Gaps to Address

**Minor gaps (handle during implementation):**
- **Exact TypeScript Compiler API usage for example type-checking:** Pattern is well-known (`ts.createProgram()`, compile in-memory), but project-specific context generation will need iteration. Mitigation: Phase 3 includes "example context builder" as explicit deliverable—expect refinement during implementation.

- **Multi-bundler test harness specifics:** Webpack/Rspack/Farm config differs from Vite—may need framework-specific research during Phase 2. Mitigation: Research flag added to Phase 2; if research-phase needed, run targeted research on bundler-specific patterns before implementation.

- **VitePress-specific markdown extensions:** VitePress supports custom containers (`::: code-group`, `::: warning`, etc.) that may need special parsing. Mitigation: VitePress uses markdown-it under the hood—existing markdown-it parser can handle extensions; Phase 2 testing will surface any gaps.

**No blocking gaps identified:** All core technologies verified, architecture patterns proven, and pitfalls documented with clear prevention strategies. Proceed to roadmap with confidence.

## Sources

### Primary (HIGH confidence)
- **PikaCSS AGENTS.md** — Project architecture, monorepo structure (8 packages, 4 layers), package responsibilities, build-time constraints, testing patterns, plugin system
- **PikaCSS PROJECT.md** — Problem definition (73 markdown files with AI hallucinations), known issues (API mismatches, broken examples), technical environment (pnpm, tsdown, Vitest, VitePress), constraints (code as source of truth)
- **PikaCSS package.json** — Build system verification (Vitest, pnpm workspace), dependency structure, version 0.0.39
- **PikaCSS docs/ directory** — 51 markdown files across guides, API reference, integrations (actual documentation to be corrected)
- **PikaCSS skills/** — pikacss-dev, pikacss-expert, pikacss-docs skills with reference documentation
- **VitePress Official Documentation** — https://vitepress.dev/guide/markdown — Code snippet transclusion pattern (<<< @/file syntax), markdown extensions, verified Feb 2026
- **markdown-link-check GitHub** — https://github.com/tcort/markdown-link-check — Latest release v3.14.2 (Nov 2025), 681 stars, actively maintained
- **markdownlint GitHub** — https://github.com/DavidAnson/markdownlint — 5.8k stars, 60+ configurable rules, VSCode integration
- **eslint-plugin-markdown GitHub** — https://github.com/eslint/markdown — Official ESLint plugin, v5.x supports flat config (ESLint 9)
- **TypeDoc Official Site** — https://typedoc.org/ — TypeScript native, JSON output for programmatic verification
- **Vitest Documentation** — Official docs for existing test infrastructure

### Secondary (MEDIUM confidence)
- **@microsoft/api-extractor** — Microsoft-maintained tool for API surface reports, used by VSCode and TypeScript projects; specific version not verified (NPM returned 403) but tool is well-documented
- **ts-morph** — TypeScript Compiler API wrapper, part of TS ecosystem; well-known tool but version specifics not verified
- **eslint-plugin-markdown 2025 Best Practices** — Web search result describing flat config and v5+ features with ESLint 9
- **VitePress Community Discussions** — Source-of-truth pattern for code examples (transclusion pattern) validated by community consensus

### Tertiary (LOW confidence)
- **Docusaurus TypeScript plugins** — Mentioned for competitor analysis; specifics from web search, not directly verified
- **Rust cargo test --doc** — Mentioned as architectural reference; pattern knowledge from Rust ecosystem, not PikaCSS-specific

---
*Research completed: 2026-02-03*  
*Ready for roadmap: yes*
