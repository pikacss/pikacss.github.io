# Release Documentation Checklist

Structured checklist for ensuring documentation is complete and accurate before each release.

## Pre-Release Phase (1-2 weeks before)

### [ ] Code Freeze Review

- [ ] All new features documented
- [ ] All breaking changes documented  
- [ ] API changes reflected in api-reference.md
- [ ] New plugins documented in /plugins/
- [ ] Framework integrations updated if changed
- [ ] Examples in /docs/examples/ still work

**Command:**
```bash
pnpm docs:build
pnpm docs:preview
```

### [ ] Version Audit

Update to new version number (if bumping):

- [ ] Update `package.json` version
- [ ] Update `AGENTS.md` version section
- [ ] Update each skill file: `metadata.version`
- [ ] Update `pika.config.ts` examples to latest version
- [ ] Search docs for old version references

**Search patterns:**
```bash
grep -r "0.0.38" docs/ .github/skills/
grep -r "v0.0.38" docs/
```

### [ ] Documentation Audit

Check all canonical sources are accurate:

- [ ] `/guide/important-concepts.md` - Build-time constraint explained
- [ ] `/advanced/typescript.md` - TypeScript setup current
- [ ] `/integrations/index.md` - Integration overview correct
- [ ] `/advanced/api-reference.md` - API complete
- [ ] `/plugins/*.md` - Plugin docs complete

### [ ] Link Verification

- [ ] Run link checker
- [ ] Verify all internal links work
- [ ] Check external links are current
- [ ] Update broken links

**Manual check:**
```bash
pnpm docs:build
pnpm docs:preview
# Click through major sections
```

### [ ] Code Example Verification

- [ ] All code examples are syntactically correct
- [ ] Examples use current API (v0.0.39)
- [ ] Copy-paste examples are complete (can run as-is)
- [ ] Good vs bad patterns clearly marked

**Test typescript files:**
```bash
npx tsc --noEmit  # Check example code
```

---

## Release Phase (Release day)

### [ ] Final Documentation Pass

- [ ] Create release notes (CHANGELOG.md)
- [ ] Document breaking changes (if any)
- [ ] Document new features (if any)
- [ ] Document deprecations (if any)

**Release notes format:**
```markdown
## [0.0.40] - 2026-01-19

### Added
- New feature with link to guide

### Changed
- Breaking change with migration guide link

### Fixed
- Bug fix

### Deprecated
- Deprecated feature with migration link
```

### [ ] Skill Frontmatter Update

Update all skill files:

- [ ] `pikacss-dev/SKILL.md` - version updated
- [ ] `pikacss-expert/SKILL.md` - version updated
- [ ] `pikacss-docs/SKILL.md` - version updated

```yaml
metadata:
  version: 0.0.40
```

### [ ] Configuration Examples Update

Update all pika.config.ts examples:

- [ ] Guide examples
- [ ] Advanced topic examples
- [ ] Integration examples
- [ ] Plugin examples
- [ ] Skill examples

**Check for hardcoded versions:**
```bash
grep -r "defineEngineConfig" docs/ --include="*.md" -A 5
```

### [ ] Build & Deploy

- [ ] Build documentation
- [ ] No build errors or warnings
- [ ] No broken links
- [ ] Previews correctly

**Commands:**
```bash
pnpm docs:build
pnpm docs:preview
pnpm docs:build && pnpm docs:preview
```

---

## Quality Checks (Before Going Live)

### [ ] Content Quality

- [ ] No spelling errors (run spell checker)
- [ ] No grammar issues
- [ ] Consistent terminology (check glossary)
- [ ] Consistent code style
- [ ] All examples tested
- [ ] No outdated API references

### [ ] Documentation Completeness

For new features:

- [ ] Quick start guide
- [ ] API documentation
- [ ] Usage examples
- [ ] Framework integration (if applicable)
- [ ] Troubleshooting section
- [ ] Related links

For breaking changes:

- [ ] Migration guide
- [ ] Before/after examples
- [ ] Links in FAQ
- [ ] Changelog entry

### [ ] File Organization

- [ ] Files in correct directories
- [ ] Filenames follow kebab-case
- [ ] File sizes reasonable (300-800 lines)
- [ ] Frontmatter complete and correct
- [ ] No duplicate content

### [ ] Cross-References

- [ ] Canonical sources linked (not duplicated)
- [ ] Related docs linked
- [ ] Links use relative paths
- [ ] No circular references

### [ ] Tests Pass

