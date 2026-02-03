# Phase 2: PikaCSS-Specific Verification Rules - Context

**Gathered:** 2026-02-03
**Status:** Ready for planning

<domain>
## Phase Boundary

Build project-specific verification rules that validate all code examples comply with PikaCSS core constraints: build-time evaluation requirement, monorepo package boundaries (core → integration → unplugin → framework), and multi-bundler compatibility (Vite, Nuxt, Webpack). This phase focuses on creating validation infrastructure for documentation correctness, not end-user tooling.

</domain>

<decisions>
## Implementation Decisions

### Implementation Approach
- Use ESLint to leverage existing markdown code block parsing capability
- Create internal ESLint rules for PikaCSS-specific constraints
- Custom ESLint formatter for detailed, PikaCSS-specific error messages

### Error Reporting Format
- **Detail level:** Detailed version with violation code, fix suggestions, and documentation links
- **Grouping:** Organize errors by file (not by rule type or severity)
- **Output format:** Custom ESLint formatter tailored to PikaCSS constraint violations
- **CI behavior:** Severity-based handling (Error blocks PR merge, Warning notifies but doesn't block)

### Test Execution Strategy
- **Execution mode:** Smart hybrid approach
  - Local development: sequential execution for clear logs and easy debugging
  - CI pipeline: parallel execution for speed
- **Failure handling:** Continue testing all bundlers even if one fails (see complete compatibility picture)
- **Environment isolation:** Complete isolation — create fresh temp directory and node_modules for each test run
- **Example source:** Use VitePress transclusion (store examples as standalone `.ts` files, reference via `<<< @/examples/foo.ts`)

### Rule Severity Levels
- **Build-time constraint violations:** Error (blocking) — core requirement, violations cause actual runtime failures
- **Package boundary violations:** Error (blocking) — architectural principle must be strictly enforced
- **Bundler compatibility failures:**
  - Vite failure: Error (primary bundler)
  - Nuxt failure: Error (officially supported)
  - Webpack failure: Warning (secondary support)
- **TypeScript module augmentation issues:** Error (blocking) — type correctness critical for IDE experience

### External Consumer Simulation
- **Installation approach:** Balanced strategy
  - Development: fast iteration method (researcher to evaluate `packlink` vs `file:` protocol)
  - CI: full npm install simulation for accuracy
- **Workspace isolation:** Use `.test-projects/` directory within monorepo, excluded from pnpm workspace
- **Test project lifecycle:** Rebuild every test run (clean before execution, preserve after for debugging)
- **Version testing:** Test latest + LTS versions of dependencies (e.g., Vite 4.x LTS + 5.x latest)

### Claude's Discretion
- Exact ESLint rule implementation details
- AST parsing logic for detecting violations
- Specific fix suggestion wording in error messages
- Temp directory naming and cleanup timing

</decisions>

<specifics>
## Specific Ideas

- **Tool candidate:** Evaluate `packlink` (https://github.com/souporserious/packlink) for package installation simulation — user interested in this approach
- **Existing infrastructure:** Current ESLint configuration already parses markdown code blocks successfully
- **VitePress feature:** Leverage transclusion feature for executable example files

</specifics>

<deferred>
## Deferred Ideas

- **Public ESLint plugin package** — Create `@pikacss/eslint-plugin` as publishable npm package for end-user projects (not just internal documentation validation)
- **Migration to public package** — Once public plugin exists, migrate internal validation to use it
- **End-user developer tooling** — Provide ESLint rules that PikaCSS users can install in their projects for real-time `pika()` validation during development

</deferred>

---

*Phase: 02-pikacss-specific-verification-rules*
*Context gathered: 2026-02-03*
