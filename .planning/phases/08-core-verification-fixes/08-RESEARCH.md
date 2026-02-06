# Phase 08: Core Verification Fixes - Research

**Researched:** Fri Feb 06 2026
**Domain:** Tooling & Documentation Verification
**Confidence:** HIGH

## Summary

This phase aims to resolve 19+ API mismatches and low documentation coverage (23.8%) for `@pikacss/core`. Research confirms that the majority of "mismatches" are false positives caused by limitations in the `@pikacss/api-verifier` tool, specifically its inability to compare `function` declarations with extracted arrow signatures and its exclusion of package `README.md` files from scanning.

The "Core Verification Fixes" must therefore focus primarily on patching the verification tool itself to correctly handle standard TypeScript documentation patterns, and then running the corrected tool to identify and fix any *genuine* documentation discrepancies.

**Primary recommendation:** Fix `@pikacss/api-verifier` normalization logic first, then update `@pikacss/core` documentation.

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| @pikacss/api-verifier | workspace:* | Custom verification tool | Internal tool built for this specific purpose |
| typescript | catalog: | API Extraction | Uses Compiler API for accurate type resolution |
| unified/remark | ^11.0.0 | Markdown Parsing | Standard AST-based markdown processing |

## Architecture Patterns

### Recommended Verification Flow
1. **Extraction**: `api-verifier` extracts types from `packages/core/dist/index.d.mts`.
2. **Parsing**: `api-verifier` scans `docs/**/*.md` AND `packages/*/README.md` (currently missing).
3. **Comparison**: Normalize both extracted and documented signatures to a common format before diffing.
4. **Reporting**: Generate `04-VERIFICATION.md` as a permanent record of the passing state.

### Anti-Patterns to Avoid
- **Hardcoded Globs**: The current verifier hardcodes `docs/**/*.md`, missing the critical `packages/core/README.md`.
- **Naive String Comparison**: Comparing `(a) => b` with `function foo(a): b` fails without normalization.
- **Ignoring Internal Aliases**: The extractor leaks `EngineConfig$1`, causing false mismatches against `EngineConfig`.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Type Extraction | Regex parsing of .d.ts | TypeScript Compiler API | Handles complex types, generics, and aliases correctly (already used, but needs tuning) |

## Common Pitfalls

### Pitfall 1: False Positives in Verification
**What goes wrong:** The verifier reports mismatches for valid documentation (e.g., `function` vs `=>`).
**Why it happens:** `packages/api-verifier/src/comparator.ts` expects arrow syntax for return types.
**How to avoid:** Normalize extracted signatures or updated comparison logic to handle function declarations.
**Warning signs:** "Return type differs: extracted(...) vs documented(unknown)".

### Pitfall 2: Missing Documentation Sources
**What goes wrong:** Low coverage report (23%) despite existing README docs.
**Why it happens:** CLI hardcodes glob to `docs/**/*.md`.
**How to avoid:** Update `packages/api-verifier/src/cli.ts` to accept arguments or include package READMEs by default.

### Pitfall 3: Internal Type Leaks
**What goes wrong:** `EngineConfig$1` reported instead of `EngineConfig`.
**Why it happens:** Rollup/Bundler aliasing is preserved in extraction.
**How to avoid:** Strip `$\d+` suffixes during extraction or normalization.

## Code Examples

### Fix for Comparator (Conceptual)
```typescript
// packages/api-verifier/src/comparator.ts
// Current:
const documentedReturn = normDocumented.match(/=>\s*(\S.*)$/)?.[1] // Fails on 'function'

// Recommended Fix:
function extractReturnType(signature: string): string | undefined {
  // Try arrow syntax
  const arrowMatch = signature.match(/=>\s*(\S.*)$/)
  if (arrowMatch) return arrowMatch[1]
  
  // Try function syntax
  const fnMatch = signature.match(/:\s*(\S.*)$/) // simplified
  if (fnMatch && !signature.includes('=>')) return fnMatch[1]
  
  return undefined
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Manual review | Automated `api-verifier` | Recent | Enforces consistency but currently buggy |
| Docs in `docs/` only | Docs in README + `docs/` | Ongoing | Verifier needs to catch up to file organization |

## Open Questions

1. **`EnginePlugin` type resolution**
   - What we know: Extractor reports `any` for `EnginePlugin`.
   - What's unclear: Why TypeScript API returns `any` (likely complexity or circularity).
   - Recommendation: Investigate `packages/api-verifier/src/extractor.ts` to handle `EnginePlugin` specifically or improve type resolution depth.

## Sources

### Primary (HIGH confidence)
- `packages/api-verifier/src/comparator.ts` - Source code analysis of comparison logic.
- `packages/api-verifier/src/cli.ts` - Verification of hardcoded globs.
- `packages/core/dist/index.d.mts` - Verification of generated type definitions.
- `api-verification-report.md` - Analysis of current failures.

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - Internal tooling.
- Architecture: HIGH - Clear separation of concerns.
- Pitfalls: HIGH - Verified by code analysis and error reports.

**Research date:** Fri Feb 06 2026
**Valid until:** Tooling is updated.
