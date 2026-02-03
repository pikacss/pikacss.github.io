# Pitfalls Research

**Domain:** Documentation Correction & Verification (TypeScript Monorepo)
**Researched:** 2026-02-03
**Confidence:** HIGH

---

## Critical Pitfalls

### Pitfall 1: Trusting "Code is Truth" Without Understanding Context

**What goes wrong:**
When correcting AI-generated documentation, teams blindly copy code signatures and behavior without understanding the *intent* behind the API. This leads to technically accurate but semantically wrong documentation—explaining what the code does, not what it's supposed to do.

**Why it happens:**
- Pressure to "just make docs match the code" without architectural understanding
- Treating documentation correction as a mechanical diff-fixing task
- Not consulting git history, issues, or design discussions
- Assuming current code behavior is intentional (it may be a bug)

**How to avoid:**
1. Before correcting docs, read git blame for the relevant code section
2. Search for related issues/PRs that explain the design decision
3. Check if the code behavior matches the package's stated responsibility (AGENTS.md)
4. Verify with maintainers if behavior seems contradictory to architecture

**Warning signs:**
- Documentation says "this feature does X" but code does Y, and both seem reasonable
- Multiple functions with similar names doing subtly different things
- Code has TODO/FIXME comments contradicting its behavior
- Recent commits show frequent behavior changes in the same area

**Phase to address:**
Phase 1 (Foundation) - Establish verification protocol that includes architectural context checks

---

### Pitfall 2: Testing Examples in Isolation (Not in Context)

**What goes wrong:**
Code examples in documentation are tested as standalone snippets, but fail when users integrate them into real projects due to missing imports, incompatible versions, or incorrect build configurations.

**Why it happens:**
- Examples tested with `ts-node` or REPL, not actual build tools
- Forgetting that PikaCSS has build-time constraints (static analysis required)
- Not testing across different bundlers (Vite, Webpack, etc.) mentioned in docs
- Assuming TypeScript compilation = working code (ignoring runtime/build-time differences)

**How to avoid:**
1. Create test projects for each integration (Vite, Nuxt, Webpack, etc.)
2. Test examples in their documented context (if docs say "Nuxt setup", test in Nuxt)
3. Verify examples work with the documented version constraints
4. Test both TypeScript compilation AND actual build output

**Warning signs:**
- Examples use `import { X } from '@pikacss/core'` but X is not exported
- Examples show `pika({ color: someVar })` violating build-time constraint
- Documentation says "works with Vite 5+" but example only tested in Vite 4
- Type errors appear when copying example into real project

**Phase to address:**
Phase 2 (Verification Infrastructure) - Build multi-bundler test harness before correcting integration docs

---

### Pitfall 3: Over-Correcting to Match Current Code (Ignoring Backward Compatibility)

**What goes wrong:**
Documentation is updated to match current code behavior, but this breaks existing users who relied on the old documented behavior. The "correct" docs now document a breaking change that should have been versioned.

**Why it happens:**
- Not checking if the code change was intentional or a regression
- Assuming documentation was always wrong (may have been correct before)
- Not verifying current package version against semantic versioning rules
- Correcting examples without noting version requirements

