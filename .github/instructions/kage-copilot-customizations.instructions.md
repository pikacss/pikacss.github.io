---
name: kage-copilot-customizations
description: Decision rules and shared conventions for VS Code Copilot prompts, instructions, agents, and customization settings.
applyTo: '{.github/prompts/**/*.prompt.md,.github/instructions/**/*.instructions.md,.github/agents/**/*.agent.md,.github/copilot-instructions.md,.vscode/settings.json}'
---

# Copilot Customization Rules

## Scope

Apply these rules when creating or editing VS Code Copilot customization files in this repository.

## Pick The Right Customization Type

- Use `.instructions.md` for reusable rules that should influence many requests automatically or when referenced.
- Use `.prompt.md` for repeatable single-task workflows that the user invokes manually as slash commands.
- Use `.agent.md` for persistent personas that need scoped tools, model preferences, subagent control, or native handoff buttons.
- Use `AGENTS.md` only for repository-wide always-on guidance that should stay stable across all agent workflows.
- Use `.vscode/settings.json` only for workspace-level enablement and discovery settings, not for storing workflow logic.

## Shared File Conventions

- Keep all customization content in English.
- Keep file names descriptive and aligned with the slash command or agent name they provide.
- Prefer one clear responsibility per file.
- Reference existing instruction files with Markdown links instead of duplicating rules.
- Keep examples short, realistic, and directly aligned with the file's responsibility.

## Validation Checklist

Before considering a customization file complete, verify:

- the file is in the correct VS Code discovery location
- the YAML frontmatter uses supported fields for that file type
- linked instruction files actually exist
- auto-application behavior is intentional rather than accidental
- the file body explains the workflow without duplicating unrelated repo rules

## Troubleshooting Expectations

- If a customization is meant to auto-apply, ensure its `applyTo` or workspace location supports that behavior.
- If a prompt or agent is meant to discover shared rules, prefer linking the relevant `.instructions.md` files in the body.
- Use the Chat Customizations editor or chat diagnostics to confirm that VS Code loads the file as the expected customization type.
