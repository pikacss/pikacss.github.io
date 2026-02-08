# Phase 11: Rules Engine - Context

**Gathered:** 2026-02-08
**Status:** Ready for planning

<domain>
## Phase Boundary

Implementing custom ESLint rules to enforce build-time constraints (static analysis) for `pika()` and its variants. This phase focuses on the rule logic and testing, not the configuration presets (Phase 12).

</domain>

<decisions>
## Implementation Decisions

### Detection Scope
- **Configurable names**: The rule must accept a list of function names to target (e.g., `["pika", "pikap", "styled"]`).
- **Implicit defaults**: The rule logic itself is generic, but the "recommended" config (in Phase 12) will populate this list with standard PikaCSS variants: `pika`, `pikap`, `pika.inl`, `pika.str`, `pika.arr`.
- **Match strategy**: Name-based matching (not strict import matching) to support auto-imports and unplugin transformations where imports might be implicit.

### Strictness Level
- **Strict literals only**: Arguments passed to `pika()` must be static literals (strings, numbers, objects with literal keys/values).
- **No dynamic values**: Variables, function calls, and expressions (even simple ternary ones) are strictly forbidden inside the `pika()` call.
- **Rationale**: Ensures 100% safety for build-time evaluation without complex scope analysis.

### Error DX
- **Specific argument highlighting**: The error squiggle must appear specifically on the dynamic argument causing the issue, not on the entire function call.
- **Clear messaging**: Error messages should explain *why* the value must be static (e.g., "pika() arguments must be statically evaluable at build time").

### Auto-fix Capabilities
- **No auto-fix**: The rule should report errors but NOT attempt to fix them.
- **Rationale**: Converting dynamic values to static ones requires developer intent; guessing is dangerous.

### Claude's Discretion
- Exact error message wording.
- Internal code structure of the rule (visitor pattern details).
- Testing utilities setup (`RuleTester` configuration).

</decisions>

<specifics>
## Specific Ideas

- The rule logic needs to handle nested objects to find dynamic values deep within the configuration object.
- Support the standard variations: `pikap` (partial), `pika.inl` (inline), etc., by treating them all as "targets" via configuration.

</specifics>

<deferred>
## Deferred Ideas

- **Complex scope analysis**: Tracking variable values across files or within the same file is explicitly out of scope for now.
- **Auto-fix for template literals**: Converting `` `static` `` to `'static'` is deferred; keep it simple for now.

</deferred>

---

*Phase: 11-rules-engine*
*Context gathered: 2026-02-08*
