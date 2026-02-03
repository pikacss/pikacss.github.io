# Documentation Quality Baseline

**Captured:** 2026-02-03  
**Project Version:** v0.0.39  
**Scope:** 73 markdown files across docs/, .github/skills/, packages/*/README.md, AGENTS.md, README.md

---

## Executive Summary

This baseline establishes the initial quality state of PikaCSS documentation before systematic correction. All issues documented here are actual problems requiring resolution in subsequent phases.

**Total files validated:** 70 markdown files  
**Total issues detected:** 130  
**Issue density:** 1.86 issues per file  
**Critical issues:** 8 broken links blocking user navigation

---

## Issue Breakdown

### ESLint Markdown Validation

**Status:** ✗ Failed  
**Total issues:** 111 errors  
**Files affected:** 34 of 70 files (48.6%)

**Issue Categories:**

1. **Code block parsing errors (primary issue)**: ~95 errors
   - ESLint treating code snippets as standalone TypeScript/JavaScript files
   - Missing semicolons, type errors, incomplete expressions
   - **Root Cause**: Code blocks not excluded from ESLint validation
   - **Resolution**: Phase 2 - Configure ESLint to ignore code blocks or use VitePress transclusion

2. **YAML frontmatter parsing**: ~10 errors
   - `.github/skills/README.md:308` - Unexpected scalar token
   - **Resolution**: Phase 7 - Fix YAML syntax in skill documentation

3. **Mixed operators without parentheses**: ~6 errors
   - `/references/IMPLEMENTATION-GUIDE.md:338` - Mix of `&&` and `||`
   - **Resolution**: Phase 2 - Add ESLint rule exception for documentation examples

**Files with most issues:**
1. `.github/skills/pikacss-dev/references/PLUGIN-PATTERNS.md` (15 errors)
2. `.github/skills/pikacss-expert/references/TROUBLESHOOTING.md` (14 errors)
3. `.github/skills/pikacss-dev/references/IMPLEMENTATION-GUIDE.md` (5 errors)

**Technical Note:** These are false positives from ESLint treating documentation code blocks as actual code files. The code examples themselves may be correct in their intended context.

---

### Internal Link Validation

**Status:** ✗ Failed  
**Broken links:** 8  
**Files affected:** 1 file (docs/guide/basics.md)

**All broken links:**

| File | Line | Target | Status |
|------|------|--------|--------|
| docs/guide/basics.md | 14 | `/guide/important-concepts` | Missing file |
| docs/guide/basics.md | 261 | `/images/guide-basics-preview-demo.png` | Missing file |
| docs/guide/basics.md | 267 | `/guide/important-concepts` | Missing file |
| docs/guide/basics.md | 268 | `/guide/configuration` | Missing file |
| docs/guide/basics.md | 269 | `/guide/shortcuts` | Missing file |
| docs/guide/basics.md | 270 | `/guide/selectors` | Missing file |
| docs/guide/basics.md | 271 | `/advanced/troubleshooting` | Missing file |
| docs/guide/basics.md | 272 | `/advanced/typescript` | Missing file |

**Impact:** Critical - Users clicking these links in docs/guide/basics.md encounter 404 errors

**Root Cause Analysis:**
- Links use absolute paths (`/guide/...`) that don't resolve in VitePress
- Referenced documentation files either don't exist or use different names
- Image file missing from docs/public/images/

**Resolution Plan:**
- **Phase 2**: Verify which target files exist with different names
- **Phase 4-6**: Create missing documentation files during package-specific corrections
- **Phase 7**: Update all cross-references after consolidation

---

### File Reference Validation

**Status:** ✓ Passed  
**Invalid references:** 0

**Finding:** Documentation does not use `file:line` reference patterns. This validation remains available for future use if documentation adopts code reference conventions.

---

### Placeholder Detection

**Status:** ✗ Failed  
**Placeholder markers:** 11  
**Files affected:** 6 files

**Breakdown by marker type:**

| Marker Type | Count | Examples |
|-------------|-------|----------|
| "coming soon" | 2 | ecosystem.md (starter templates, component library) |
| "placeholder" (HTML attribute) | 3 | components.md (form input examples) |
| "Placeholder" (heading/concept) | 3 | architecture.md, API references (Selector Placeholder feature) |
| "$placeholder" (code) | 3 | API reference (legitimate API property) |

**Critical Placeholders (require action):**

1. **docs/community/ecosystem.md:70**
   - "Coming soon! Official starter templates for popular frameworks."
   - **Action Required**: Remove promise or deliver templates

2. **docs/community/ecosystem.md:128**
   - "Coming soon! Official component library with common UI patterns."
   - **Action Required**: Remove promise or deliver component library

**False Positives (no action needed):**

1. **HTML `placeholder` attributes** (3 instances in docs/examples/components.md)
   - Legitimate form input placeholders in example code
   - **No action**: These are correct HTML

2. **"Selector Placeholder" technical term** (3 instances)
   - Refers to actual PikaCSS feature (`$` selector syntax)
   - **No action**: This is technical terminology, not a TODO marker

3. **`$placeholder` API property** (3 instances in API reference)
   - Documented configuration option in core API
   - **No action**: This is actual API documentation

**Resolution Plan:**
- **Phase 4**: Verify `$placeholder` API exists in @pikacss/core
- **Phase 7**: Remove/fulfill "coming soon" promises in ecosystem.md

---

## Distribution by Directory

| Directory | Files | ESLint Errors | Broken Links | Placeholders | Total Issues | Density |
|-----------|-------|---------------|--------------|--------------|--------------|---------|
| docs/ | 52 | 15 | 8 | 8 | 31 | 0.60 |
| .github/skills/ | 10 | 96 | 0 | 3 | 99 | 9.90 |
| packages/*/README.md | 8 | 0 | 0 | 0 | 0 | 0.00 |
| Root (AGENTS.md, README.md) | 3 | 0 | 0 | 0 | 0 | 0.00 |

