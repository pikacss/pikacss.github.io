---
name: pikacss-docs
description: Guidance for maintaining project documentation including standards, templates, release checklists, and quality processes. Use when writing or maintaining documentation, preparing releases, or ensuring documentation consistency.
license: MIT
compatibility: opencode
metadata:
  repo: pikacss
  version: 0.0.39
  audience: maintainers
  workflow: documentation
---

# PikaCSS Documentation Maintenance Skill

Complete guidance for writing, maintaining, and releasing project documentation.

## Overview

Documentation is critical to project success. This skill provides structured guidance for:
- Writing consistent, high-quality documentation
- Maintaining documentation standards
- Preparing releases with complete and accurate docs
- Ensuring documentation stays current

All documentation must be in English and follow project conventions.

---

## Quick Navigation

This skill provides progressive disclosure. Find what you need:

### For Writing Standards & Style

**See [Standards & Conventions Reference](./references/standards.md)**
- Writing style guidelines (clear, concise, practical)
- File organization and structure
- Code examples (syntax, testing, quality)
- Cross-references and internal links
- Versioning and terminology consistency
- Quality checklist for reviews
- ~900 lines of detailed standards

*Use this when writing new documentation or reviewing documentation quality.*

### For Getting Started Quickly

**See [Documentation Templates Reference](./references/templates.md)**
- Guide/Tutorial template
- API Reference template
- Integration Guide template
- Plugin Documentation template
- FAQ template
- Example Component template
- Best practices for customizing templates
- ~800 lines of ready-to-use templates

*Use this when creating a new documentation file - pick template, customize, write.*

### For Release Preparation

**See [Release Documentation Checklist](./references/release-checklist.md)**
- Pre-release phase checklist (1-2 weeks before)
- Release day checklist
- Quality verification steps
- Post-release tasks
- Common mistakes to avoid
- Version verification
- Document review checklist
- Sign-off template
- ~600 lines of actionable release procedures

*Use this when preparing a release to ensure nothing is forgotten.*

---

## Core Principles

### Single Source of Truth

Never duplicate canonical content. Instead, link to these sources:

- **`/guide/important-concepts.md`** - Build-time evaluation constraint
- **`/advanced/typescript.md`** - TypeScript configuration
- **`/integrations/index.md`** - Integration overview

When explaining concepts, link to canonical sources rather than repeating them.

### Documentation for Everyone

Write so developers of all skill levels can understand:
- New developers: Getting started guides
- Advanced developers: API references and deep dives
- Framework users: Integration guides

### Code Examples Must Work

Every code example must:
- Be syntactically correct
- Demonstrate best practices
- Work when copy-pasted
- Use current API version

### Version Consistency

All version references must match:
- `package.json` version
- AGENTS.md version
- Skill file versions
- Example configurations
- Documentation references

---

## File Organization

```
docs/
├── guide/                        # User tutorials
│   ├── basics.md
│   ├── important-concepts.md     # CANONICAL: Build-time constraint
│   ├── configuration.md
│   └── shortcuts.md
│
├── advanced/                     # Technical details
│   ├── typescript.md             # CANONICAL: TypeScript setup
│   ├── api-reference.md
│   ├── plugin-development.md
│   └── troubleshooting.md
│
├── integrations/                 # Framework/bundler guides
│   ├── index.md                  # CANONICAL: Integration overview
│   ├── vite.md
│   ├── nuxt.md
│   └── webpack.md
│
├── plugins/                      # Official plugin docs
│   ├── icons.md
│   ├── reset.md
│   └── typography.md
│
├── examples/                     # Real-world code
│   └── components.md
│
├── community/                    # Community content
│   ├── contributing.md
│   ├── faq.md
│   └── changelog.md
│
└── llm/                         # LLM-optimized copies
```

---

## Writing Workflow

### 1. Choose Type & Template

```
New documentation?
├─ Getting started → Use Guide Template
├─ API details → Use API Reference Template  
├─ Framework setup → Use Integration Template
├─ Sharing code → Use Example Component Template
└─ Questions answered → Use FAQ Template
```

See [Templates Reference](./references/templates.md) for all templates.

