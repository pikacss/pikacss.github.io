---
name: pikacss-docs
description: Documentation maintenance guide for PikaCSS—covers updating documentation during releases, maintaining consistency, validating examples, and ensuring accuracy across all documentation files.
license: MIT
compatibility: Used during PikaCSS releases and documentation updates.
metadata:
  repo: pikacss
  version: 0.0.39
  role: documentation-maintenance
allowed-tools: read
---

## Purpose

This skill provides guidance for maintaining PikaCSS documentation. It ensures that:
- Documentation stays in sync with code changes
- Examples are accurate and tested
- Version numbers are consistent
- Links are valid
- Content is well-organized and findable

Use this skill when:
- Releasing a new PikaCSS version
- Making changes to core functionality
- Adding new features or plugins
- Fixing documentation issues
- Reviewing documentation quality

---

## Documentation Structure

### Main Documentation Locations

```
docs/
├── index.md                   # Homepage
├── guide/                     # User guides
│   ├── basics.md
│   ├── configuration.md
│   ├── keyframes.md
│   ├── variables.md
│   └── ...
├── examples/                  # Real-world examples
│   ├── components.md
│   ├── responsive-design.md
│   └── ...
├── advanced/                  # Deep technical docs
│   ├── architecture.md
│   ├── api-reference.md
│   ├── plugin-development.md
│   ├── plugin-hooks.md
│   └── ...
├── integrations/              # Framework integration guides
│   ├── vite.md
│   ├── nuxt.md
│   └── ...
└── .vitepress/                # VitePress configuration
    └── config.ts
```

### Skill Files (Outside Docs)

```
.github/skills/
├── pikacss-dev/               # Developer workflow guide
├── pikacss-expert/            # User usage guide
└── pikacss-docs/              # This file
```

### Version Reference Files

```
AGENTS.md                       # AI agent maintenance guide
package.json                    # Current version (0.0.39)
```

---

## Release Documentation Checklist

### Pre-Release (Before Version Bump)

- [ ] **Update API Reference**
  - File: `docs/advanced/api-reference.md`
  - Check for new/changed/removed APIs
  - Update function signatures
  - Add/update TypeScript types
  - Add usage examples

- [ ] **Update Plugin Documentation**
  - File: `docs/plugins/`
  - Check each plugin for changes
  - Update configuration examples
  - Verify plugin versions
  - Test example code

- [ ] **Update Configuration Guide**
  - File: `docs/guide/configuration.md`
  - Check all configuration options
  - Update plugin configuration sections
  - Verify default values
  - Add new options if any

- [ ] **Update Feature Guides**
  - Files: `docs/guide/*.md`
  - Check basics.md for API changes
  - Check keyframes.md for changes
  - Check variables.md for changes
  - Update any changed examples

- [ ] **Update Integration Guides**
  - Files: `docs/integrations/`
  - Check for bundler version changes
  - Update setup instructions
  - Verify example configurations

- [ ] **Update Examples**
  - Files: `docs/examples/`
  - Verify all code is functional
  - Check for deprecated patterns
  - Update best practices if changed

- [ ] **Test Documentation Build**
  ```bash
  pnpm docs:build
  # Should complete without warnings
  # Check for broken links
  ```

### Version Number Updates

**Update in all files**:
```bash
# Current version: 0.0.39
# Files to update:
- AGENTS.md (line ~1008)
- .github/skills/pikacss-dev/SKILL.md (line ~8)
- .github/skills/pikacss-expert/SKILL.md (line ~6)
- .github/skills/pikacss-docs/SKILL.md (line ~7, this file)
```

**Where versions appear**:
```
# In AGENTS.md
Current Version: 0.0.39

# In skill files metadata
metadata:
  version: 0.0.39

# In docs (if versioned)
Note: This guide applies to PikaCSS 0.0.39+
```

### After Release