**High-Priority Directory:** `.github/skills/` has extreme issue density (9.90 issues/file) due to code block false positives. Phase 2 must address ESLint configuration to reduce noise.

---

## Issue Severity Analysis

### Critical (Blocks Users)
- ✗ **8 broken internal links** in docs/guide/basics.md
  - Users encounter 404 errors
  - Immediate user impact

### High (Misleading Content)
- ✗ **2 "coming soon" promises** without delivery timeline
  - Sets false expectations
  - Reduces documentation credibility

### Medium (Technical Debt)
- ✗ **111 ESLint errors** (95% false positives)
  - Masks real issues in validation output
  - Reduces confidence in validation system

### Low (False Positives)
- ✓ **6 HTML/API placeholders** (legitimate usage)
  - No user impact
  - May need script refinement to reduce noise

---

## Validation Infrastructure Performance

**Execution Time (local macOS):**
- ESLint markdown validation: ~8 seconds
- Internal link validation: ~3 seconds
- File reference validation: ~1 second
- Placeholder detection: ~2 seconds
- **Total runtime**: ~14 seconds

**CI Performance Target:** <2 minutes (includes pnpm install)

---

## Quality Metrics for Tracking

### Link Health
- **Current:** 8/8 broken links (100% failure rate in affected file)
- **Target (Phase 4-6):** 0 broken links
- **Measurement:** `bash scripts/check-links.sh | grep -c "Broken link"`

### Placeholder Removal
- **Current:** 2 critical placeholders (ecosystem.md promises)
- **Target (Phase 7):** 0 critical placeholders
- **Measurement:** `bash scripts/check-placeholders.sh | grep -i "coming soon" | wc -l`

### ESLint Noise Reduction
- **Current:** 111 errors (95% false positives from code blocks)
- **Target (Phase 2):** <20 errors (real issues only)
- **Measurement:** `pnpm lint 2>&1 | grep -c "error"`

### Overall Documentation Accuracy
- **Current:** Baseline established, accuracy TBD
- **Target (Phase 7):** 100% accuracy (all examples work, all APIs documented match code)
- **Measurement:** Test suite pass rate from Phase 2 verification harness

---

## Priority Issues for Immediate Attention

### Must Fix in Phase 2 (PikaCSS-Specific Verification)

1. **ESLint code block handling**
   - Configure ESLint to ignore code blocks in markdown
   - Or implement VitePress transclusion pattern
   - **Impact**: Reduce validation noise from 111 to ~20 errors

### Must Fix in Phase 4 (Core Package Correction)

2. **Broken links in docs/guide/basics.md**
   - Verify target files exist with different names
   - Create missing documentation files
   - Update link paths to correct targets
   - **Impact**: Restore user navigation in primary guide

### Must Review in Phase 4 (Core Package Correction)

3. **`$placeholder` API verification**
   - Confirm this API property exists in @pikacss/core
   - If missing: remove from docs or add to core
   - **Impact**: Ensure API documentation accuracy

### Must Resolve in Phase 7 (Consolidation)

4. **"Coming soon" promises in ecosystem.md**
   - Decision: Deliver templates/library OR remove promises
   - **Impact**: Set accurate user expectations

