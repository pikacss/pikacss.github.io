# Phase 3: API Verification System - Context

**Gathered:** 2026-02-04
**Status:** Ready for planning

<domain>
## Phase Boundary

Build verification system that ensures all documented API signatures (functions, types, configuration options) exactly match actual TypeScript exports in source code. This phase establishes automated validation infrastructure that catches API documentation drift.

</domain>

<decisions>
## Implementation Decisions

### API Extraction Scope
- **Only public exports** — Extract and validate only APIs exposed through package.json "exports" field (user-importable APIs)
- **Full TypeScript validation** — Verify complete interface properties, type parameters, generic constraints, not just existence
- **Plugin hooks manual review** — Plugin system and module augmentation patterns are too complex for automated validation; rely on human review
- **Flag deprecated APIs** — Ensure deprecated/experimental APIs are clearly marked in documentation with warnings

### Difference Detection Strategy
- **Exact match required** — Parameter names, types, order, and return values must match exactly between docs and code
- **Context detection** — Automatically distinguish simplified examples from full signatures (API Reference requires completeness, Guide examples can simplify)
- **Error on conflict** — Any inconsistency across multiple documentation files (API Reference, Guide, AGENTS.md) is treated as error requiring unification
- **Any mismatch fails CI** — All API mismatches block PR merges; zero tolerance for documentation drift

### Reporting Format & Actionability
- **Dual audience** — CI shows summary (pass/fail for reviewers), local execution shows detailed reports (for maintainers)
- **Minimal error messages** — File location + basic mismatch description (keep signal-to-noise high)
- **JSON + Markdown output** — JSON for CI parsing/automation, Markdown for human consumption
- **Claude's discretion on auto-fix** — Implementation decides whether to suggest fixes based on error risk/complexity

### Coverage Tracking
- **Mentioned anywhere = documented** — API counts as documented if it appears in any documentation file, even as simple mention
- **Error on undocumented** — Missing documentation for public APIs fails CI; forces complete coverage
- **Per-package breakdown** — Report coverage separately for each package (@pikacss/core, integration, plugins...) to identify gaps
- **Claude's discretion on trend tracking** — Implementation decides whether to track historical coverage based on complexity vs value

</decisions>

<specifics>
## Specific Ideas

No specific requirements — open to standard approaches for TypeScript API extraction and comparison tooling.

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 03-api-verification-system*
*Context gathered: 2026-02-04*
