# Phase 13: Integration & Dogfooding - Context

**Gathered:** 2026-02-09
**Status:** Ready for planning

<domain>
## Phase Boundary

The monorepo relies on the new `@pikacss/eslint-config` package for its own linting. This involves updating the root configuration, managing dependencies, and removing legacy ad-hoc rule implementations.

</domain>

<decisions>
## Implementation Decisions

### Import Strategy
- **Method:** Standard package import (`import ... from '@pikacss/eslint-config'`).
- **Dependency:** Add explicit `devDependency` in root `package.json` pointing to `workspace:*`.
- **Workflow:** Require `pnpm build` before linting. The config will consume the built `dist/` artifacts, not source files.

### Rule Application Scope
- **Scope:** Global application to all JS/TS files in the repository.
- **Tests:** Enforce rules in test files as well. Use explicit `// eslint-disable` comments for intentional failure tests.
- **Severity:** Use the preset's default severity (Error).

### Legacy Cleanup
- **Action:** Delete old rule implementation files and configuration references immediately.
- **Verification:** Standard `pnpm lint` success is sufficient proof of integration.

### Claude's Discretion
- Exact sequence of operations (cleanup first vs integration first).
- Handling of specific eslint-ignore cases if they arise during migration.

</decisions>

<specifics>
## Specific Ideas

No specific requirements — open to standard approaches.

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

*Phase: 13-integration*
*Context gathered: 2026-02-09*
