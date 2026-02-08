# PikaCSS Documentation Correction

## What This Is

A comprehensive documentation correction initiative to eliminate AI-generated hallucinations and inaccuracies across all 73 markdown files in the PikaCSS monorepo. This project verifies every documented claim against the actual codebase implementation, ensuring 100% accuracy between documentation and code reality.

## Core Value

All documentation must accurately reflect the actual implementation — if it's documented, it must work exactly as described in the current codebase.

## Requirements

### Validated

- ✓ PikaCSS codebase is functional and correct (v0.0.39) — existing
- ✓ Monorepo structure with 8 packages across 4 layers — existing
- ✓ Build-time transformation pipeline operational — existing
- ✓ TypeScript type system and autocomplete working — existing
- ✓ Test infrastructure (Vitest) in place — existing
- ✓ Documentation site built with VitePress — existing
- ✓ All API documentation matches actual exported APIs and signatures — v0.0.40
- ✓ All code examples are executable and pass verification tests — v0.0.40
- ✓ All configuration options documented exist in implementation — v0.0.40
- ✓ All feature claims are verifiable against source code — v0.0.40
- ✓ All architecture descriptions accurately reflect codebase structure — v0.0.40
- ✓ All internal links resolve correctly — v0.0.40
- ✓ All external references are valid and current — v0.0.40
- ✓ docs/llm/ validated as intentional LLM knowledge base (not duplication) — v0.0.40
- ✓ Verification test suite covers all documented claims — v0.0.40
- ✓ Language policy enforced (English-only for all documentation) — v0.0.40

### Active

(None yet — planning next milestone)

### Out of Scope

- Translating documentation to other languages — English only per project policy
- Adding new features or functionality — code is correct as-is
- Restructuring documentation architecture — maintain current VitePress structure
- Writing new documentation for undocumented features — focus on correcting existing docs
- Improving writing style or tone — accuracy first, style secondary

## Context

**Current State (v0.0.40):**
- **Documentation Accuracy:** 100% verified against codebase.
- **Verification Infrastructure:** ESLint rules, API extraction, integration tests fully operational.
- **Integration Tests:** Authentic end-to-end verification replaces placeholder tests.
- **Developer Docs:** AGENTS.md and skills verified.

**Technical Environment:**
- Monorepo: pnpm workspace with 8 packages
- Build: tsdown (TypeScript bundler)
- Testing: Vitest
- Docs: VitePress
- Languages: TypeScript, Vue 3
- Version: 0.0.40 (unified version across all packages)

**Approach:**
Test-driven correction — write verification tests for each documented claim, let tests reveal inaccuracies, update docs to match reality, verify tests pass.

## Constraints

- **Source of Truth**: Codebase is correct — documentation must conform to code, not vice versa
- **Language Policy**: All documentation content must be in English (per AGENTS.md policy)
- **No Code Changes**: Fix documentation only — do not modify implementation to match docs
- **Maintain Structure**: Keep existing VitePress architecture and file organization
- **Test Coverage**: Every correction must be backed by a passing verification test
- **Execution Order**: Follow dependency chain (core → integration → framework adapters → plugins)

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Test-driven correction methodology | Ensures objectivity — tests prove accuracy without subjective judgment | Validated |
| Code as source of truth | PikaCSS implementation is working and correct; docs are suspect | Validated |
| docs/llm/ is intentional design | LLM-optimized knowledge base complements main docs, not duplication | Confirmed |
| Process by dependency order | Ensures foundational docs are correct before higher-level docs reference them | Validated |
| 100% accuracy target | Partial accuracy still leaves users confused — must be complete | Achieved |

---
*Last updated: 2026-02-08 after v0.0.40 milestone*