**How to avoid:**
1. Check git history: Was docs or code changed more recently?
2. If code behavior changed without version bump, file a bug (don't just update docs)
3. Add version badges to examples: "Added in v0.1.0" or "Changed in v0.2.0"
4. Verify against CHANGELOG.md for breaking changes

**Warning signs:**
- Documentation was correct 6 months ago but "wrong" now
- No major version bump but behavior completely different
- Examples in docs marked as "deprecated" but still in primary docs
- User issues saying "docs don't match my version"

**Phase to address:**
Phase 1 (Foundation) - Establish version tracking protocol as part of verification process

---

### Pitfall 4: Hallucination Detection Theater (False Confidence)

**What goes wrong:**
Using automated tools (AI verification, linters, type checkers) to "confirm" documentation accuracy, but these tools give false positives because they can't verify semantic correctness—only syntactic validity.

**Why it happens:**
- Over-reliance on AI to verify AI-generated content (AI verifying itself)
- Type checker passes = "docs are correct" (but types don't verify behavior)
- Automated link checkers can't verify content accuracy
- Trusting that "code compiles" means "example works as documented"

**How to avoid:**
1. Automated checks are NECESSARY but not SUFFICIENT—require human verification
2. Create "validation tests" not just "compilation tests" (assert expected output)
3. Manual verification required for: API semantics, configuration effects, plugin behavior
4. Cross-reference with multiple sources (code, tests, issues, examples)

**Warning signs:**
- All automated checks pass but community reports docs are wrong
- Type definitions exist but don't match actual runtime behavior
- Examples compile but produce unexpected results
- Documentation describes features that tests don't validate

**Phase to address:**
Phase 1 (Foundation) - Define what automation CAN and CANNOT verify before starting corrections

---

### Pitfall 5: Monorepo Package Boundary Confusion

**What goes wrong:**
Documentation incorrectly shows importing features from the wrong package (e.g., importing from `@pikacss/core` when feature is in `@pikacss/integration`), or documents cross-package features without explaining the dependency chain.

**Why it happens:**
- Not understanding PikaCSS's layered architecture (Core → Integration → Unplugin → Framework)
- AI documentation confused packages with similar names
- Copying examples from one package's docs to another without adjusting imports
- Not verifying package.json exports and entry points

**How to avoid:**
1. Study AGENTS.md architecture diagram before correcting any package docs
2. Verify import paths against package.json "exports" field
3. For each API reference entry, confirm which package exports it
4. Test examples with only the documented packages installed (not the whole monorepo)

**Warning signs:**
- Documentation imports from `@pikacss/core` but feature requires `@pikacss/unplugin-pikacss`
- Examples work in monorepo dev setup but fail when packages installed separately
- Type definitions found in one package but implementation in another
- Documentation doesn't mention required peer dependencies

**Phase to address:**
Phase 2 (Verification Infrastructure) - Create package boundary validation tests before correcting cross-package docs

---

### Pitfall 6: Build-Time vs Runtime Confusion (The `pika()` Constraint)

**What goes wrong:**
Documentation examples show runtime-dynamic patterns that violate PikaCSS's build-time static analysis requirement, causing integration to fail when users try the "working" examples.

**Why it happens:**
- Fundamental misunderstanding of build-time evaluation constraint
- Examples appear to work in documentation sandbox (using workarounds)
- Confusion between "TypeScript compiles" and "PikaCSS integration processes"
- Not testing examples through actual bundler integration

**How to avoid:**
1. Every `pika()` example must be tested through actual bundler (not just ts-node)
2. Flag any example using variables/expressions and verify it's a valid static pattern
3. Add explicit warnings when documenting CSS variable workarounds
4. Test examples in both development and production builds

**Warning signs:**
- Examples show `pika({ color: props.color })` without CSS variable explanation
- Documentation doesn't mention "build-time" or "static analysis" constraints
- Examples use function calls inside `pika()` arguments
- User reports "styles not generating" when following documented patterns

**Phase to address:**
Phase 1 (Foundation) - Establish build-time constraint verification as mandatory before any example approval

---

## Technical Debt Patterns

Shortcuts that seem reasonable but create long-term problems.

| Shortcut | Immediate Benefit | Long-term Cost | When Acceptable |
|----------|-------------------|----------------|-----------------|
| Correcting docs without writing tests | Fast iteration, "obvious" fixes ship quickly | Regressions creep back in, no regression prevention | Never—tests are the deliverable |
| Using AI to verify AI corrections | Scales verification work, feels automated | False confidence, semantic errors slip through | Only as first-pass filter, never final verification |
| Testing examples in monorepo only | All packages available, fast to test | Examples break for external users with different package combinations | Never—must test as external consumer |
| Skipping version annotations | Less maintenance, cleaner docs | Users on old versions follow wrong instructions | Only for pre-1.0 (rapid API changes expected) |
| Copying examples across packages | Reuse existing content, consistency | Import paths wrong, package boundaries violated | Only with explicit import path review |
| Auto-fixing all TypeScript errors | Fast resolution, looks complete | May hide semantic issues, types lie about runtime | Only after manual review of fixes |
| Updating docs without CHANGELOG entry | Keeps CHANGELOG clean, focused on code | No record of documentation fixes, hard to track doc history | Only for typo fixes (not behavior corrections) |

---

## Integration Gotchas

Common mistakes when documenting/verifying multi-bundler integrations.

| Integration | Common Mistake | Correct Approach |
|-------------|----------------|------------------|
| Vite | Documenting features that only work in Vite, presenting as universal | Test in at least 2 bundlers, document Vite-specific features explicitly |
| Nuxt | Assuming Nuxt module auto-config works same as manual Vite setup | Test Nuxt-specific examples with `@pikacss/nuxt-pikacss`, not `@pikacss/vite-plugin-pikacss` |
| Webpack | Copy-pasting Vite config examples without adjusting for Webpack config structure | Use Webpack-native config format, test with actual Webpack build |
| SSR | Documenting client-side examples without noting SSR compatibility | Explicitly test in SSR context (Nuxt, Vite SSR), document SSR-specific considerations |
| HMR | Assuming style changes hot-reload without verification | Test HMR behavior explicitly, document limitations if any |
| TypeScript | Assuming type definitions work without testing in strict mode | Test examples in `tsconfig "strict": true`, verify type inference |
| Module Augmentation | Documenting plugin types without verifying declaration merging works | Test type augmentation in separate package context, not monorepo |

---

## Performance Traps

Patterns that work at small scale but fail as usage grows.

| Trap | Symptoms | Prevention | When It Breaks |
|------|----------|------------|----------------|
| Documenting inefficient patterns | Examples work but generate bloated CSS | Review generated CSS size for all examples | At scale (100+ `pika()` calls) |
| Not documenting build performance implications | Users complain of slow builds after following docs | Note performance characteristics of features | Medium projects (10k+ LoC) |
| Examples without shortcuts | Repeated style patterns in docs | Show shortcut-based examples alongside raw styles | When users adopt patterns from examples |
| Over-specific examples | Every example shows complete configuration | Provide minimal examples, reference full config separately | Docs become overwhelming (cognitive overload) |
| Not documenting cache behavior | Users re-build unnecessarily | Explain when styles regenerate, how to optimize | CI/CD environments with fresh clones |

---

## Security Mistakes

Domain-specific security issues beyond general web security.

| Mistake | Risk | Prevention |
|---------|------|------------|
| Example code contains real API keys/tokens | Credentials leaked in public docs | Scan all examples for patterns matching secrets, use obvious placeholders |
| Documenting unsafe `new Function()` usage | Users copy insecure patterns | Explain why PikaCSS uses it safely (build-time only), warn against runtime usage |
| Not documenting CSP implications | Users face CSP violations in production | Explain how generated styles work with Content Security Policy |
| Showing user-input directly in styles | XSS via CSS injection | Document CSS variable sanitization requirements |

---

## UX Pitfalls

Common user experience mistakes in this domain.

| Pitfall | User Impact | Better Approach |
|---------|-------------|-----------------|
| API reference without examples | Users see types but don't know how to use them | Every API entry needs working example |
| Examples without expected output | Users unsure if their result is correct | Show generated CSS alongside example code |
| Missing "Why?" explanations | Users confused why pattern A vs pattern B | Explain use cases and tradeoffs, not just mechanics |
| No migration guide for breaking changes | Users stuck on old versions or experience breakage | Document migration path for every breaking change |
| Jargon without definitions | "Preflights", "Shortcuts" undefined in context | Define terms inline or link to glossary |
| Assuming framework knowledge | Examples require understanding of build tools | Provide complete setup context, not just PikaCSS code |
| No troubleshooting section | Users can't debug when examples don't work | Common errors section for each integration |

---

## "Looks Done But Isn't" Checklist

Things that appear complete but are missing critical pieces.

- [ ] **API Reference:** Entry has TypeScript signature but no working example
- [ ] **Code Examples:** Example compiles but wasn't tested through actual bundler
- [ ] **Integration Guide:** Shows configuration but doesn't verify it generates expected output
- [ ] **Type Definitions:** Types exist but don't match actual runtime API
- [ ] **Plugin Documentation:** Describes plugin config but doesn't show plugin registration
- [ ] **Migration Guide:** Lists changes but doesn't show before/after code
- [ ] **Cross-Package Features:** Documents feature but doesn't list required packages
- [ ] **Build-Time Patterns:** Shows pattern but doesn't verify static analysis works
- [ ] **Version Compatibility:** States version requirement but wasn't tested on that version
- [ ] **Error Messages:** Documents error but doesn't explain root cause or solution

---

## Recovery Strategies

When pitfalls occur despite prevention, how to recover.

| Pitfall | Recovery Cost | Recovery Steps |
|---------|---------------|----------------|
| Incorrect API docs shipped | MEDIUM | 1. Add correction to next release notes 2. Update docs with version badge noting correction 3. Add test to prevent regression |
| Breaking example in docs | HIGH (user trust damage) | 1. Immediate hotfix with working example 2. Add integration test 3. Public acknowledgment in CHANGELOG |
| Wrong package import documented | LOW | 1. Fix import path 2. Add package boundary test 3. Update all similar examples |
| Missing build-time constraint warning | MEDIUM | 1. Add prominent warning to affected docs 2. Create troubleshooting entry 3. Add detection to verification tests |
| Cross-version incompatibility | HIGH | 1. Add version matrix to docs 2. Create version-specific example branches 3. Implement versioned docs |
| Monorepo-only examples | MEDIUM | 1. Create external consumer test suite 2. Re-test all examples as external user 3. Document peer dependencies explicitly |

---

## Pitfall-to-Phase Mapping

How roadmap phases should address these pitfalls.

| Pitfall | Prevention Phase | Verification |
|---------|------------------|--------------|
| Trusting "Code is Truth" Without Context | Phase 1 (Foundation) | Verification protocol includes git history review, architecture alignment check |
| Testing Examples in Isolation | Phase 2 (Verification Infrastructure) | Multi-bundler test harness operational, examples tested in all documented integrations |
| Over-Correcting Without Version Tracking | Phase 1 (Foundation) | Version tracking protocol established, CHANGELOG cross-referenced for all corrections |
| Hallucination Detection Theater | Phase 1 (Foundation) | Clear definition of automated vs manual verification scope |
| Package Boundary Confusion | Phase 2 (Verification Infrastructure) | Package boundary tests pass, external consumer test suite operational |
| Build-Time vs Runtime Confusion | Phase 1 (Foundation) | All examples tested through bundler, build-time constraint tests in place |
| Missing Expected Output | Phase 3+ (Content Correction) | Examples include expected output comments or adjacent explanations |
| No Troubleshooting Section | Phase 3+ (Content Correction) | Each integration has troubleshooting guide with common errors |
| API Reference Without Examples | Phase 3+ (Content Correction) | Every public API has at least one working example |
| Cross-Version Incompatibility | Phase 2 (Verification Infrastructure) | Version matrix testing established, tested across documented version ranges |

---

## Phase-Specific Warnings

### Phase 1 (Foundation & Protocol Establishment)

**Likely Pitfall:** Rushing to "fix obvious errors" before establishing verification protocols
**Mitigation:** Resist urge to correct docs until verification criteria defined. Every "obvious fix" needs test.

**Likely Pitfall:** Defining protocols that can't scale (e.g., manual testing of all examples)
**Mitigation:** Automate what can be automated (compilation, build, type checking). Reserve manual effort for semantic verification.

### Phase 2 (Verification Infrastructure)

**Likely Pitfall:** Building verification tools without testing on real documentation errors
**Mitigation:** Start with known-bad examples from current docs. Verify infrastructure catches them before expanding.

**Likely Pitfall:** Creating monorepo-centric test infrastructure that doesn't reflect user reality
**Mitigation:** Test infrastructure must install packages as external consumer, not use workspace protocol.

### Phase 3+ (Content Correction)

**Likely Pitfall:** Batch-correcting documentation without incremental verification
**Mitigation:** Correct, verify, commit in small increments. Each PR should be independently verifiable.

**Likely Pitfall:** Focusing on API reference accuracy while ignoring guide/tutorial clarity
**Mitigation:** Verification should include "does this help users" not just "is this technically correct."

---

## Sources

- **AI/Documentation Trends 2026:** WebSearch findings on AI-driven documentation, semantic drift, LLM hallucination verification
- **PikaCSS Architecture:** `/Users/deviltea/Documents/Programming/pikacss/AGENTS.md` - Monorepo structure, package responsibilities, build-time constraints
- **Project Context:** `.planning/PROJECT.md` - Known issues include API mismatches, broken examples, feature hallucinations
- **TypeScript Monorepo Patterns:** Industry knowledge on workspace protocols, package boundaries, type augmentation
- **Build-Time Static Analysis:** PikaCSS-specific constraint requiring all `pika()` arguments be statically analyzable
- **Documentation Best Practices:** Docs-as-Code workflows, test-driven documentation, semantic verification patterns
- **Multi-Bundler Integration:** Vite, Webpack, Rollup, Esbuild, Rspack, Farm, Rolldown support patterns and gotchas

---

*Pitfalls research for: PikaCSS Documentation Correction*
*Researched: 2026-02-03*
*Confidence: HIGH (based on project architecture docs, known issues, and industry patterns)*
