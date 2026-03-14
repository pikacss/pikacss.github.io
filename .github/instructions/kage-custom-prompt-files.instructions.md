---
name: kage-custom-prompt-files
description: Structure and metadata rules for workspace prompt files used as VS Code Copilot slash commands.
applyTo: '.github/prompts/**/*.prompt.md'
---

# Custom Prompt File Rules

## Required Frontmatter

Every `.prompt.md` file in this repository should include frontmatter with at least:

- `name`
- `description`
- `argument-hint`
- `agent`

Add `tools` only when the prompt must override the agent's normal tool list. Add `model` only when the task truly needs a pinned model.

## Prompt Body Structure

Prompt files should follow this structure unless there is a strong reason not to:

- a short `Related instructions:` line with Markdown links to relevant `.instructions.md` files
- a title that names the workflow
- `When To Use`
- `Required Inputs`
- `Required Outputs`
- `Required Checks`
- `Handoff Target`
- `Example Output Format`

## Authoring Rules

- Keep prompt files task-focused. They are workflow entry points, not rule warehouses.
- Prefer referencing shared rules instead of re-explaining them.
- Make outputs explicit enough that later stages can consume them without reinterpretation.
- Use argument hints that tell the user what they should supply when invoking the slash command.
- Choose `agent: kage-plan` for planning-heavy prompts, `agent: kage-clarify` for clarification-heavy prompts, and `agent: agent` for generic execution-oriented prompts unless a different custom agent is intentionally required.

## Avoid

- Do not omit frontmatter.
- Do not store broad repo conventions directly in prompt bodies.
- Do not add tool restrictions casually; prompt-level tools override agent defaults.
- Do not create a prompt when the workflow actually needs a persistent persona with native handoffs; use a custom agent instead.

## Example Checklist

- slash command name matches the file purpose
- argument hint is actionable
- linked instructions exist
- example output matches the required outputs section