- [ ] **Verify Published Docs**
  - Docs should be deployed to production
  - Check for rendering issues
  - Verify all links work
  - Test interactive examples

- [ ] **Update Release Notes** (if applicable)
  - Summarize major documentation changes
  - Link to updated guides
  - Highlight new features documented

- [ ] **Archive Old Version Docs** (if maintaining multiple versions)
  - Keep docs for previous versions accessible
  - Link to current version prominently
  - Update version selector

---

## Documentation Accuracy Standards

### Example Code Quality

All example code must:
1. **Be syntactically correct** - Copy/paste should work
2. **Be complete** - Include imports and setup
3. **Be tested** - Run before documenting
4. **Be current** - Use latest API/syntax
5. **Have output** - Show expected result

**Example template**:
```typescript
// Complete, runnable example
import { defineEngineConfig } from '@pikacss/core'

export default defineEngineConfig({
  // Example configuration
  prefix: 'pika-',
  
  plugins: [
    // plugins
  ],
  
  shortcuts: {
    shortcuts: [
      // shortcuts
    ]
  }
})
```

### API Documentation Standards

**Each API should include**:
```markdown
### FunctionName

**Signature:**
```typescript
type Signature = (param: Type) => ReturnType
```

**Parameters:**
- `param` (Type) - Description

**Returns:**
- (ReturnType) - Description

**Example:**
```typescript
const result = functionName(param)
```

**Notes:**
- Any important details
- Common pitfalls
- Related APIs
```

### Consistency Checklist

- [ ] **Terminology is consistent**
  - "atomic CSS" not "atomic styles"
  - "build time" not "build-time" (context dependent)
  - "shortcut" not "shortcutname" or "template"

- [ ] **Code examples match current API**
  - pika() examples use current syntax
  - Plugin examples use current hooks
  - Config examples use current structure

- [ ] **Links are valid**
  - Internal links use relative paths: `[link](../guide/basics.md)`
  - External links use full URLs
  - Anchor links match headings: `[heading](#heading-name)`

- [ ] **Cross-references are present**
  - "See also: [Related Guide](link)"
  - "For details, see [API Reference](link)"

- [ ] **Version compatibility noted**
  - Breaking changes documented
  - Deprecated features marked
  - "New in 0.0.39" labels where applicable

---

## File-Specific Maintenance

### `docs/guide/basics.md`

**Maintain:**
- Core `pika()` function documentation
- Build-time constraint explanation
- Selector `$` syntax
- Special properties (`__important`, `__shortcut`)
- Shortcut basics
- Configuration basics

**Check when:**
- Core API changes
- Build system changes
- Special properties added/removed

### `docs/advanced/api-reference.md`

**Maintain:**
- Complete public API documentation
- All function signatures
- All type definitions
- Parameter descriptions
- Return value descriptions
- Usage examples for each

**Regenerate:**
- After core API changes
- Before each release
- When adding new public APIs

### `docs/plugins/`

**Maintain individual plugin docs:**

1. **plugin-icons.md**
   - Icon usage patterns
   - Configuration options
   - Collection availability
   - Render modes

2. **plugin-reset.md**
   - Available reset options
   - Default selection
   - Usage examples

3. **plugin-typography.md**
   - Typography shortcuts
   - Modular usage
   - Size variants
   - CSS variables

**Each plugin doc should have:**
- Installation command
- Basic configuration
- Usage examples
- All options documented
- Common patterns

### `docs/examples/`

**Maintain real-world examples:**

- Responsive layouts
- Component patterns
- Color systems
- Animation examples
- Form styling
- Navigation patterns

**Each example should:**
- Show complete working code
- Explain the approach
- Link to relevant guides
- Include output/screenshot if applicable

### `AGENTS.md`

**Maintain for:**
- Updated version number
- Tool usage references (correct tool names)
- Architecture documentation
- Development procedures

**Update when:**
- Major architectural changes
- Development workflow changes
- New best practices established
- Release process changes

