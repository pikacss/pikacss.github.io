# Phase 9: Integration Test Fixes - Context

**Gathered:** 2026-02-06
**Status:** Ready for planning

<domain>
## Phase Boundary

Replace placeholder tests in `@pikacss/integration` with authentic integration verification. Verify the complete build pipeline (Source → Unplugin → Integration → Core → CSS) using real Core engine, not mocks. Achieve 90%+ test coverage with comprehensive error handling.

</domain>

<decisions>
## Implementation Decisions

### Test Organization Structure
- Use flat structure with naming convention: `*.unit.test.ts`, `*.integration.test.ts`
- Test file names correspond to source files (e.g., `ctx.unit.test.ts` tests `src/ctx.ts`)
- Delete placeholder tests (some.test.ts) immediately when starting real tests
- Provide both `pnpm test` (runs all) and `pnpm test:unit` / `pnpm test:integration` (separate execution)

### Verification Depth & Scope
- Target 90%+ test coverage for high-quality verification
- Integration tests verify complete pipeline (Source → CSS output) end-to-end
- Multi-file test scenarios: Claude's discretion based on actual usage patterns
- Breadth-first testing strategy: cover all functionality with basic tests first, then deep-dive into edge cases

### Real vs Mock Boundaries
- Always use real @pikacss/core engine (no mocking Core)
- Use real file system in temp directory (not memfs) to ensure compatibility with globby
- Use real external dependencies (globby, jiti) to test actual integration behavior
- Output verification uses both content assertions (for critical parts) and snapshot testing (for complete output)

### Edge Case Priority
- Error handling: cover all error paths (file not found, parse errors, engine errors, etc.)
- Malformed code: Claude's discretion based on actual problems encountered
- Special scenarios: balanced coverage (empty states, complex patterns, performance boundaries all have basic tests)
- Cross-platform compatibility: test on all platforms (Windows/Linux/macOS) in CI

### Claude's Discretion
- Multi-file test scenarios depth (how many files, how complex)
- Malformed code test selection (which edge cases to prioritize)
- Specific temp directory cleanup strategy
- Test fixture organization within test files

</decisions>

<specifics>
## Specific Ideas

- File system compatibility constraint: memfs was initially considered but rejected due to globby compatibility issues — must use real file system in temp directory
- All tests must use real @pikacss/core engine to close the "Fake Integration Tests" gap from v1 audit
- Breadth-first approach ensures quick baseline coverage before investing in deep edge case testing

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 09-integration-test-fixes*
*Context gathered: 2026-02-06*
