# PikaCSS Skills Architecture

## Overview

Two complementary skills provide specialized guidance for different user personas:

### `pikacss-dev` - For Developers
**Primary users**: AI agents and developers maintaining PikaCSS codebase

**Focus areas**:
- Monorepo architecture and package relationships
- Development workflows and implementation patterns
- Testing strategies and release procedures
- Plugin system internals
- Git and commit conventions

**Main file size**: 192 lines
**Load strategy**: Quick context (~100 tokens) for metadata, full skill (~2000 tokens) when needed

### `pikacss-expert` - For Users & API Consumers
**Primary users**: AI agents and developers using PikaCSS in projects

**Focus areas**:
- API reference and style definition syntax
- Configuration and framework integration
- Plugin usage and customization
- Best practices and common patterns
- Troubleshooting and edge cases

**Main file size**: 594 lines
**Load strategy**: Quick context (~100 tokens) for metadata, full skill (~3500 tokens) when needed

---

## Progressive Disclosure Design

Both skills follow the **Progressive Disclosure** pattern from Agent Skills specification:

### Level 1: Metadata (Discovery)
- **When loaded**: At agent startup
- **Token cost**: ~50-100 tokens per skill
- **Content**: Name + description
- **Format**: YAML frontmatter only

```yaml
---
name: pikacss-dev
description: Comprehensive developer workflow guide for PikaCSS...
---
```

### Level 2: Main Instructions (Activation)
- **When loaded**: When task matches skill description
- **Token cost**: ~1000-3000 tokens
- **Content**: Practical guidance, examples, decision trees
- **Strategy**:
  - `pikacss-dev/SKILL.md` (192 lines) - Lean main file
  - `pikacss-expert/SKILL.md` (594 lines) - Comprehensive main file

### Level 3: Reference Materials (On-Demand)
- **When loaded**: When specific details needed
- **Token cost**: ~500-2000 tokens per reference file
- **Content**: Deep dives, complete API docs, patterns
- **Structure**:
  - One focused topic per file
  - Clear cross-references
  - Separated by concern

---

## Reference File Organization

### pikacss-dev References (3 files)

**1. references/ARCHITECTURE.md** (278 lines)
- Package structure and dependencies
- Layered architecture diagram
- Package responsibilities
- Build order and workspace patterns
- File organization standards
- Circular dependency prevention

**When to load**: Understanding codebase structure, planning features

**2. references/IMPLEMENTATION-GUIDE.md** (413 lines)
- Decision trees for features vs bugs
- Step-by-step implementation checklists
- Feature location guidelines
- Testing patterns
- Code style conventions
- Git workflow

**When to load**: Implementing features, fixing bugs, planning changes

**3. references/PLUGIN-PATTERNS.md** (476 lines)
- Plugin interface and architecture
- Execution order control
- Module augmentation patterns
- Error handling strategies
- Dependency management
- Plugin lifecycle
- Testing plugin code

**When to load**: Creating or modifying plugins, understanding plugin system

### pikacss-expert References (3 files)

**1. references/API-REFERENCE.md** (504 lines)
- Complete function signatures
- Configuration interfaces
- Return types
- Module augmentation guide
- Pseudo-elements and media queries
- Selectors and shorthands
- Value types and type safety
- Generated types

**When to load**: Using PikaCSS API, configuring engine, type checking

**2. references/PLUGIN-GUIDE.md** (447 lines)
- Official plugin documentation
  - @pikacss/plugin-icons
  - @pikacss/plugin-reset
  - @pikacss/plugin-typography
- Custom plugin creation
- Plugin execution order
- Configuration best practices
- Troubleshooting plugins
- Performance optimization

**When to load**: Using plugins, creating custom plugins, configuring features

**3. references/TROUBLESHOOTING.md** (484 lines)
- Common issues with solutions
  - Style not applied
  - Runtime value errors
  - Class collisions
  - Performance issues
  - Type errors
  - Media queries
  - Pseudo-classes/elements
- Known limitations
- Debug checklist

**When to load**: Debugging issues, understanding limitations, error resolution

---

## Skill Independence & Separation

### Why Two Skills?

1. **Different Audiences**
   - `pikacss-dev`: Internal development/maintenance
   - `pikacss-expert`: User-facing API and practices

2. **Different Context Patterns**
   - `pikacss-dev`: Decision trees, architectural decisions, workflows
   - `pikacss-expert`: API docs, examples, troubleshooting

3. **Independent Activation**
   - Agent loads `pikacss-dev` when maintaining repository
   - Agent loads `pikacss-expert` when helping users build with PikaCSS

### No Duplication

- **API details**: Only in `pikacss-expert/API-REFERENCE.md`
- **Architecture**: Only in `pikacss-dev/ARCHITECTURE.md`
- **Workflows**: Only in `pikacss-dev/IMPLEMENTATION-GUIDE.md`
- **Usage patterns**: Only in `pikacss-expert/PLUGIN-GUIDE.md`

Each concept lives in exactly one place.

---

## Progressive Loading Example

### Scenario 1: Agent Needs to Fix a Bug in Core

```
1. Agent startup
   Loads: Skill metadata only (~100 tokens)
   - Discovers: pikacss-dev, pikacss-expert

2. User: "Fix bug in @pikacss/core where colors aren't..."
   Agent decides: Task matches pikacss-dev

3. Load Full Skill
   Loads: pikacss-dev/SKILL.md (~2000 tokens)

4. Agent searches for "find affected package"
   Gets: Link to references/IMPLEMENTATION-GUIDE.md

5. Load Reference On-Demand
   Loads: IMPLEMENTATION-GUIDE.md (~500 tokens)
   Shows bug fix decision tree

6. Total context for solving bug: ~2600 tokens (very efficient!)
```

