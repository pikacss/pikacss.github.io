# PikaCSS Skills Quick Start

## For AI Agents

### Discovery

PikaCSS provides two specialized skills:

```xml
<available_skills>
  <skill>
    <name>pikacss-dev</name>
    <description>Comprehensive developer workflow guide for PikaCSS monorepo maintenance, including package architecture, implementation patterns, testing strategies, and release procedures.</description>
    <location>.github/skills/pikacss-dev/SKILL.md</location>
  </skill>
  <skill>
    <name>pikacss-expert</name>
    <description>Comprehensive user guidance for PikaCSS API, configuration, style definition, plugin usage, and best practices for building with atomic CSS.</description>
    <location>.github/skills/pikacss-expert/SKILL.md</location>
  </skill>
</available_skills>
```

### When to Use

**Use `pikacss-dev` when:**
- Maintaining the PikaCSS repository
- Implementing new features
- Fixing bugs in core packages
- Creating plugins for PikaCSS
- Releasing new versions
- Working on build tools or integration

**Use `pikacss-expert` when:**
- Helping users build with PikaCSS
- Answering questions about API usage
- Explaining style definition syntax
- Providing troubleshooting assistance
- Recommending best practices
- Configuring engine or plugins

### Loading Strategy

**Stage 1: Quick Load** (Startup)
- Load only YAML frontmatter from both skills
- Context cost: ~100 tokens per skill
- Determines which skill to activate

**Stage 2: Full Load** (Activation)
- Load complete SKILL.md for selected skill
- Context cost: ~2000-3500 tokens
- Provides practical guidance and examples

**Stage 3: Reference Load** (On-Demand)
- Load specific reference file when needed
- Context cost: ~500-2000 tokens per file
- Provides deep dives and complete documentation

**Example workflow:**
```
User: "How do I fix this color bug in @pikacss/core?"
→ Agent loads pikacss-dev/SKILL.md
→ Reads: "For bug fixes, see references/IMPLEMENTATION-GUIDE.md"
→ Agent loads IMPLEMENTATION-GUIDE.md
→ Finds bug fix decision tree
→ Total context: ~2600 tokens ✅
```

---

## For Developers (Using the Repository)

### Setup

```bash
# Clone the repository
git clone https://github.com/pikacss/pikacss.git
cd pikacss

# The skills are pre-configured in .github/skills/
# They'll be automatically discovered by compatible AI agents
```

### Working with Skills

#### Maintaining Skills

**When to update:**
- Architecture changes → `pikacss-dev/references/ARCHITECTURE.md`
- New features → `pikacss-expert/references/API-REFERENCE.md`
- New workflows → `pikacss-dev/references/IMPLEMENTATION-GUIDE.md`
- Bug fixes → `pikacss-expert/references/TROUBLESHOOTING.md`

**Rules:**
- Keep main SKILL.md files under 600 lines
- Each reference file addresses one concern
- Use relative paths for references: `[Guide](references/FILENAME.md)`
- Never cross-reference between skills
- Always keep descriptions in English

**Example update:**
```
New feature: Support for `:has()` pseudo-class

1. Add API documentation to:
   pikacss-expert/references/API-REFERENCE.md
   
2. Add implementation guide to:
   pikacss-dev/references/IMPLEMENTATION-GUIDE.md
   
3. Update examples in:
   pikacss-expert/SKILL.md
   pikacss-dev/SKILL.md
```

### File Locations

```
.github/skills/
├── SKILLS-ARCHITECTURE.md          # This document
├── pikacss-dev/                    # For developers
│   ├── SKILL.md                    # Main guidance (192 lines)
│   └── references/
│       ├── ARCHITECTURE.md         # Package structure
│       ├── IMPLEMENTATION-GUIDE.md # Feature/bug workflows
│       └── PLUGIN-PATTERNS.md      # Plugin internals
│
└── pikacss-expert/                 # For users
    ├── SKILL.md                    # Main guidance (594 lines)
    └── references/
        ├── API-REFERENCE.md        # API documentation
        ├── PLUGIN-GUIDE.md         # Plugin usage
        └── TROUBLESHOOTING.md      # Common issues
```

---

## Content Overview

### pikacss-dev Skill

**Main file** (`SKILL.md`):
- Quick start with essential commands
- Monorepo structure overview
- Development workflow steps
- Testing strategy
- Release process
- Critical rules and best practices
- Commit message guidelines
- Common issues and fixes

**References:**
1. **ARCHITECTURE.md** - Package relationships, build order, dependency graph
2. **IMPLEMENTATION-GUIDE.md** - Decision trees, checklists, patterns
3. **PLUGIN-PATTERNS.md** - Plugin system, error handling, testing

### pikacss-expert Skill