---

## Next Steps

### Phase 2: PikaCSS-Specific Verification Rules
- Configure ESLint to handle markdown code blocks correctly
- Reduce false positive rate from 95% to <20%
- Establish code example test harness

### Phase 3: API Verification System
- Extract all public APIs from source code
- Compare against documentation
- Identify undocumented APIs and API mismatches

### Phase 4-6: Package-by-Package Correction
- Fix broken links as target documentation is created
- Verify all code examples execute successfully
- Update cross-references between packages

### Phase 7: Consolidation & Final Cleanup
- Resolve ecosystem.md placeholders
- Remove duplicate content in docs/llm/
- Final validation pass with all tests green

---

## Baseline Validation

This baseline was generated by running:

```bash
# Full validation suite
bash scripts/run-all-checks.sh

# Individual checks
pnpm lint                           # ESLint validation
bash scripts/check-links.sh         # Link validation
bash scripts/check-file-refs.sh     # File reference validation
bash scripts/check-placeholders.sh  # Placeholder detection
```

**Last validated:** 2026-02-03  
**Next review:** After Phase 2 completion (ESLint configuration changes)

---

## Appendix: Raw Validation Output

### ESLint Top Errors (First 20 Lines)

```
/Users/deviltea/Documents/Programming/pikacss/.github/skills/README.md
  308:0  error  Parsing error: Unexpected scalar token in YAML stream: "name"

/Users/deviltea/Documents/Programming/pikacss/.github/skills/pikacss-dev/references/ARCHITECTURE.md
  236:50  error  Parsing error: Expression expected

/Users/deviltea/Documents/Programming/pikacss/.github/skills/pikacss-dev/references/IMPLEMENTATION-GUIDE.md
  305:0   error  Parsing error: Unexpected keyword or identifier
  338:3   error  Unexpected mix of '&&' and '||'. Use parentheses to clarify the intended order of operations
  338:23  error  Unexpected mix of '&&' and '||'. Use parentheses to clarify the intended order of operations

/Users/deviltea/Documents/Programming/pikacss/.github/skills/pikacss-dev/references/PLUGIN-PATTERNS.md
   64:32  error  Parsing error: ';' expected
   72:24  error  Parsing error: ';' expected
   80:24  error  Parsing error: ';' expected
  137:0   error  Parsing error: Unexpected keyword or identifier
  162:0   error  Parsing error: Unexpected keyword or identifier
  211:0   error  Parsing error: Unexpected keyword or identifier
  228:24  error  Parsing error: ';' expected
  245:0   error  Parsing error: Unexpected keyword or identifier
  342:0   error  Parsing error: Unexpected keyword or identifier
  400:24  error  Parsing error: ';' expected
  432:45  error  Parsing error: Expression expected
```

### All Broken Links

```
./docs/guide/basics.md:14: Broken link to '/guide/important-concepts'
./docs/guide/basics.md:261: Broken link to '/images/guide-basics-preview-demo.png'
./docs/guide/basics.md:267: Broken link to '/guide/important-concepts'
./docs/guide/basics.md:268: Broken link to '/guide/configuration'
./docs/guide/basics.md:269: Broken link to '/guide/shortcuts'
./docs/guide/basics.md:270: Broken link to '/guide/selectors'
./docs/guide/basics.md:271: Broken link to '/advanced/troubleshooting'
./docs/guide/basics.md:272: Broken link to '/advanced/typescript'
```

### All Placeholders

```
./docs/advanced/architecture.md:164: ### Selector Placeholder
./docs/llm/architecture.md:90: **Selector Placeholder**
./docs/llm/index.md:155: - Selector placeholder: `$` in user code → `.%` internally → `.{id}` in output
./docs/examples/components.md:382: placeholder="Enter your email"
./docs/examples/components.md:426: placeholder="you@example.com"
./docs/examples/components.md:435: placeholder="••••••••"
./docs/community/ecosystem.md:70: Coming soon! Official starter templates for popular frameworks.
./docs/community/ecosystem.md:128: Coming soon! Official component library with common UI patterns.
./.github/skills/pikacss-expert/references/API-REFERENCE.md:110: '$placeholder'?: StyleDefinition
./.github/skills/pikacss-expert/references/API-REFERENCE.md:307: // Placeholder
./.github/skills/pikacss-expert/references/API-REFERENCE.md:308: $placeholder: {
```

---

*Baseline established: 2026-02-03*  
*Document version: 1.0*  
*Next update: After Phase 2 (ESLint configuration)*
