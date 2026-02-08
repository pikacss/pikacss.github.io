# Requirements: @pikacss/eslint-config

**Defined:** 2026-02-08
**Core Value:** Provide a standardized, reusable ESLint configuration for PikaCSS users to enforce build-time constraints.

## v1 Requirements (Milestone v0.0.41)

Requirements for initial release. Each maps to roadmap phases.

### Package Setup

- [ ] **PKG-01**: Create `packages/eslint-config` with `tsdown` build system.
- [ ] **PKG-02**: Configure `package.json` exports for hybrid usage (local dev via `src`, published via `dist`).

### Custom Rules

- [ ] **RULE-01**: Port `pika-build-time` rule to enforce static analysis constraints on `pika()` arguments.
- [ ] **RULE-02**: Ensure rule has unit tests using `RuleTester`.

### Configuration

- [ ] **CONF-01**: Create `recommended` preset exporting the plugin and enabling `pika-build-time` rule.
- [ ] **CONF-02**: Ensure config is compatible with ESLint 9+ Flat Config format.

### Integration

- [ ] **INT-01**: Update monorepo root `eslint.config.mjs` to consume `@pikacss/eslint-config` (dogfooding).
- [ ] **INT-02**: Verify `pnpm lint` passes with new configuration.

## Out of Scope

Explicitly excluded. Documented to prevent scope creep.

| Feature | Reason |
|---------|--------|
| Internal Rules | Package is focused on external users; internal rules remain in monorepo config. |
| `pika-package-boundaries` | Internal architectural constraint, not relevant for users. |
| Strict Type Checking | Deferred to v2; focus on basic setup first. |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| PKG-01 | Phase 10 | Pending |
| PKG-02 | Phase 10 | Pending |
| RULE-01 | Phase 11 | Pending |
| RULE-02 | Phase 11 | Pending |
| CONF-01 | Phase 12 | Pending |
| CONF-02 | Phase 12 | Pending |
| INT-01 | Phase 13 | Pending |
| INT-02 | Phase 13 | Pending |

**Coverage:**
- v1 requirements: 8 total
- Mapped to phases: 8
- Unmapped: 0 ✓

---
*Requirements defined: 2026-02-08*
