# Project Research Summary

**Project:** @pikacss/eslint-config
**Domain:** Shared ESLint Configuration (Flat Config)
**Researched:** Sun Feb 08 2026
**Confidence:** HIGH

## Executive Summary

The `@pikacss/eslint-config` project aims to create a modern, shared ESLint configuration package compatible with ESLint 9+ (Flat Config). It serves two primary audiences: the PikaCSS monorepo itself (for architectural enforcement) and PikaCSS users (for build-time constraints). The research recommends a "batteries-included" approach for internal usage but a careful peer-dependency strategy for the core engine to avoid version conflicts.

Key architectural decisions include using `tsdown` for bundling TypeScript rules into ESM, and a hybrid export strategy that allows local dogfooding via `tsx` while publishing compiled artifacts. This ensures the monorepo always uses the latest version of its own tools without a circular build dependency.

The primary risk identified is the "Implicit Peer Dependency" trap common in Flat Config migrations, where plugins must be explicitly imported rather than resolved by string names. Mitigation involves exporting plugin instances directly from the config package or using factory functions to inject them.

## Key Findings

### Recommended Stack

The stack relies on **ESLint v9+** and **Flat Config** as the foundation.

**Core technologies:**
- **ESLint ^9.0.0**: The standard linting engine, requiring Flat Config for better composability.
- **tsdown**: Efficient bundler to package TypeScript rules into ESM for consumption.
- **TypeScript ^5.0.0**: Essential for writing type-safe rules and configurations.

**Dependency Strategy:**
- **Peer Dependencies**: `eslint` and `typescript` to ensure singleton instances.
- **Direct Dependencies**: `@typescript-eslint/utils` for rule implementation.
- **Dev Dependencies**: `@deviltea/eslint-config` for base configuration (extended, not bundled).

### Expected Features

**Must have (table stakes):**
- **Flat Config Support**: Native compatibility with ESLint 9+.
- **Vue 3 + TypeScript**: First-class support for PikaCSS's core stack.
- **Prettier Compatibility**: Zero conflict with formatting tools.

**Should have (competitive):**
- **Custom Rule Integration**: Specific rules for PikaCSS boundaries and build-time checks.
- **Import Sorting**: Automated organization of imports.

**Defer (v2+):**
- **Strict Type Checking Profiles**: Optional strict mode can be added later.
- **JSON/YAML Linting**: Useful but not critical for MVP.

### Architecture Approach

The package will reside in `packages/eslint-config` and uses a **Hybrid Export Strategy**.

**Major components:**
1. **Configuration Factory**: Composes `@deviltea/eslint-config` with PikaCSS rules.
2. **Custom Rules Engine**: Implements `pika-build-time` and `pika-package-boundaries`.
3. **Dogfooding Setup**: `package.json` exports point to `src/` for local dev (via `tsx`) and `dist/` for publishing.

### Critical Pitfalls

1. **Implicit Peer Dependency Trap**: Flat Config requires plugins to be imported objects.
   - *Avoidance*: Bundle essential plugins or strictly define peer requirements.
2. **Duplicate Plugin Instances**: Multiple versions of the same plugin causing conflicts.
   - *Avoidance*: Export plugin instances from the shared config for consumers to use.
3. **Monorepo Resolution (pnpm)**: Strict isolation hiding nested dependencies.
   - *Avoidance*: Use public hoist patterns or explicit re-exports.

## Implications for Roadmap

Based on research, suggested phase structure:

### Phase 1: Foundation & Scaffolding
**Rationale**: Establishing the package structure and build pipeline is prerequisite for any code.
**Delivers**: A buildable `packages/eslint-config` with `tsdown` and `package.json` exports configured for dogfooding.
**Addresses**: Flat Config Support (FEATURES.md).
**Avoids**: Monorepo Resolution Pitfalls (PITFALLS.md).

### Phase 2: Rules Migration & Implementation
**Rationale**: The core value proposition is the custom rules currently living in `.eslint/rules`.
**Delivers**: Ported rules (`pika-build-time`, `pika-package-boundaries`) with full unit tests.
**Uses**: `@typescript-eslint/utils` (STACK.md).
**Implements**: Custom Rules Engine (ARCHITECTURE.md).

### Phase 3: Configuration & Composition
**Rationale**: Once rules exist, they need to be assembled into consumable configs.
**Delivers**: `recommended` and `internal` config factories.
**Uses**: `@deviltea/eslint-config` as base.
**Avoids**: Global Ignores Leakage (PITFALLS.md).

### Phase 4: Integration & Release
**Rationale**: Final step is to actually use the package in the monorepo and publish it.
**Delivers**: Updated root `eslint.config.mjs` using the new package, and a published npm package.
**Verification**: `pnpm lint` passes on the whole monorepo.

### Phase Ordering Rationale

- **Scaffolding first**: Ensures we have a place to put the code and a way to build it.
- **Rules second**: These are independent units that can be tested in isolation.
- **Config third**: Composes the rules into the final product.
- **Integration last**: Validates the entire stack in the real world (dogfooding).

### Research Flags

Phases likely needing deeper research during planning:
- **Phase 3**: Might need to check how to properly re-export plugins from `@deviltea/eslint-config` to avoid the "Duplicate Plugin Instances" pitfall.

Phases with standard patterns (skip research-phase):
- **Phase 1**: Standard monorepo package setup.
- **Phase 2**: Standard TypeScript rule implementation.

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | ESLint 9 and tsdown are well-understood standards. |
| Features | HIGH | Requirements are clear and derived from existing monorepo needs. |
| Architecture | HIGH | The dogfooding strategy via conditional exports is a proven pattern. |
| Pitfalls | HIGH | Flat Config migration pain points are well-documented in the community. |

**Overall confidence:** HIGH

### Gaps to Address

- **Plugin Re-exporting**: Need to confirm exactly which plugins from `@deviltea/eslint-config` need to be re-exported to consumers to ensure single instances.

## Sources

### Primary (HIGH confidence)
- [ESLint Flat Config Documentation](https://eslint.org/docs/latest/use/configure/configuration-files-new) — Core configuration format.
- Existing `eslint.config.mjs` in PikaCSS monorepo — Current implementation baseline.

### Secondary (MEDIUM confidence)
- [Antfu/ESLint Config Patterns](https://github.com/antfu/eslint-config) — Best practices reference.
- [TypeScript ESLint Docs](https://typescript-eslint.io/) — Rule writing guides.

---
*Research completed: Sun Feb 08 2026*
*Ready for roadmap: yes*