### 2. Check Standards

Review [Standards Reference](./references/standards.md) for:
- Writing style guidance
- File organization
- Frontmatter format
- Code example requirements
- Cross-reference patterns
- Quality checklist

### 3. Write & Test

- Write content following template
- Test all code examples
- Verify all links
- Check formatting

### 4. Build & Preview

```bash
pnpm docs:dev    # Live preview
pnpm docs:build  # Build output
```

### 5. Quality Review

Check against [Standards Reference](./references/standards.md):
- [ ] Clear and concise
- [ ] Code examples work
- [ ] Links functional
- [ ] Frontmatter complete
- [ ] Consistent style
- [ ] No duplicate content

### 6. Commit

```bash
git add docs/
git commit -m "docs: describe what was added/changed"
```

---

## Release Workflow

Use [Release Checklist](./references/release-checklist.md) with these phases:

### Phase 1: Pre-Release (1-2 weeks before)

- [ ] Code freeze review
- [ ] Version audit
- [ ] Documentation audit
- [ ] Link verification
- [ ] Code example verification

### Phase 2: Release Day

- [ ] Final documentation pass
- [ ] Skill frontmatter update
- [ ] Configuration examples update
- [ ] Build & preview

### Phase 3: Quality Checks

- [ ] Content quality verified
- [ ] Documentation complete
- [ ] All tests passing
- [ ] Build successful

### Phase 4: Post-Release

- [ ] Verify deployed docs
- [ ] Monitor for issues
- [ ] Fix problems quickly

See [Release Checklist](./references/release-checklist.md) for complete detailed steps.

---

## Standards Quick Reference

### Language & Tone

- ✅ English only
- ✅ Clear and concise
- ✅ Present tense: "generates CSS"
- ✅ Active voice: "PikaCSS generates"
- ✅ Second person for instructions: "You define"
- ✅ Imperative: "Run this command"

### Code Examples

- ✅ Syntactically correct
- ✅ Runnable (not snippets)
- ✅ Best practices
- ✅ Current API version
- ✅ Include good/bad patterns

### File Format

- ✅ Markdown (.md)
- ✅ Kebab-case filenames
- ✅ Frontmatter with title, description
- ✅ Hierarchical headings (h1, h2, h3...)
- ✅ 300-800 lines per file

### Links

- ✅ Internal: `[Link](./path.md)` or `[Link](#anchor)`
- ✅ External: Provide context
- ✅ Canonical sources: Always link, never duplicate

### Terminology

Use consistently (see [Standards Reference](./references/standards.md) for full glossary):
- **atomic CSS** - One property per class
- **shortcut** - Pre-defined style combo
- **build time** - During project build
- **runtime** - During app execution
- **engine** - Core processor
- **plugin** - Extends functionality

---

## Version Management

Always keep versions synchronized:

**Update locations:**
1. `package.json` - Root version
2. `AGENTS.md` - Current Version section
3. Each skill file - `metadata.version`
4. Documentation - Version references
5. Example configs - Version in use

**Command to find all versions:**
```bash
grep -r "0\.0\.39" .
```

---

## Canonical Documentation

These are authoritative sources - reference them, don't duplicate:

### 1. `/guide/important-concepts.md`

**Topic:** Build-time evaluation constraint

**Use:** When explaining why `pika()` arguments must be static

**Link:** `[Important Concepts](/guide/important-concepts.md)`

### 2. `/advanced/typescript.md`

**Topic:** TypeScript setup and configuration

**Use:** When explaining TypeScript features

**Link:** `[TypeScript Configuration](/advanced/typescript.md)`

### 3. `/integrations/index.md`

**Topic:** Integration overview and patterns

**Use:** When introducing integrations

**Link:** `[Integration Guide](/integrations/index.md)`

---

## Common Documentation Tasks

### Task: Adding a New Feature

1. Create feature guide: Use Guide Template
2. Update API reference: Add to `/advanced/api-reference.md`
3. Update example: Add to `/docs/examples/components.md`
4. Update integration guides if applicable
5. Add to changelog/release notes
6. Run `pnpm docs:build` - should pass

