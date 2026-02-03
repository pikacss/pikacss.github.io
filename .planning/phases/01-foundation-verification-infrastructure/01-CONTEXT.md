# Phase 1: Foundation & Verification Infrastructure - Context

**Gathered:** 2026-02-03
**Status:** Ready for planning

<domain>
## Phase Boundary

Build verification system that validates documentation accuracy through automated testing — markdown parsing, link checking, file reference validation, and CI integration. Establishes structural validation baseline across all 73 markdown files.

</domain>

<decisions>
## Implementation Decisions

### Tooling Strategy
- **ESLint as primary verification tool** — Use existing ESLint setup with markdown plugins
- Current state: All markdown files ignored in `eslint.config.mjs` due to code block false positives
- Solution direction: Configure ESLint to check markdown structure without misinterpreting code blocks

### Code Block Handling
- **VitePress transclusion approach** — Extract code examples into external files, reference via `<<< @/path/to/file.ts`
- Avoids ESLint treating code blocks as standalone files to check
- External files can be actual test files (verified through Vitest)
- Eliminates false positives from ellipsis (`...`) and example-only code patterns

### CI Integration
- **Pre-commit hook enforcement** — Existing lint-staged + ESLint setup
- Configuration already in place: `"lint-staged": { "*": "eslint --fix" }`
- Needs activation by removing markdown ignores from ESLint config

### Validation Strictness
- **Strict mode** — All validation errors must be fixed before commit succeeds
- No warning-only mode or error baseline tracking
- Forces immediate quality standards

### Progressive Enablement
- **Gradual directory activation** — Remove ignores incrementally, not all at once
- Priority order and phase boundary (code block migration timing): Claude's discretion

### Claude's Discretion
- Which directory to enable first (docs/, skills/, READMEs, AGENTS.md)
- Whether to handle code block migration in Phase 1 or defer to Phase 2
- Test file structure and naming conventions for extracted examples
- VitePress transclusion path patterns and organization
- Specific ESLint markdown plugin configuration details

</decisions>

<specifics>
## Specific Ideas

**Current blocker identified:**

All 73 target markdown files are currently ignored in `eslint.config.mjs`:
- `**/README.md`
- `docs/**/*.md`
- `.github/skills/**/*.md`
- `**/AGENTS.md`

Phase 1 must resolve this by configuring ESLint to check markdown without code block false positives.

**Historical context:**
Markdown files were ignored because ESLint treated code blocks as standalone TypeScript/JavaScript files, causing false positives on:
- Ellipsis syntax (`...`) in abbreviated examples
- Incomplete code snippets used for illustration
- Example-only variables not defined in context

**VitePress transclusion reference:**
PikaCSS uses VitePress for documentation. Transclusion syntax allows importing external files as code blocks, bypassing the ESLint false positive issue entirely.

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 01-foundation-verification-infrastructure*
*Context gathered: 2026-02-03*
