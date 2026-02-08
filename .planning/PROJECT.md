# PikaCSS

## What This Is

PikaCSS is a type-safe, atomic CSS-in-JS engine with build-time extraction. It features a monorepo architecture with core style processing, build tool integrations (Unplugin, Nuxt), and now a standardized ESLint configuration for enforcing best practices.

## Core Value

Zero-runtime overhead with full type safety — styles are extracted at build time, and developer tooling (eslint, types) ensures correctness.

## Requirements

### Validated

- ✓ PikaCSS codebase is functional and correct (v0.0.39) — existing
- ✓ Monorepo structure with 8 packages across 4 layers — existing
- ✓ Build-time transformation pipeline operational — existing
- ✓ TypeScript type system and autocomplete working — existing
- ✓ Test infrastructure (Vitest) in place — existing
- ✓ Documentation site built with VitePress — existing
- ✓ All API documentation verified against codebase — v0.0.40
- ✓ All code examples executable and verified — v0.0.40
- ✓ Verification test suite operational — v0.0.40

### Active

**Milestone v0.0.41: @pikacss/eslint-config**

Goal: Extract internal ESLint configuration to a standalone package for user consumption.

- [ ] **PKG-01**: Create `packages/eslint-config` with `tsdown` build system.
- [ ] **PKG-02**: Configure `package.json` exports for hybrid usage.
- [ ] **RULE-01**: Port `pika-build-time` rule to enforce static analysis constraints.
- [ ] **RULE-02**: Ensure rule has unit tests using `RuleTester`.
- [ ] **CONF-01**: Create `recommended` preset exporting the plugin and rule.
- [ ] **CONF-02**: Ensure config is compatible with ESLint 9+ Flat Config.
- [ ] **INT-01**: Update monorepo root `eslint.config.mjs` to consume `@pikacss/eslint-config`.
- [ ] **INT-02**: Verify `pnpm lint` passes with new configuration.

### Out of Scope

- **Internal Rules**: `pika-package-boundaries` stays in monorepo config (internal only).
- **Strict Type Checking**: Deferred to v2.
- **Translating documentation**: English only per policy.
- **Runtime Style Injection**: strictly build-time extraction.

## Context

**Current State (v0.0.40 Completed):**
- Documentation is 100% accurate and verified.
- Infrastructure is solid.
- Moving to feature development (tooling focus).

**Technical Environment:**
- Monorepo: pnpm workspace
- Build: tsdown
- Linting: ESLint 9+ (Flat Config)
- Testing: Vitest

## Constraints

- **Build-Time Only**: All styles must be resolvable at build time; ESLint rules must enforce this.
- **Source of Truth**: Codebase implementation drives documentation and tooling.
- **English Only**: All public facing content in English.

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Extract ESLint Config | Users need the same build-time validation rules as the internal repo | Active |
| Hybrid Exports for Config | Allows dogfooding local changes without rebuild/publish cycle | Active |
| Test-driven correction | Ensures docs match code (v0.0.40) | ✓ Validated |
| Code as source of truth | Implementation is correct; docs must conform | ✓ Validated |

---
*Last updated: 2026-02-08 start of v0.0.41*
