# Phase 4: Core Package Correction (@pikacss/core) - Context

**Gathered:** 2026-02-04
**Status:** Ready for planning

<domain>
## Phase Boundary

Systematically correct all @pikacss/core documentation using the complete verification infrastructure (Phase 1-3). This phase covers:
- API reference documentation (docs/advanced/api-reference.md)
- Core examples in user guides (docs/guide/basics.md)
- Package README (packages/core/README.md)
- AGENTS.md core package section

Ensures 100% accuracy between documented APIs and actual @pikacss/core implementation.

</domain>

<decisions>
## Implementation Decisions

### Correction Priority & Order

**File correction sequence:**
- Claude decides the overall file order (flexibility to optimize based on discovered dependencies)

**Within-file correction priority:**
- **Critical-first approach** — Fix blockers (signature mismatches) before warnings (missing coverage)
- This ensures the most critical inaccuracies are eliminated first

**Cross-file consistency:**
- **End-of-phase check** — After all core files corrected, run unified cross-reference validation
- Prevents redundant work from fixing the same API reference multiple times

**AGENTS.md timing:**
- **First** — Correct AGENTS.md architecture section before other technical docs
- Establishes correct mental model for the package structure before diving into API details

### API Documentation Depth

**Standard documentation structure:**
- **Comprehensive format** for all public APIs:
  - Type signature
  - Description
  - Parameter explanations
  - Return value documentation
  - Usage examples
  - Notes/caveats
  - Related API links

**Complex API handling:**
- **Each method documented** — For classes like `Engine`, every public method gets complete documentation
- No shortcuts or "see TypeScript" cop-outs

**Code examples in API reference:**
- **Real-world examples** — Show actual usage scenarios, not just toy examples
- Examples must demonstrate practical patterns users will encounter

**Configuration options structure:**
- **Grouped by purpose** — `EngineConfig` options organized functionally:
  - Styling options
  - Plugin options
  - Output options
  - (Other logical groupings as appropriate)

### Example Handling Strategy

**Hallucination examples:**
- **Claude decides** — Fix in place, remove, or replace based on context
- Flexibility to choose best approach per case

**Example source strategy:**
- **VitePress transclusion** — Examples live in test files, markdown references them via transclusion
- Ensures examples are always verified and executable
- Leverages multi-bundler test infrastructure from Phase 2

**Example completeness:**
- **Context-dependent**:
  - API reference: Snippets allowed (assumes reader knows imports/setup)
  - User guides: Self-contained examples (copy-paste ready)

**Test coverage:**
- **100% test coverage** — Every example in documentation must have corresponding automated test
- No untested code in docs

### Verification Workflow

**Validation execution:**
- **Sequential validation** — Run in order:
  1. ESLint (structural)
  2. Link checker
  3. API verifier
  4. Bundler tests
- Catches issues early, saves time on downstream validations

**Failure handling:**
- **Block completion** — All validations must pass before marking file as complete
- Zero tolerance for known failures
- No "acceptable failures" — if it fails, it's not done

**File completion criteria:**
- **Zero issues** — API verifier reports:
  - 0 signature mismatches
  - 0 missing API coverage (for @pikacss/core APIs)
  - 0 contradictions

**Phase 4 completion criteria:**
- **Combination criteria** — ALL of the following must be satisfied:
  1. All core files verified (API reference + examples + README + AGENTS.md)
  2. @pikacss/core API documentation coverage meets threshold (80%+ or 100% of public APIs)
  3. All core examples pass in multi-bundler tests (Vite, Nuxt, Webpack)
  4. Zero validation failures across all verification systems

### Claude's Discretion

- Overall file correction order (within established priority rules)
- How to handle each hallucination example (fix/remove/replace decision)
- Specific grouping of EngineConfig options (as long as grouped by purpose)

</decisions>

<specifics>
## Specific Ideas

- **VitePress transclusion pattern** — Leverage Phase 2's multi-bundler test infrastructure. Examples live in test files where they're automatically validated, docs reference them.

- **Zero tolerance verification** — All validations must pass. No "close enough" or documented exceptions. If API verifier flags it, it's wrong.

- **Real-world examples requirement** — Examples should show practical patterns, not just "hello world" demonstrations. Users should be able to adapt examples directly to their use cases.

- **AGENTS.md first strategy** — Correct the architecture documentation before diving into API details to establish the right mental model of how @pikacss/core is structured.

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

*Phase: 04-core-package-correction-pikacss-core*
*Context gathered: 2026-02-04*