### `.github/skills/pikacss-expert/SKILL.md`

**Maintain for:**
- User-facing API documentation
- Configuration guide
- Plugin usage guide
- Framework integration guide
- Best practices for users
- Troubleshooting for users

**Update when:**
- Public API changes
- Configuration options change
- Plugins change
- New features added
- User-facing improvements

### `.github/skills/pikacss-dev/SKILL.md`

**Maintain for:**
- Developer workflow guide
- Build and test procedures
- Package architecture explanation
- Plugin development guide
- Release procedures

**Update when:**
- Development workflow changes
- Build tools change
- Testing requirements change
- Release process changes

---

## Documentation Style Guide

### Language

- **Always English** - No other languages except in code examples
- **Active voice** - "Use `pika()` to define styles" not "Styles are defined using `pika()`"
- **Clear and direct** - Avoid jargon, explain technical terms
- **Consistent terminology** - Define terms and use consistently

### Formatting

**Markdown conventions:**
```markdown
# Main Heading (H1)
## Section (H2)
### Subsection (H3)

**Bold** for emphasis
`code` for inline code
[Link text](url) for links

- Bullet list item
- Another item

1. Numbered item
2. Another item
```

**Code blocks:**
````markdown
```typescript
// Language specified (typescript, javascript, bash, etc.)
const styles = pika({ color: 'red' })
```
````

**Tables:**
```markdown
| Column | Description |
|--------|------------|
| `api` | Description of API |
| Option | Description |
```

### File Organization

- **One H1 per file** - Main title at top
- **Logical H2 sections** - Group related content
- **Short paragraphs** - 3-4 sentences max
- **Code before explanation** - Show example, then explain
- **Related links at end** - "See also:" section

### Documentation Template

```markdown
# Feature Name

> Brief description of what this is and why you'd use it

## Overview

Explain the concept and when to use it.

## Basic Usage

### Example 1

```typescript
// Code example
```

Explanation of the example.

### Example 2

```typescript
// Another example
```

Explanation.

## Configuration

How to configure this feature.

## API Reference

Detailed API documentation.

## Common Patterns

Real-world usage patterns.

## Troubleshooting

Common issues and solutions.

## See Also

- [Related Guide](link)
- [Reference](link)
```

---

## Validation Procedures

### Pre-Publish Validation

**Run these checks:**

```bash
# 1. Build documentation
pnpm docs:build

# Check output for:
# - No error messages
# - No warning messages
# - All pages generated
```

**Manual checks:**

1. **Broken Links**
   - Click every internal link
   - Verify external links
   - Check anchor links

2. **Code Examples**
   - Copy/paste and verify syntax
   - Check for outdated APIs
   - Verify output is correct

3. **Consistency**
   - Check all files use same terminology
   - Verify version numbers match
   - Check formatting is consistent

### Automated Checks (CI/CD)

```bash
# TypeScript examples (if included)
pnpm lint

# Link validation
pnpm docs:build --check-links  # If available

# Version consistency
grep -r "0\.0\.[0-9]*" docs/
grep -r "0\.0\.[0-9]*" AGENTS.md
grep -r "0\.0\.[0-9]*" .github/skills/
```

---

## Deprecation & Migration

### Documenting Deprecated Features

When deprecating an API or feature:

```markdown
## Feature Name [Deprecated]

**⚠️ Deprecated in 0.0.39** - Use [New Feature](link) instead

This feature is deprecated and will be removed in version 1.0.0.

### Migration Guide

Old way:
```typescript
const styles = oldApi()
```

New way:
```typescript
const styles = newApi()
```
```

### Breaking Changes

Always document breaking changes prominently:

```markdown
## 🚨 Breaking Change: Feature X

**Affected:** Users of Feature X
**Version:** 0.0.39
**Migration:** See [Migration Guide](link)

**Before:**
```typescript
const oldWay = feature()
```

**After:**
```typescript
const newWay = featureNew()
```
```

