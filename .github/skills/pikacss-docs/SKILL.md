---
name: pikacss-docs
description: Help maintaining PikaCSS documentation consistency, accuracy, and release procedures
license: MIT
compatibility: opencode
metadata:
  repo: pikacss
  version: 0.0.39
  audience: maintainers
  workflow: documentation
---

## When to use me

Use this skill for:

- Updating documentation during releases
- Ensuring example code is accurate and tested
- Maintaining version consistency across docs
- Reviewing documentation accuracy
- Creating new documentation files
- Fixing broken links or outdated content

---

## Release Documentation Checklist

Before each release:

```
📋 Pre-Release Audit
- [ ] Run: pnpm docs:build
- [ ] Check for broken links
- [ ] Verify all code examples work
- [ ] Review API changes in docs/advanced/api-reference.md
- [ ] Update version numbers (currently 0.0.39)

📝 Update Documentation
- [ ] API reference for new/changed/removed APIs
- [ ] Plugin documentation (docs/plugins/)
- [ ] Integration guides if bundler versions changed
- [ ] Configuration examples

✅ Verify
- [ ] All tests pass
- [ ] Docs build without warnings
- [ ] AGENTS.md matches current architecture
- [ ] Skills files have correct version
- [ ] Examples in docs/examples/ are correct

🚀 Release
- [ ] Update version with: pnpm release
- [ ] Verify links work: pnpm docs:build && pnpm docs:preview
- [ ] Deploy documentation
```

---

## Version Management

All versions should match across:

1. **package.json** - Root version
2. **AGENTS.md** - Current Version section
3. **Skills frontmatter** - metadata.version field
4. **Documentation** - Version references

```bash
# Check current version
grep '"version"' package.json

# Update everywhere
# 1. Edit package.json
# 2. Run: pnpm release  (bumps version)
# 3. Update AGENTS.md line: **Version**: X.X.X
# 4. Update each skill file: version: X.X.X
```

---

## Documentation Standards

### Canonical Sources (Single Source of Truth)

Keep these synchronized:

- **`/guide/important-concepts.md`** - Build-time evaluation explanation
- **`/advanced/typescript.md`** - TypeScript configuration guide
- **`/integrations/index.md`** - Integration overview and patterns

All other docs should **link** to these, not duplicate content.

### Skill Structure

Each skill should include:

- **Frontmatter**: name, description, license, metadata
- **When to use me**: When agents should load this skill
- **Core content**: Main guidance (keep under 500 lines)
- **References**: Links to external docs

### Code Examples

All code examples must:

- ✅ Be correct and runnable
- ✅ Demonstrate best practices
- ✅ Include both good ❌ and bad ✅ patterns where applicable
- ✅ Use current API (v0.0.39)

---

## File Organization

```
docs/
├── guide/              # User tutorials
│   ├── basics.md       # Getting started
│   ├── important-concepts.md  # Build-time constraint (CANONICAL)
│   ├── configuration.md
│   └── ...
├── advanced/           # Technical deep-dives
│   ├── typescript.md   # TypeScript setup (CANONICAL)
│   ├── api-reference.md
│   └── ...
├── integrations/       # Framework/bundler guides
│   ├── index.md        # Overview (CANONICAL)
│   ├── vite.md
│   ├── nuxt.md
│   └── ...
├── examples/           # Real-world components
└── llm/               # LLM-optimized docs (mirror of main)

.github/skills/         # Agent guidance files
├── pikacss-dev/       # Developer workflow
├── pikacss-expert/    # User API reference
├── pikacss-docs/      # Documentation maintenance
└── references/        # Supplementary reference files
```

---

## Common Maintenance Tasks

### Adding New Documentation

1. **Decide location** based on content type:
   - Getting started → `/guide/`
   - Technical details → `/advanced/`
   - Framework setup → `/integrations/`
   - Practical examples → `/examples/`

2. **Use template**:
   ```markdown
   ---
   title: Feature Name
   description: One-line description
   outline: deep
   ---
   
   # Feature Name
   
   Brief intro (1-2 sentences)
   
   ## Overview
   
   ## Basic Usage
   
   ## Advanced Usage
   
   ## Next Steps
   
   - Link to related docs
   ```

3. **Test**:
   - Run: `pnpm docs:dev`
   - Check links work
   - Verify examples are correct

### Updating LLM Documentation

The `docs/llm/` folder mirrors main docs. When updating main docs:

1. Update files in `docs/` first
2. Mirror changes in `docs/llm/`
3. Keep `docs/llm/README.md` explaining folder purpose

### Cross-Referencing

When explaining core concepts:

```markdown
// For build-time constraint
See [Important Concepts](/guide/important-concepts)

// For TypeScript setup
See [TypeScript Configuration](/advanced/typescript)

// For integrations overview
See [Integration Guide](/integrations/)
```

### Validating Examples

Before committing:

```bash
# Build documentation
pnpm docs:build

# Check for broken links
pnpm docs:build

# Preview locally
pnpm docs:preview

# Verify examples in docs/examples/components.md work
# (manually test or run component tests)
```

---

## Build-Time Constraint

All documentation about `pika()` must emphasize:

> All arguments to `pika()` must be **statically analyzable** at build time. No runtime variables, function calls, or dynamic expressions allowed.

Document solutions:

- **CSS Variables** (recommended for dynamic values)
- **Conditional Shortcuts** (for predefined variants)
- **Multiple `pika()` calls** (evaluate conditions outside)

---

## Glossary (Keep Consistent)

| Term | Definition | Example |
|------|-----------|---------|
| atomic CSS | One CSS property per class | `.a { color: red; }` |
| shortcut | Pre-defined style combination | `pika('btn-primary')` |
| build-time | During project build | Style transformation happens here |
| runtime | During app execution | Props, state, user input |
| preflights | Global CSS injected first | Base styles, resets |
| selector `$` | Current element reference | `'$:hover'`, `'$ > span'` |

---

## Quality Metrics

Track documentation health:

- ✅ All examples tested and working
- ✅ API reference complete
- ✅ Version numbers consistent
- ✅ No broken links
- ✅ Build warnings: 0
- ✅ Test pass rate: 100%

---

## References

- **Development**: `.github/skills/pikacss-dev/SKILL.md`
- **User Guide**: `.github/skills/pikacss-expert/SKILL.md`
- **Architecture**: `AGENTS.md`
- **Official Docs**: `/docs/`

