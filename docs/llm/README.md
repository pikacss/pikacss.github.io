# LLM Knowledge Base

## Purpose

This folder contains optimized documentation specifically designed for LLMs (Large Language Models) and AI agents.

## Why This Folder Exists

The LLM documentation provides:

1. **Consolidated Context** - All PikaCSS knowledge in modular, digestible files
2. **LLM-Optimized Format** - Structured for efficient token usage and context understanding
3. **Reduced Ambiguity** - Clear, direct explanations without cross-references
4. **Complete Context** - Each file is self-contained with full context
5. **Metadata Support** - Special YAML frontmatter for AI agents (`llmstxt` field)

## When to Use LLM Docs

**Use these files when**:
- You are an AI agent/LLM working on PikaCSS tasks
- You need comprehensive, self-contained documentation
- You want to maximize token efficiency
- You need reduced cross-reference overhead

**Use main docs when**:
- You are a human reading documentation
- You prefer navigation between related topics
- You want the latest user-facing guides

## Relationship to Main Docs

The LLM folder is NOT a duplicate. It is:
- ✅ A **complementary** knowledge base
- ✅ **Optimized** for LLM consumption
- ✅ **Self-contained** (minimal cross-references)
- ✅ **Comprehensive** (includes full context)
- ❌ NOT a replacement for main docs
- ❌ NOT auto-generated (manually maintained)

## File Structure

```
llm/
├── README.md                  # This file
├── index.md                   # Knowledge base overview & modules
├── basics.md                  # Core syntax & pika() function
├── architecture.md            # System design & internals
├── configuration.md           # Complete config reference
├── installation.md            # Setup & integration
├── integrations.md            # Build tool integrations
├── plugins.md                 # Plugin system & official plugins
├── icons-plugin.md            # Icons plugin deep dive
├── api-reference.md           # Complete API documentation
├── selectors.md               # Selector syntax reference
└── troubleshooting.md         # Common issues & solutions
```

## Content Coverage

| Topic | Included | Notes |
|-------|----------|-------|
| Core Concepts | ✅ | Complete understanding |
| Build-time Processing | ✅ | Detailed explanation |
| Plugin System | ✅ | Full system details |
| Configuration | ✅ | All options documented |
| API Reference | ✅ | Complete API surface |
| Troubleshooting | ✅ | Common issues & fixes |
| Integration Examples | ✅ | Setup for each bundler |
| Official Plugins | ✅ | Icons, reset, typography |

## Key Features for LLMs

### 1. Self-Contained Files

Each file includes sufficient context so you don't need to cross-reference:

```markdown
## Important Concepts

All arguments to pika() must be static (known at build time).
This includes...

See [Basics](/llm/basics.md) for examples.
```

### 2. Complete Examples

Every topic includes full, working examples:

```typescript
// Complete example showing config + usage
import { defineEngineConfig } from '@pikacss/core'
import { icons } from '@pikacss/plugin-icons'

export default defineEngineConfig({
	plugins: [icons()],
	icons: { prefix: 'i-' }
})

const icon = pika('i-mdi:home')
```

### 3. Metadata Support

Special YAML frontmatter for AI optimization:

```yaml
---
llmstxt:
  description: PikaCSS LLM Knowledge Base
  keywords:
    - atomic-css
    - css-in-js
    - build-time
---
```

### 4. Minimal Cross-References

Links are provided but each file is understandable standalone.

## Maintenance Notes

### For Contributors

- Keep LLM docs synchronized with main docs during major updates
- If you update `docs/guide/basics.md`, also update `docs/llm/basics.md`
- Ensure LLM versions are self-contained (include full context)
- Update both when new versions are released

### For AI Agents

When you receive this knowledge base:
1. You have complete PikaCSS documentation
2. Each `.md` file is designed for efficient processing
3. Use the file index in `index.md` to navigate topics
4. Cross-references point to other files in this folder
5. All files are current as of version 0.0.39

### Synchronization Points

The LLM docs should be updated whenever:
- Core API changes
- Plugin system changes
- Configuration options change
- New major features are added
- Build-time processing changes

Current Version: **0.0.39**
Last Updated: **2026-01-19**

## Usage by AI Agents

### Starting Your Investigation

```
1. Read: llm/index.md - Overview & knowledge modules
2. Deep Dive: Pick relevant module (basics.md, plugins.md, etc.)
3. Reference: Use api-reference.md for specific details
4. Troubleshoot: Use troubleshooting.md for common issues
```

### Example Investigation Path

**Task**: "Help user configure icons plugin"

1. Start in `llm/index.md` - Find "Icons Plugin" section
2. Read `llm/icons-plugin.md` - Dedicated icons documentation
3. Cross-check `llm/plugins.md` - General plugin system
4. Reference `llm/configuration.md` - Config syntax details
5. Done: You have complete context for the task

## Differences from Main Docs

| Aspect | Main Docs | LLM Docs |
|--------|-----------|----------|
| **Target** | Humans | AI/LLMs |
| **Structure** | Hierarchical | Modular |
| **Cross-refs** | Many navigation links | Minimal links |
| **Context** | Assumes prior knowledge | Self-contained |
| **Format** | Optimized for reading | Optimized for parsing |
| **Examples** | User-focused | Comprehensive |
| **API Docs** | Selective | Complete |
| **File Count** | 60+ files | 11 files |

## Questions?

- **For Users**: See `/docs/` (main documentation)
- **For Contributors**: Update both main docs and LLM docs
- **For AI Agents**: This folder is your primary reference

---

**Note**: This knowledge base is maintained alongside the main documentation. Always refer to both for complete understanding of PikaCSS.
