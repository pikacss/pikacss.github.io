# Roadmap: PikaCSS Documentation Correction

**Project:** PikaCSS Documentation Correction
**Created:** 2026-02-03
**Depth:** Standard (7 phases)
**Coverage:** 48/48 v1 requirements mapped ✓

## Overview

This roadmap delivers systematic correction of 73 markdown files containing AI-generated hallucinations across the PikaCSS monorepo. Using test-driven verification methodology, we build verification infrastructure progressively (structural → semantic → integration), then apply it package-by-package following dependency order (core → integration → frameworks → plugins), ensuring 100% accuracy between documentation and actual codebase implementation.

---

## Phase 1: Foundation & Verification Infrastructure

**Goal:** Verification system operational with structural validation passing

**Dependencies:** None (foundation)

**Plans:** 3 plans

Plans:
- [x] 01-01-PLAN.md — Enable ESLint markdown validation by removing ignores
- [x] 01-02-PLAN.md — Create validation scripts (links, file refs, placeholders)
- [x] 01-03-PLAN.md — Integrate with CI and document quality baseline

**Requirements Covered (Structural Validation Only):**
- QUALITY-01: All internal markdown links resolve correctly
- QUALITY-02: All external links return valid responses
- QUALITY-03: All file:line code references point to existing code locations
- QUALITY-04: Markdown syntax follows consistent style (markdownlint)
- QUALITY-05: No placeholder content or TODO markers remain in docs
- QUALITY-06: All broken or outdated content sections identified and tracked

**Requirements Deferred to Phase 2:**
- VERIFY-01: Code examples reference actual test files via VitePress transclusion
- VERIFY-02: All code examples execute successfully through Vitest test suite
- VERIFY-03: Test reports identify failing examples with file:line locations
- VERIFY-04: Verification runs in CI pipeline on every commit

**Note:** Phase 1 focuses on structural validation infrastructure (ESLint, link checking, file reference validation, placeholder detection). Code example testing infrastructure (VitePress transclusion + Vitest) is deferred to Phase 2 to maintain focus and context budget.

**Success Criteria:**
1. Markdown parser (ESLint) validates structural integrity without false positives from code blocks
2. Link checker reports all broken internal and external links with file:line context
3. File reference validator identifies all invalid `file:line` patterns
4. Placeholder detection script flags all TODO/FIXME/TBD/placeholder markers
5. CI pipeline executes structural validation on every commit
6. Quality baseline documented (counts of issues by type, distribution across files)

---

## Phase 2: PikaCSS-Specific Verification Rules

**Goal:** Project-specific constraints validated across all code examples

**Dependencies:** Phase 1 (requires markdown parser and code extractor)

**Plans:** 5 plans

Plans:
- [x] 02-01-PLAN.md — ESLint custom rules (build-time, package boundaries)
- [x] 02-02-PLAN.md — Module augmentation rule and custom formatter
- [x] 02-03-PLAN.md — Multi-bundler test infrastructure (Vite, Nuxt, Webpack)
- [x] 02-04-PLAN.md — Integration and CI configuration
- [x] 02-05-PLAN.md — Fix pnpm catalog dependency for integration tests (gap closure)

**Requirements Covered:**
- PIKA-01: All `pika()` examples comply with build-time constraint (statically analyzable args)
- PIKA-02: Package import paths respect monorepo layer boundaries (core → integration → unplugin → framework)
- PIKA-03: Examples verified against Vite bundler integration
- PIKA-04: Examples verified against Nuxt framework integration
- PIKA-05: Examples verified against Webpack bundler integration
- PIKA-06: Plugin TypeScript module augmentation patterns validated
- PIKA-07: Dependency order enforced in documentation structure (deferred to Phase 4-6 package documentation correction, naturally enforced by core→integration→unplugin→framework documentation order)

