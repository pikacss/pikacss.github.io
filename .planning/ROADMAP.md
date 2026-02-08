# Project Roadmap

**Project:** @pikacss/eslint-config
**Milestone:** v0.0.41
**Status:** Active

## Overview

This roadmap delivers the `@pikacss/eslint-config` package, a shared ESLint configuration compatible with ESLint 9+ (Flat Config). It centralizes the "build-time" constraints logic currently scattered or implicitly defined, enabling both internal architectural enforcement (dogfooding) and external user safety.

## Phase Structure

| Phase | Goal | Dependencies | Requirements |
|-------|------|--------------|--------------|
| **10 - Foundation** | Package exists, builds, and resolves correctly in workspace | None | PKG-01, PKG-02 |
| **11 - Rules Engine** | Custom rules are implemented and verified via unit tests | Phase 10 | RULE-01, RULE-02 |
| **12 - Configuration** | Consumable presets exist for Flat Config | Phase 11 | CONF-01, CONF-02 |
| **13 - Integration** | Monorepo uses the new package for self-linting | Phase 12 | INT-01, INT-02 |

---

## Phase Details

### Phase 10: Foundation & Scaffolding

**Goal:** Package exists, builds, and resolves correctly in workspace (Standard Dist Export).

**Plans:**
- [x] 10-01-PLAN.md — Scaffold package structure and configure dependencies

**Success Criteria:**
1. Directory `packages/eslint-config` exists with valid `package.json` and `tsdown` config.
2. `pnpm build` successfully generates ESM artifacts in `dist/`.
3. `package.json` exports point to `dist/` artifacts (standard export strategy).
4. Package is recognized by pnpm workspace and installable by other packages.

**Requirements:**
- **PKG-01**: Create `packages/eslint-config` with `tsdown` build system.
- **PKG-02**: Configure `package.json` exports (descoped to standard dist exports).

### Phase 11: Rules Migration & Implementation

**Goal:** Custom rules are implemented and verified in isolation.

**Plans:**
- [x] 11-01-PLAN.md — Implement rules engine and tests

**Success Criteria:**
1. `pika-build-time` rule exists and correctly identifies dynamic arguments in `pika()` calls.
2. Unit tests using `RuleTester` pass for both valid (static) and invalid (dynamic) cases.
3. Rule meta-data (docs, type, messages) is correctly defined.
4. No regressions in rule logic compared to current internal implementation.

**Requirements:**
- **RULE-01**: Port `pika-build-time` rule to enforce static analysis constraints.
- **RULE-02**: Ensure rule has unit tests using `RuleTester`.

### Phase 12: Configuration & Composition

**Goal:** Users can consume a pre-wired configuration object compatible with Flat Config.

**Success Criteria:**
1. Package exports a `recommended` preset array (Flat Config format).
2. The preset explicitly includes the plugin instance (avoiding string-based resolution issues).
3. The `pika-build-time` rule is enabled by default in the preset.
4. Config object is structurally valid for ESLint 9+.

**Requirements:**
- **CONF-01**: Create `recommended` preset exporting the plugin and enabling rules.
- **CONF-02**: Ensure config is compatible with ESLint 9+ Flat Config format.

### Phase 13: Integration & Dogfooding

**Goal:** The monorepo relies on the new package for its own linting.

**Success Criteria:**
1. Root `eslint.config.mjs` imports from `@pikacss/eslint-config` instead of local rule files.
2. `pnpm lint` passes across the entire monorepo without errors.
3. Modifying a rule in `packages/eslint-config/src` immediately triggers lint errors in other packages (verifying hybrid export).
4. CI pipeline passes with the new configuration.

**Requirements:**
- **INT-01**: Update monorepo root `eslint.config.mjs` to consume `@pikacss/eslint-config`.
- **INT-02**: Verify `pnpm lint` passes with new configuration.

---

## Progress

| Phase | Status | Completion |
|-------|--------|------------|
| 10 - Foundation | **Completed** | 100% |
| 11 - Rules Engine | **Completed** | 100% |
| 12 - Configuration | Pending | 0% |
| 13 - Integration | Pending | 0% |