### Scenario 2: User Needs Help with Style Definition

```
1. Agent startup
   Loads: Skill metadata only (~100 tokens)

2. User: "How do I define styles with responsive breakpoints?"
   Agent decides: Task matches pikacss-expert

3. Load Full Skill
   Loads: pikacss-expert/SKILL.md (~3500 tokens)
   Shows media query examples

4. User: "But what about all the pseudo-elements?"
   Agent searches SKILL.md for pseudo-elements
   Finds reference to API-REFERENCE.md

5. Load Reference On-Demand
   Loads: API-REFERENCE.md (~500 tokens)
   Shows all pseudo-element options

6. Total context: ~4100 tokens (comprehensive help without waste!)
```

---

## Best Practices Applied

### 1. **Lean Main Files**
- `pikacss-dev/SKILL.md`: 192 lines (quick start)
- Reference for deep dives: 278-476 lines each

✅ **Result**: Fast initial load, depth on demand

### 2. **Focused Reference Files**
- Each file addresses one major concern
- No cross-referencing between references
- Clear "when to load" guidance

✅ **Result**: Agents load exactly what they need

### 3. **Clear Separation of Concerns**
- Architecture → arkitectural details only
- Implementation → workflows only
- API → API only
- Troubleshooting → issues only

✅ **Result**: No redundancy, easy to maintain

### 4. **Descriptive Frontmatter**
- Names clearly indicate target audience
- Descriptions help agent decide which skill
- Compatibility notes manage expectations

✅ **Result**: Better skill discovery and matching

### 5. **Internal Cross-References**
- Links use relative paths from skill root
- Paths match actual file locations
- References encourage progressive loading

✅ **Result**: Seamless navigation when needed

### 6. **No Mutual Dependencies**
- Skills are completely independent
- No skill references the other
- Can be used separately or together

✅ **Result**: True modularity and reusability

---

## File Structure Summary

```
.github/skills/
├── pikacss-dev/
│   ├── SKILL.md                              (192 lines)
│   │   └── Content: Quick start + decision trees
│   │       References: 3 files
│   │       Tokens: ~2000
│   │
│   └── references/
│       ├── ARCHITECTURE.md                   (278 lines)
│       │   └── When: Understanding structure
│       │
│       ├── IMPLEMENTATION-GUIDE.md           (413 lines)
│       │   └── When: Implementing features/fixes
│       │
│       └── PLUGIN-PATTERNS.md                (476 lines)
│           └── When: Creating plugins
│
└── pikacss-expert/
    ├── SKILL.md                              (594 lines)
    │   └── Content: API guide + best practices
    │       References: 3 files
    │       Tokens: ~3500
    │
    └── references/
        ├── API-REFERENCE.md                  (504 lines)
        │   └── When: Using PikaCSS API
        │
        ├── PLUGIN-GUIDE.md                   (447 lines)
        │   └── When: Using/creating plugins
        │
        └── TROUBLESHOOTING.md                (484 lines)
            └── When: Debugging issues

Total: 8 files, 3388 lines
Average token cost: 100-200 per skill metadata, 2000-3500 per full skill
```

---

## Context Efficiency

### Comparison: Old vs New Design

**Old Design** (everything in one SKILL.md):
```
Load entire ~3500 line file every time
Total context: ~4500+ tokens
Overhead: Lots of unrelated content for specific queries
```

**New Design** (Progressive Disclosure):
```
Startup:
  + Load 2 skill metadata: ~100 tokens ✨

When working on feature:
  + Load pikacss-dev/SKILL.md: ~2000 tokens
  + Load IMPLEMENTATION-GUIDE.md if needed: ~500 tokens
  Total: ~2600 tokens (vs 4500+) ✅

When using API:
  + Load pikacss-expert/SKILL.md: ~3500 tokens
  + Load API-REFERENCE.md if needed: ~500 tokens
  Total: ~4000 tokens (vs 4500+) ✅

Average efficiency gain: 15-30% tokens saved ✅
```

---

## Maintenance Guidelines

### Adding New Content

1. **Architecture changes?**
   → Update `pikacss-dev/references/ARCHITECTURE.md`

2. **New API feature?**
   → Update `pikacss-expert/references/API-REFERENCE.md`

3. **New workflow process?**
   → Update `pikacss-dev/references/IMPLEMENTATION-GUIDE.md`

4. **Plugin development?**
   → Check if update needed in:
      - `pikacss-dev/references/PLUGIN-PATTERNS.md` (internals)
      - `pikacss-expert/references/PLUGIN-GUIDE.md` (usage)

5. **New troubleshooting issue?**
   → Add to `pikacss-expert/references/TROUBLESHOOTING.md`

### Keeping Skills Separate

- Never cross-reference between `pikacss-dev` and `pikacss-expert`
- Never duplicate content across skills
- Never add user-facing content to dev skill
- Never add implementation details to expert skill

---

## Validation Checklist

✅ **Independence**
- [ ] Skills have no mutual references
- [ ] Each skill can be used independently
- [ ] No duplication of content

✅ **Separation of Concerns**
- [ ] Dev skill focuses on maintenance/development
- [ ] Expert skill focuses on API/usage
- [ ] Each reference file has single purpose

✅ **Progressive Disclosure**
- [ ] Main SKILL.md files are reasonably sized
- [ ] References are one level deep only
- [ ] Clear guidance on when to load references

✅ **Naming & Organization**
- [ ] Directory names match skill names
- [ ] Files follow Agent Skills spec
- [ ] Frontmatter is valid YAML

✅ **Completeness**
- [ ] All necessary guidance documented
- [ ] No critical gaps
- [ ] Cross-references are accurate
