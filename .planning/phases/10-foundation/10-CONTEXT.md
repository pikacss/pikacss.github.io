# Phase 10: Foundation & Scaffolding - Context

**Gathered:** 2026-02-08
**Status:** Ready for planning

<domain>
## Phase Boundary

Package exists, builds, and resolves correctly in workspace. This phase establishes the `@pikacss/eslint-config` package structure and build pipeline.

Note: Roadmap requirement PKG-02 "Configure package.json exports for hybrid usage" was discussed and explicitly descoped in favor of standard `dist/` exports.

</domain>

<decisions>
## Implementation Decisions

### Hybrid Export Strategy
- **Decision:** Stick to standard `dist/` exports (requires build for local dev).
- **Rationale:** Simpler setup, avoids complexity of `publishConfig` or conditional exports for now.
- **Impact:** Local development of this package will require running `pnpm build --watch` to see changes in consuming packages.

### Scaffolding Approach
- **Tool:** Use existing `pnpm newpkg` script (`scripts/newpkg.ts`).
- **Location:** `packages/eslint-config`.
- **Name:** `@pikacss/eslint-config`.

### Dependency Versions
- **ESLint:** Strictly require `>= 9.0.0` in `peerDependencies`.
- **TypeScript:** Ensure compatibility with current workspace version.

### Claude's Discretion
- exact `tsconfig.json` structure (should extend root configs).
- initial content of `src/index.ts` (empty or minimal export).

</decisions>

<specifics>
## Specific Ideas

- "Scaffolding 可以看看是不是直接用 pnpm newpkg 來建立比較快速與穩定" (Use standard script for speed/stability).
- "那還是不要 Hybrid Export Strategy 好了" (Skip hybrid export complexity).

</specifics>

<deferred>
## Deferred Ideas

None — discussion focused on initial setup decisions.

</deferred>

---

*Phase: 10-foundation*
*Context gathered: 2026-02-08*