### Task: Breaking Change

1. Add migration guide in `/docs/advanced/migration-vX.md`
2. Update affected docs with migration link
3. Update API reference
4. Highlight in changelog
5. Link in FAQ if common question

### Task: Framework Integration

1. Create integration guide: Use Integration Template
2. Verify it links to canonical sources
3. Add to `/integrations/` directory
4. List in `/integrations/index.md`

### Task: Release Documentation

Use [Release Checklist](./references/release-checklist.md):
1. Pre-release phase
2. Release day tasks
3. Quality verification
4. Post-release tasks

---

## Quality Assurance

### Before Committing

- [ ] Spell checked
- [ ] Grammar reviewed
- [ ] Code examples tested
- [ ] Links verified
- [ ] Frontmatter complete
- [ ] Consistent with standards
- [ ] Not duplicating canonical content

**Quick test:**
```bash
pnpm docs:build  # Should pass with 0 errors
```

### Before Releasing

- [ ] All tests pass: `pnpm test`
- [ ] Build succeeds: `pnpm build`
- [ ] Docs build clean: `pnpm docs:build`
- [ ] Preview looks good: `pnpm docs:preview`
- [ ] All version numbers match
- [ ] All links work
- [ ] No spelling/grammar errors

---

## Useful Commands

```bash
# Development server (live reload)
pnpm docs:dev

# Build documentation
pnpm docs:build

# Preview built docs
pnpm docs:preview

# Check types
pnpm typecheck

# Run tests
pnpm test

# Lint & fix
pnpm lint

# Find version references
grep -r "0\.0\.39" .

# Find TODO markers
grep -r "TODO\|FIXME\|XXX" docs/
```

---

## Documentation Examples

### Example 1: Adding New API

1. Check [Standards Reference](./references/standards.md) section on code examples
2. Use [Templates Reference](./references/templates.md) API Reference template
3. Write function signature, parameters, returns
4. Add working examples
5. Link to related APIs
6. Build and test: `pnpm docs:build`

### Example 2: Preparing Release

1. Open [Release Checklist](./references/release-checklist.md)
2. Work through each phase
3. Verify all boxes checked
4. Sign off when complete

### Example 3: Adding Framework Integration

1. Use [Templates Reference](./references/templates.md) Integration template
2. Follow setup steps in template
3. Include real-world example
4. Link to canonical `/integrations/index.md`
5. Build and preview

---

## Troubleshooting

### Docs won't build

```bash
# Check for errors
pnpm docs:build

# See full error output
DEBUG=* pnpm docs:build
```

### Broken links

```bash
# Build and preview to check
pnpm docs:preview
# Click through manually

# Check link syntax
# Use relative paths: [Link](./file.md)
```

### Code examples not working

- [ ] Syntax is correct (use IDE to verify)
- [ ] API version is current
- [ ] All dependencies imported
- [ ] Can copy-paste and run

---

## References

- [Documentation Standards & Conventions](./references/standards.md)
- [Documentation Templates](./references/templates.md)
- [Release Documentation Checklist](./references/release-checklist.md)
- Project [AGENTS.md](../../AGENTS.md) - Architecture guide
- User guide: [pikacss-expert skill](../pikacss-expert/SKILL.md)
- Developer guide: [pikacss-dev skill](../pikacss-dev/SKILL.md)

---

## Getting Help

### When to reference each file:

- **Writing docs** → [Standards Reference](./references/standards.md)
- **Creating docs** → [Templates Reference](./references/templates.md)  
- **Releasing** → [Release Checklist](./references/release-checklist.md)
- **Development** → [pikacss-dev skill](../pikacss-dev/SKILL.md)
- **API questions** → [pikacss-expert skill](../pikacss-expert/SKILL.md)

### Questions?

Check:
1. [Standards Reference](./references/standards.md) for writing/style questions
2. [Templates Reference](./references/templates.md) for structure/format
3. [Release Checklist](./references/release-checklist.md) for release procedures
4. [AGENTS.md](../../AGENTS.md) for architecture

---

**Current Version:** 0.0.39  
**Last Updated:** 2026-01-19
