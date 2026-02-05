# Requirements: PikaCSS Documentation Correction

**Defined:** 2026-02-03
**Core Value:** All documentation must accurately reflect the actual implementation — if it's documented, it must work exactly as described in the current codebase.

## v1 Requirements

Requirements for initial release. Each maps to roadmap phases.

### Verification Infrastructure

- [ ] **VERIFY-01**: Code examples reference actual test files via VitePress transclusion
- [ ] **VERIFY-02**: All code examples execute successfully through Vitest test suite
- [ ] **VERIFY-03**: Test reports identify failing examples with file:line locations
- [ ] **VERIFY-04**: Verification runs in CI pipeline on every commit

### Quality Checks

- [x] **QUALITY-01**: All internal markdown links resolve correctly
- [x] **QUALITY-02**: All external links return valid responses
- [x] **QUALITY-03**: All file:line code references point to existing code locations
- [x] **QUALITY-04**: Markdown syntax follows consistent style (markdownlint)
- [x] **QUALITY-05**: No placeholder content or TODO markers remain in docs
- [x] **QUALITY-06**: All broken or outdated content sections identified and tracked

### PikaCSS-Specific Verification

- [x] **PIKA-01**: All `pika()` examples comply with build-time constraint (statically analyzable args)
- [x] **PIKA-02**: Package import paths respect monorepo layer boundaries (core → integration → unplugin → framework)
- [x] **PIKA-03**: Examples verified against Vite bundler integration
- [x] **PIKA-04**: Examples verified against Nuxt framework integration
- [x] **PIKA-05**: Examples verified against Webpack bundler integration
- [x] **PIKA-06**: Plugin TypeScript module augmentation patterns validated
- [x] **PIKA-07**: Dependency order enforced in documentation structure

### API Documentation Verification

- [x] **API-01**: Type signatures extracted from all public APIs in source code
- [x] **API-02**: Documented API signatures match extracted signatures
- [x] **API-03**: All public exported APIs have documentation coverage
- [x] **API-04**: Configuration options in docs match actual EngineConfig interface
- [x] **API-05**: Plugin hook documentation matches actual hook signatures
- [x] **API-06**: No contradictions between different documentation files
- [x] **API-07**: Cross-package API references validated

### Documentation Consolidation

- [x] **CONSOL-01**: docs/llm/ content reviewed against main docs/ (N/A - LLM docs are intentional design)
- [x] **CONSOL-02**: Duplicate content merged into canonical locations (N/A - no duplication, complementary content)
- [x] **CONSOL-03**: docs/llm/ directory removed (N/A - directory serves LLM optimization purpose)
- [x] **CONSOL-04**: All doc cross-references updated after consolidation (N/A - no consolidation needed)

### Package-Specific Corrections

- [ ] **PKG-CORE-01**: @pikacss/core API reference accurate
- [ ] **PKG-CORE-02**: @pikacss/core examples all executable
- [ ] **PKG-CORE-03**: @pikacss/core README reflects actual exports
- [x] **PKG-INT-01**: @pikacss/integration API reference accurate
- [x] **PKG-INT-02**: @pikacss/integration examples all executable
- [x] **PKG-UNP-01**: @pikacss/unplugin-pikacss API reference accurate
- [x] **PKG-UNP-02**: All bundler-specific docs (Vite, Webpack, etc.) verified
- [x] **PKG-VITE-01**: @pikacss/vite-plugin-pikacss docs accurate
- [x] **PKG-NUXT-01**: @pikacss/nuxt-pikacss docs accurate with Nuxt 3
- [x] **PKG-ICON-01**: @pikacss/plugin-icons docs accurate
- [x] **PKG-RESET-01**: @pikacss/plugin-reset docs accurate
- [x] **PKG-TYPO-01**: @pikacss/plugin-typography docs accurate

### Developer Documentation

- [x] **DEV-01**: AGENTS.md accurately reflects project architecture (Verified via packages/api-verifier/tests/developer-docs/agents.test.ts - package list matches filesystem)
- [x] **DEV-02**: .github/skills/pikacss-dev/SKILL.md reflects actual workflows (Verified via packages/api-verifier/tests/developer-docs/pikacss-dev-skill.test.ts - commands and paths accurate)
- [x] **DEV-03**: .github/skills/pikacss-expert/SKILL.md reflects actual API usage (Verified via packages/api-verifier/tests/developer-docs/pikacss-expert-skill.test.ts - API examples correct)
- [x] **DEV-04**: All development commands in docs actually work (Verified via scripts/verify-dev-commands.sh - all critical commands execute successfully)
- [x] **DEV-05**: Monorepo structure documentation matches reality (Verified via 07-03 - added missing @pikacss/api-verifier to AGENTS.md, count now 9/9)