```bash
# All tests should pass
pnpm test

# Type checking clean
pnpm typecheck

# Linting passes
pnpm lint

# Build succeeds
pnpm build

# Docs build clean
pnpm docs:build
```

---

## Post-Release Phase (After deployment)

### [ ] Verify Deployed Docs

- [ ] Live docs are updated
- [ ] Search works correctly
- [ ] All links work
- [ ] Examples display correctly
- [ ] No build errors on live site

### [ ] Update Redirects (if needed)

- [ ] Old docs URLs redirect to new locations
- [ ] No 404 errors on common paths

### [ ] Announce Release

- [ ] GitHub release created (automated)
- [ ] Changelog published
- [ ] Community notified if major release
- [ ] Example projects updated

### [ ] Monitor for Issues

- [ ] Check GitHub issues for documentation problems
- [ ] Fix any reported inaccuracies quickly
- [ ] Update FAQ if common questions arise

---

## Common Release Mistakes (Avoid!)

❌ **Don't:**
- Release without updating version numbers everywhere
- Include broken code examples
- Ship with broken links
- Change APIs without documenting
- Forget to update integration guides

✅ **Do:**
- Test all examples work
- Verify all links before release
- Update version consistently
- Document all changes
- Get peer review of major docs

---

## Version Checklist

Before release, verify versions everywhere:

```bash
# Check all locations
echo "Root package.json:"
grep '"version"' package.json

echo ""
echo "AGENTS.md:"
grep 'Version:' AGENTS.md | head -1

echo ""
echo "Skill files:"
grep 'version:' .github/skills/*/SKILL.md

echo ""
echo "References to version in docs:"
grep -r "0\.0\.[0-9]\+" docs/ | head -5
```

All should show: **0.0.39** (or new version if bumping)

---

## Document Review Checklist

For peer review of documentation:

- [ ] Content is accurate
- [ ] Examples work
- [ ] Spelling/grammar correct
- [ ] Links work
- [ ] Consistent with project style
- [ ] Properly organized
- [ ] Frontmatter complete
- [ ] No sensitive info exposed
- [ ] Follows standards

---

## Release Timeline

Recommended timeline for release:

**7 days before:**
- Code freeze
- Documentation audit begins
- Link verification

**3 days before:**
- Final content review
- Code examples tested
- Build verified

**1 day before:**
- All checks pass
- Ready for release

**Release day:**
- Bump version
- Build and deploy
- Announce

**After release:**
- Monitor for issues
- Fix any problems quickly
- Update FAQ if needed

---

## Sign-Off Template

Use this for documenting release approval:

```markdown
# Release 0.0.40 Documentation Sign-Off

## Completed

- [x] Code examples tested
- [x] All links verified
- [x] Version numbers updated
- [x] Build passes cleanly
- [x] No broken links
- [x] Examples display correctly
- [x] No spelling/grammar issues

## Testing Summary

- Tests passed: ✓
- Build succeeded: ✓
- Preview clean: ✓

## Released By

Person: [Name]
Date: [Date]
Time: [Time UTC]

## Notes

Any additional notes or changes made during release.
```

---

## Emergency Hotfix Checklist

If releasing a hotfix/patch:

- [ ] Only update affected documentation
- [ ] Don't bump version unless necessary
- [ ] Update examples affected by fix
- [ ] Add hotfix note to changelog
- [ ] Test documentation build
- [ ] Deploy and verify

---

## Document Health Metrics

Track these to maintain documentation quality:

| Metric | Target | Check Command |
|--------|--------|---------------|
| Build errors | 0 | `pnpm docs:build` |
| Build warnings | 0 | `pnpm docs:build` |
| Broken links | 0 | Manual check or link-checker |
| Test coverage | 100% | `pnpm test` |
| Type errors | 0 | `pnpm typecheck` |
| Lint issues | 0 | `pnpm lint` |

---

## Useful Commands

Quick reference for release tasks:

```bash
# Build documentation
pnpm docs:build

# Preview locally
pnpm docs:preview

# Check types
pnpm typecheck

# Run tests
pnpm test

# Lint check
pnpm lint

# Build project
pnpm build

# Find version references
grep -r "0\.0\.39" .

# Find broken links (manual)
pnpm docs:preview
# Then click through UI

# Find todos
grep -r "TODO\|FIXME\|XXX" docs/
```

---

## Approval Gates

Before going live, need approval from:

1. **Technical Reviewer** - API accuracy
2. **Documentation Reviewer** - Quality and style
3. **Release Manager** - All systems ready

Sign-off from all three before deploying.