**Main file** (`SKILL.md`):
- Quick start with basic usage
- Core concepts and static evaluation
- Style definition API
- Shortcuts and utilities
- Configuration
- Best practices (6 patterns)
- Common components (buttons, cards, grids)

**References:**
1. **API-REFERENCE.md** - Complete API, functions, types, pseudo-elements
2. **PLUGIN-GUIDE.md** - Official plugins, custom plugins, configuration
3. **TROUBLESHOOTING.md** - Common issues, solutions, limitations

---

## Integration with Agents

### Claude Integration

Add to Claude system prompt:

```xml
<available_skills>
  <skill>
    <name>pikacss-dev</name>
    <description>Comprehensive developer workflow guide for PikaCSS monorepo maintenance, including package architecture, implementation patterns, testing strategies, and release procedures.</description>
    <location>/path/to/repo/.github/skills/pikacss-dev/SKILL.md</location>
  </skill>
  <skill>
    <name>pikacss-expert</name>
    <description>Comprehensive user guidance for PikaCSS API, configuration, style definition, plugin usage, and best practices for building with atomic CSS.</description>
    <location>/path/to/repo/.github/skills/pikacss-expert/SKILL.md</location>
  </skill>
</available_skills>
```

### Other Agent Systems

Use the `skills-ref` CLI tool:

```bash
# Validate skills
skills-ref validate .github/skills/pikacss-dev
skills-ref validate .github/skills/pikacss-expert

# Generate prompt XML
skills-ref to-prompt .github/skills/pikacss-dev .github/skills/pikacss-expert
```

---

## Design Principles

### 1. Progressive Disclosure
- Metadata at startup (minimal context)
- Full guidance on activation (~2000-3500 tokens)
- Deep references on-demand (~500-2000 tokens)

### 2. Skill Independence
- Each skill is completely autonomous
- No mutual references between skills
- Can be used separately or together

### 3. Clear Separation
- **Dev skill**: Internal, maintenance-focused
- **Expert skill**: External, user-facing
- No content duplication

### 4. Focused References
- One topic per reference file
- One reference level deep
- Clear "when to load" guidance

### 5. English-Only Content
- All documentation in English
- No translations needed
- Consistent terminology

---

## Best Practices

### For Agent Developers

✅ **DO**:
- Load metadata at startup for all skills
- Match user task to skill description
- Load complete SKILL.md when skill activated
- Load references on-demand based on user query
- Cache loaded references in session

❌ **DON'T**:
- Load all references at once
- Cross-load between skills
- Ignore skill separation
- Modify skill content programmatically
- Store modified skill content

### For Repository Maintainers

✅ **DO**:
- Keep main files under 600 lines
- Use relative references from skill root
- Update descriptions when content changes
- Maintain English-only content
- Follow Agent Skills specification

❌ **DON'T**:
- Cross-reference between skills
- Add circular dependencies
- Duplicate content across skills
- Use absolute file paths
- Mix concerns in single files

---

## Validation

### Pre-Commit Checklist

Before committing skill changes:

```bash
# Validate both skills
skills-ref validate .github/skills/pikacss-dev
skills-ref validate .github/skills/pikacss-expert

# Check line counts (should be reasonable)
wc -l .github/skills/*/SKILL.md
wc -l .github/skills/*/references/*.md

# Verify no circular references
grep -r "pikacss-expert" .github/skills/pikacss-dev || true
grep -r "pikacss-dev" .github/skills/pikacss-expert || true

# Check English-only content
# (manual verification of non-Latin characters)
```

### Common Validation Errors

**Invalid YAML frontmatter**:
```yaml
# ❌ Wrong
name:pikacss-dev
description:Comprehensive guide

# ✅ Correct
name: pikacss-dev
description: Comprehensive guide...
```

**Circular references**:
```markdown
<!-- ❌ Wrong -->
See [pikacss-dev guide](.../pikacss-dev/SKILL.md)

<!-- ✅ Correct -->
See [the main skill](../SKILL.md)
```

**Deep nesting**:
```
<!-- ❌ Wrong -->
[references/subdir/file.md](references/subdir/file.md)

<!-- ✅ Correct -->
[file guide](references/file.md)
```

---

## Support & Updates

### Getting Help

1. Check [SKILLS-ARCHITECTURE.md](SKILLS-ARCHITECTURE.md) for design decisions
2. Review skill contents in `.github/skills/`
3. Validate with `skills-ref` tool
4. Open issue on GitHub for spec questions

### Staying Current

Skills automatically sync with `AGENTS.md`:
- Architecture changes → Update both
- New workflows → Update both
- API additions → Update both

Keep them in sync to avoid confusion.

---

## Version History

- **v2.0.0** (2026-01-20): Initial release
  - Complete pikacss-dev skill with 3 references
  - Complete pikacss-expert skill with 3 references
  - Full compliance with Agent Skills specification
  - Progressive disclosure pattern implemented
  - Complete separation of concerns