---

## Content Organization Tips

### Information Hierarchy

**Level 1 - Discovery**
- Homepage
- Getting started
- Main concepts

**Level 2 - Learning**
- Feature guides
- Configuration guide
- Integration guides

**Level 3 - Reference**
- API reference
- Plugin hooks
- Type definitions

**Level 4 - Advanced**
- Architecture
- Performance tuning
- Troubleshooting

### Cross-Linking Strategy

- **Guide → API Reference** - "For detailed parameter info, see [API](link)"
- **API Reference → Guide** - "For usage examples, see [Guide](link)"
- **Example → Related Guide** - "Learn more about [topic](link)"
- **Plugin Doc → Core Guide** - "Uses [core concept](link)"

### Sitemap Organization

```
Home
├── Getting Started
│   ├── Installation
│   └── Quick Start
├── Guide
│   ├── Basics
│   ├── Configuration
│   ├── Plugins
│   └── Integration
├── Examples
│   ├── Components
│   ├── Layouts
│   └── Responsive
├── Advanced
│   ├── Architecture
│   ├── API Reference
│   ├── Plugin Development
│   └── Performance
└── FAQ
```

---

## Troubleshooting Documentation Issues

### Issue: Broken Links

**Detection:**
```bash
# Check for broken links
find docs -name "*.md" -exec grep -l "\[.*\](.*)" {} \;

# Verify links (manual or tool)
for link in $(grep -oh "](.*)" docs/**/*.md); do
  echo $link
done
```

**Solution:**
1. Find the correct file path
2. Update relative paths: `../guide/basics.md`
3. Test the link in browser after building

### Issue: Outdated Examples

**Prevention:**
- Keep examples synchronized with source code
- Run example code before committing
- Add timestamps to examples: "Updated in 0.0.39"

**Detection:**
- Code examples won't compile
- Example output doesn't match expected
- Imports are invalid

**Solution:**
1. Test current version of code
2. Update to working syntax
3. Verify output is correct

### Issue: Inconsistent Terminology

**Prevention:**
- Use a glossary (see below)
- Search-and-replace for consistency
- Review all new docs for terminology

**Solution:**
```bash
# Find inconsistencies
grep -r "atomic style" docs/
grep -r "atomic CSS" docs/

# Replace consistently
# Use: sed for find-replace
```

### Glossary of Terms

| Term | Definition | Usage |
|------|-----------|-------|
| atomic CSS | CSS with one declaration per class | "PikaCSS generates atomic CSS" |
| shortcut | Pre-defined style combination | "Use shortcuts for common patterns" |
| plugin | Engine extension system | "Plugins extend PikaCSS functionality" |
| preflight | Global CSS injected before styles | "Preflights set up base styles" |
| selector `$` | Reference to atomic class | "Use $ to reference the current element" |
| build-time | During project build process | "PikaCSS transforms styles at build-time" |
| runtime | During application execution | "No runtime overhead" |

---

## Version Management

### Version Synchronization

All versions should match across:
1. **package.json** - Root and all packages
2. **AGENTS.md** - Current Version section
3. **Skill files** - metadata.version
4. **Documentation** - Version references

**Check current version:**
```bash
cat package.json | grep '"version"'
# Current: 0.0.39
```

**Update all versions:**
```bash
# After running: pnpm release

# Verify in:
grep -r "0\.0\.39" AGENTS.md
grep -r "0\.0\.39" .github/skills/
```

### Version-Specific Documentation

When maintaining multiple version docs:

```markdown
## For PikaCSS 0.0.39+

[Content for current version]

## For PikaCSS 0.0.38

[Content for previous version with deprecation notice]
```

---

## Release Documentation Workflow

### Step 1: Prepare (1-2 days before release)

```bash
# Audit all documentation files
pnpm docs:build

# Check for:
- Broken links
- Outdated examples
- Inconsistent versions
- Missing documentation
```

