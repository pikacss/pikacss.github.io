---
name: kage-custom-instruction-files
description: Structure and scoping rules for workspace .instructions.md files used by VS Code Copilot.
applyTo: '.github/instructions/**/*.instructions.md'
---

# Custom Instruction File Rules

## Required Frontmatter

Every `.instructions.md` file in this repository should include:

- `name`
- `description`

Add `applyTo` only when automatic file-based application is desirable. If automatic application would be too broad or noisy, omit `applyTo` and rely on explicit prompt references or semantic matching.

## Instruction Design Rules

- Keep each instruction file narrow in responsibility.
- Explain the reason behind non-obvious rules when that context improves decisions.
- Prefer a few strong instructions over long unfocused prose.
- Make it obvious whether the file is global, stage-specific, or file-type-specific.
- If an instruction is the authoritative source for a concern, say so explicitly.

## Body Structure

Instruction files should normally include:

- a title
- `Scope`
- the core rule sections for that concern
- optional reporting, artifact, or handoff sections when relevant
- optional example blocks when the format is easy to misunderstand

## applyTo Rules

- Use `applyTo` only with patterns that are precise and intentional.
- Prefer folder-based patterns for docs, demo, or agent customization files.
- Avoid catch-all patterns when the file is meant to act as referenced guidance rather than always-on automation.

## Avoid

- Do not copy the entire contents of `AGENTS.md` into an instruction file.
- Do not combine unrelated concerns just because they target the same folder.
- Do not add `applyTo` to meta-guidance files unless you actually want automatic application.