**Success Criteria:**
1. Build-time constraint checker flags all runtime-dynamic `pika()` usage
2. Multi-bundler test harness (Vite, Nuxt, Webpack) executes examples in documented contexts
3. Package boundary validator rejects invalid cross-layer imports
4. External consumer test suite installs packages separately and runs examples
5. All examples compile and execute successfully in all documented bundler integrations

---

## Phase 3: API Verification System

**Goal:** Documentation API signatures match actual TypeScript exports

**Dependencies:** Phase 1 (requires code extractor), Phase 2 (requires type checking context)

**Plans:** 4 plans

Plans:
- [x] 03-01-PLAN.md — TypeScript API extraction infrastructure
- [x] 03-02-PLAN.md — Markdown documentation parser
- [x] 03-03-PLAN.md — API comparison and report generation
- [x] 03-04-PLAN.md — CI integration and baseline report

**Requirements Covered:**
- API-01: Type signatures extracted from all public APIs in source code
- API-02: Documented API signatures match extracted signatures
- API-03: All public exported APIs have documentation coverage
- API-04: Configuration options in docs match actual EngineConfig interface
- API-05: Plugin hook documentation matches actual hook signatures
- API-06: No contradictions between different documentation files
- API-07: Cross-package API references validated

**Success Criteria:**
1. TypeScript Compiler API extracts all public exports from 8 packages with full signatures
2. API comparison tool identifies mismatches between docs and extracted APIs
3. Coverage report shows which exported APIs lack documentation
4. Configuration validator confirms all documented options exist in EngineConfig
5. Contradiction detector flags inconsistent API descriptions across files

---

## Phase 4: Core Package Correction (@pikacss/core) ✅ COMPLETE

**Goal:** All @pikacss/core documentation verified and accurate

**Status:** Complete (2026-02-04)
**Duration:** 37 minutes
**Dependencies:** Phase 1, 2, 3 (requires full verification infrastructure)

**Plans:** 4 plans (all complete)

Plans:
- [x] 04-01-PLAN.md — Correct AGENTS.md core architecture section ✅
- [x] 04-02-PLAN.md — Correct packages/core/README.md ✅
- [x] 04-03-PLAN.md — Correct docs/advanced/api-reference.md core APIs ✅
- [x] 04-04-PLAN.md — Correct docs/guide/basics.md examples ✅

**Requirements Covered:**
- PKG-CORE-01: @pikacss/core API reference accurate
- PKG-CORE-02: @pikacss/core examples all executable
- PKG-CORE-03: @pikacss/core README reflects actual exports

**Success Criteria:**
1. All core API signatures in docs/advanced/api-reference.md match source code
2. All core examples in docs/guide/basics.md execute successfully through test suite
3. packages/core/README.md accurately describes all public exports
4. AGENTS.md core package section reflects actual architecture
5. All verification tests for @pikacss/core pass in CI pipeline

---

## Phase 5: Integration & Framework Layers ✅ COMPLETE

**Goal:** Multi-layer documentation accurate following dependency chain

**Status:** Complete (2026-02-05)
**Duration:** 30 minutes
**Dependencies:** Phase 4 (@pikacss/core verified—integration/framework docs depend on core accuracy)

**Plans:** 5 plans

Plans:
- [x] 05-01-PLAN.md — Correct @pikacss/integration package documentation
- [x] 05-02-PLAN.md — Correct @pikacss/unplugin-pikacss package and API reference
- [x] 05-03-PLAN.md — Correct Vite, Webpack, Rspack, Esbuild integration guides
- [x] 05-04-PLAN.md — Correct Farm, Rolldown integration guides and index
- [x] 05-05-PLAN.md — Correct Nuxt module docs and deprecate Vite package

**Requirements Covered:**
- PKG-INT-01: @pikacss/integration API reference accurate
- PKG-INT-02: @pikacss/integration examples all executable
- PKG-UNP-01: @pikacss/unplugin-pikacss API reference accurate
- PKG-UNP-02: All bundler-specific docs (Vite, Webpack, etc.) verified
- PKG-VITE-01: @pikacss/vite-plugin-pikacss docs accurate
- PKG-NUXT-01: @pikacss/nuxt-pikacss docs accurate with Nuxt 3