### Step 2: Update (Same day as release)

- Update API reference for changes
- Update configuration guide
- Update plugin documentation
- Update integration guides
- Test all examples

### Step 3: Version Bump

```bash
# Before:
pnpm release

# After release:
pnpm docs:build  # Verify
```

### Step 4: Publish

```bash
# Documentation auto-deploys (if CI configured)
# Or manually:
pnpm docs:build
# Deploy dist/ folder
```

### Step 5: Verify (After publication)

- Visit https://pikacss.com (or doc site)
- Check all pages load
- Verify examples work
- Test links

---

## Documentation Contribution Guidelines

### For Contributors: How to Update Documentation

This section provides guidance for developers and community members contributing to PikaCSS documentation.

#### 1. Before Writing Documentation

**Research and Planning:**
- Check if documentation already exists for the topic
- Review similar documentation to maintain consistency
- Verify the feature/API is finalized (not experimental)
- Check `docs/llm/README.md` to understand the LLM documentation folder

**Key Files to Review:**
- `docs/guide/important-concepts.md` - Canonical source for build-time constraint
- `docs/advanced/typescript.md` - Canonical source for TypeScript setup
- `docs/integrations/index.md` - Overview of integration patterns
- `.github/skills/pikacss-expert/SKILL.md` - Complete API documentation

#### 2. Creating New Documentation

**Location Decision:**
- **Guides** (`docs/guide/`) - User-facing tutorials and walkthroughs
- **Advanced** (`docs/advanced/`) - Technical deep-dives and architecture
- **Plugins** (`docs/plugins/`) - Individual plugin documentation
- **Integrations** (`docs/integrations/`) - Framework/bundler setup
- **Examples** (`docs/examples/`) - Real-world usage examples
- **Getting Started** (`docs/getting-started/`) - Onboarding content

**File Structure Template:**
```markdown
---
title: Feature Name
description: Short one-line description
outline: deep
---

# Feature Name

Brief introduction (1-2 sentences)

## Overview
Explain what this is and why users need it

## Basic Usage
Simplest example first

## Advanced Usage
More complex examples

## Common Patterns
Real-world usage

## Troubleshooting
Common issues and solutions

## See Also
- [Related Guide](/guide/...)
- [API Reference](/advanced/api-reference)
```

#### 3. Documentation Standards

**Content Guidelines:**
- Write in clear, simple English
- Use "you/your" to address the reader
- Include working code examples
- Show both ✅ good and ❌ bad patterns
- Add warnings for edge cases (use `:::warning` syntax)
- Keep examples minimal and focused
- Test all code examples before submitting