## v2 Requirements

Deferred to future release. Tracked but not in current roadmap.

### Advanced Verification

- **ADV-01**: Automated semantic analysis of example correctness (beyond type checking)
- **ADV-02**: Performance regression detection in documented patterns
- **ADV-03**: Visual diff tool for documentation changes impact
- **ADV-04**: Automated suggestion generation for doc improvements

### Extended Platform Support

- **EXT-01**: Examples verified against Rollup bundler
- **EXT-02**: Examples verified against Esbuild bundler
- **EXT-03**: Examples verified against Rspack bundler
- **EXT-04**: Examples verified against Farm bundler
- **EXT-05**: Examples verified against Rolldown bundler

### Documentation Enhancements

- **ENH-01**: Interactive code playground embedded in docs
- **ENH-02**: Video tutorials covering key workflows
- **ENH-03**: Migration guides for major version upgrades
- **ENH-04**: Troubleshooting decision tree for common issues

## Out of Scope

Explicitly excluded. Documented to prevent scope creep.

| Feature | Reason |
|---------|--------|
| Auto-fixing documentation | Creates new hallucinations; requires human review per PITFALLS.md |
| AI-assisted doc generation | Source of original problem; test-driven correction only |
| Style/tone improvements | Accuracy first, style secondary per PROJECT.md |
| Translating to other languages | English-only per AGENTS.md language policy |
| Adding new undocumented features | Code is correct as-is, focus on correcting existing docs |
| Restructuring VitePress architecture | Maintain current structure per PROJECT.md constraints |
| Vale prose linting | Style enforcement is anti-feature per FEATURES.md research |
| Comprehensive rewrite | Incremental correction prevents introducing new errors |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| VERIFY-01 | Phase 1 | Pending |
| VERIFY-02 | Phase 1 | Pending |
| VERIFY-03 | Phase 1 | Pending |
| VERIFY-04 | Phase 1 | Pending |
| QUALITY-01 | Phase 1 | Complete |
| QUALITY-02 | Phase 1 | Complete |
| QUALITY-03 | Phase 1 | Complete |
| QUALITY-04 | Phase 1 | Complete |
| QUALITY-05 | Phase 1 | Complete |
| QUALITY-06 | Phase 1 | Complete |
| PIKA-01 | Phase 2 | Complete |
| PIKA-02 | Phase 2 | Complete |
| PIKA-03 | Phase 2 | Complete |
| PIKA-04 | Phase 2 | Complete |
| PIKA-05 | Phase 2 | Complete |
| PIKA-06 | Phase 2 | Complete |
| PIKA-07 | Phase 2 | Complete |
| API-01 | Phase 3 | Complete |
| API-02 | Phase 3 | Complete |
| API-03 | Phase 3 | Complete |
| API-04 | Phase 3 | Complete |
| API-05 | Phase 3 | Complete |
| API-06 | Phase 3 | Complete |
| API-07 | Phase 3 | Complete |
| PKG-CORE-01 | Phase 4 | Pending |
| PKG-CORE-02 | Phase 4 | Pending |
| PKG-CORE-03 | Phase 4 | Pending |
| PKG-INT-01 | Phase 5 | Complete |
| PKG-INT-02 | Phase 5 | Complete |
| PKG-UNP-01 | Phase 5 | Complete |
| PKG-UNP-02 | Phase 5 | Complete |
| PKG-VITE-01 | Phase 5 | Complete |
| PKG-NUXT-01 | Phase 5 | Complete |
| PKG-ICON-01 | Phase 6 | Complete |
| PKG-RESET-01 | Phase 6 | Complete |
| PKG-TYPO-01 | Phase 6 | Complete |
| CONSOL-01 | Phase 7 | Complete |
| CONSOL-02 | Phase 7 | Complete |
| CONSOL-03 | Phase 7 | Complete |
| CONSOL-04 | Phase 7 | Complete |
| DEV-01 | Phase 7 | Complete |
| DEV-02 | Phase 7 | Complete |
| DEV-03 | Phase 7 | Complete |
| DEV-04 | Phase 7 | Complete |
| DEV-05 | Phase 7 | Complete |

**Coverage:**
- v1 requirements: 48 total
- Mapped to phases: 48 ✓
- Unmapped: 0 ✓
- Complete: 45 (Phases 1-3, 5-7 complete; Phase 4 pending)

---
*Requirements defined: 2026-02-03*
*Last updated: 2026-02-06 (Phase 7 Plan 03: DEV requirements complete)*