**Success Criteria:**
1. All integration layer docs reference only verified core APIs
2. Unplugin documentation accurately describes bundler-specific configurations
3. Framework adapter examples (Vite, Nuxt) work in actual projects
4. Integration guides (docs/guide/integrations/) tested in multi-bundler harness
5. All layer-crossing API references validated against package boundaries

---

## Phase 6: Plugin System Correction

**Goal:** All plugin documentation verified with module augmentation working

**Dependencies:** Phase 4 (@pikacss/core verified—plugins depend on core), Phase 3 (API verification for module augmentation)

**Plans:** 4 plans

Plans:
- [ ] 06-01-PLAN.md — Correct plugin-reset docs with module augmentation type tests
- [ ] 06-02-PLAN.md — Correct plugin-typography docs with CSS variable verification
- [ ] 06-03-PLAN.md — Correct plugin-icons docs with comprehensive configuration examples
- [ ] 06-04-PLAN.md — Correct plugin-development.md guide using verified patterns

**Requirements Covered:**
- PKG-ICON-01: @pikacss/plugin-icons docs accurate
- PKG-RESET-01: @pikacss/plugin-reset docs accurate
- PKG-TYPO-01: @pikacss/plugin-typography docs accurate

**Success Criteria:**
1. All plugin API documentation matches actual exports
2. Plugin examples execute successfully in test suite
3. TypeScript module augmentation examples type-check correctly
4. Plugin development guide (docs/advanced/plugin-development.md) verified
5. All plugins tested in external consumer context (separate package installation)

---

## Phase 7: Final Polish & Developer Documentation

**Goal:** Complete documentation accuracy validation and verify developer documentation

**Dependencies:** Phase 4, 5, 6 (all package-specific docs corrected)

**Requirements Covered:**
- CONSOL-01 to CONSOL-04: docs/llm/ validated as intentional design (not duplication)
- DEV-01: AGENTS.md accurately reflects project architecture
- DEV-02: .github/skills/pikacss-dev/SKILL.md reflects actual workflows
- DEV-03: .github/skills/pikacss-expert/SKILL.md reflects actual API usage
- DEV-04: All development commands in docs actually work
- DEV-05: Monorepo structure documentation matches reality

**Success Criteria:**
1. docs/llm/ validated as LLM-optimized knowledge base (complementary, not duplicate)
2. Cross-reference validator confirms no contradictions across all 73 files
3. AGENTS.md architecture diagram matches actual package structure
4. All skill documentation synchronized with main docs
5. Every documented development command executes successfully
6. All structural issues resolved (broken links, placeholders, critical ESLint errors)

---

## Progress Tracking

| Phase | Requirements | Status | Completion |
|-------|--------------|--------|------------|
| 1 - Foundation & Verification Infrastructure | 10 | ✅ Complete | 100% |
| 2 - PikaCSS-Specific Verification Rules | 7 | ✅ Complete | 100% |
| 3 - API Verification System | 7 | ✅ Complete | 100% |
| 4 - Core Package Correction | 3 | ✅ Complete | 100% |
| 5 - Integration & Framework Layers | 6 | ✅ Complete | 100% |
| 6 - Plugin System Correction | 3 | ✅ Complete | 100% |
| 7 - Final Polish & Developer Documentation | 9 | 🔄 In Progress | 44% |

**Overall:** 45/48 requirements complete (93.75%)

---

## Next Steps

1. Run `/gsd-plan-phase 1` to create execution plan for Foundation & Verification Infrastructure
2. After Phase 1 completion, proceed to Phase 2 (PikaCSS-Specific Verification Rules)
3. Maintain dependency order: complete Phase N before starting Phase N+1

---

*Roadmap created: 2026-02-03*
*Last updated: 2026-02-04 (Phase 3 complete)*