**Markdown Standards:**
- Use ATX headings (#, ##, ###)
- Use code fences with language tags
- Use inline code for variable/function names
- Use bold for UI elements and emphasis
- Use bullet lists for simple lists
- Use tables for comparisons
- Use blockquotes for notes/tips

**Code Examples:**
```typescript
// ✅ GOOD - Clear, minimal, shows the feature
const classes = pika({ color: 'red', padding: '1rem' })

// ❌ BAD - Too complex, confusing
const myComplexStyles = pika({ 
  color: getUserThemeColor(), 
  padding: handleDynamicPadding()
})
```

**Special Content:**
- Use `::: tip` for helpful tips
- Use `::: warning` for critical information
- Use `::: info` for additional context
- Use code-group for multi-language examples

#### 4. Cross-Referencing and Links

**Link to Canonical Sources:**

When explaining build-time constraints, link to canonical source:
```markdown
See [Important Concepts: Build-Time Evaluation](/guide/important-concepts)
```

When explaining TypeScript setup, link to canonical source:
```markdown
See [TypeScript Configuration](/advanced/typescript)
```

When explaining integrations, link to overview:
```markdown
See [Integration Overview](/integrations/)
```

**Avoid Duplication:**
- Don't duplicate explanations if they exist elsewhere
- Link to single source of truth
- Update all references when one source changes

#### 5. Version and Compatibility

**Version Metadata:**
- Include version when introducing new features
- Use format: "Available since PikaCSS 0.0.39"
- Document breaking changes with version
- Link to migration guide if applicable

**Compatibility Notes:**
```markdown
## Framework Support

| Framework | Support | Notes |
|-----------|---------|-------|
| React | ✅ Full | Works with hooks |
| Vue | ✅ Full | Works with Composition API |
| Svelte | ✅ Full | Direct integration |
```

#### 6. Testing Examples

Before submitting documentation:
```bash
# Start docs dev server
pnpm docs:dev

# Verify:
1. All links work
2. Code examples are correct
3. Formatting looks good
4. No typos
5. Examples run without errors
```

#### 7. Managing LLM Documentation

The `docs/llm/` folder contains documentation optimized for AI agents. When updating main docs:

1. **Update main docs first** - `docs/` folder
2. **Update LLM folder** - Mirror key sections in `docs/llm/`
3. **Keep index sync** - `docs/llm/index.md` mirrors `docs/index.md`
4. **Reference README** - See `docs/llm/README.md` for folder purpose

LLM folder sections to maintain:
- `docs/llm/basics.md` - Mirrors core concepts
- `docs/llm/architecture.md` - Mirrors architecture docs
- `docs/llm/configuration.md` - Mirrors configuration guide
- `docs/llm/integrations.md` - Consolidated integration guide

#### 8. Common Mistakes to Avoid

| Mistake | Solution |
|---------|----------|
| Duplicating build-time explanation | Link to `/guide/important-concepts.md` |
| Copy-pasting code without testing | Test all examples before submission |
| Broken links to related docs | Verify all links with `pnpm docs:build` |
| Inconsistent formatting | Follow markdown standards above |
| Missing code examples | Every feature should have at least one example |
| Outdated version numbers | Verify version is current (0.0.39) |
| No "See Also" links | Connect related documentation |

#### 9. Submitting Documentation Changes

**Commit Message Format:**
```
docs(<scope>): <description>

docs(guide): add CSS variables explanation
docs(advanced): fix TypeScript configuration example
docs(plugins): document icons plugin setup
```

**PR Checklist:**
- [ ] Examples tested and working
- [ ] Spelling and grammar checked
- [ ] Links verified
- [ ] Version numbers correct
- [ ] No duplication of canonical sources
- [ ] "See Also" sections added
- [ ] Code follows style conventions
- [ ] Docs build without warnings: `pnpm docs:build`

#### 10. Documentation Maintenance Tasks

**Weekly:**
- Check for reported documentation issues
- Verify broken links

**With Each Release:**
- Update API reference
- Update plugin documentation
- Verify all examples still work
- Update version numbers (0.0.39)
- Review and update AGENTS.md

**Monthly:**
- Audit for duplication
- Check link health
- Review user feedback
- Update FAQ if needed

---

## Resources & References

### Internal
- `.github/skills/pikacss-dev/SKILL.md` - Developer guide
- `.github/skills/pikacss-expert/SKILL.md` - User guide
- `AGENTS.md` - Architecture guide

### External
- **VitePress** - Documentation: https://vitepress.dev/
- **Markdown** - Spec: https://commonmark.org/

---

## Quick Checklist for Release

- [ ] All examples tested and working
- [ ] API reference updated
- [ ] Plugin documentation current
- [ ] Version numbers consistent (0.0.39)
- [ ] Configuration guide updated
- [ ] Integration guides current
- [ ] No broken links
- [ ] Docs build without warnings
- [ ] AGENTS.md reviewed and updated
- [ ] Skills files version updated
- [ ] Documentation published

---

**Last Updated**: 2026-01-19
**Version**: 0.0.39
**Status**: Production Ready
