---
name: kage-help
description: Explain the repository's kage workflow framework and recommend the right slash command or agent.
argument-hint: What kind of task or workflow help do you need?
agent: agent
---

Related instructions: [global-engineering](../instructions/kage-global-engineering.instructions.md), [copilot workflow guide](../copilot-workflow-guide.md)

# Help Prompt

## When To Use

Use this prompt when you need help choosing the right kage workflow entry point, slash command, or custom agent for a task in this repository.

## Required Inputs

- the task the user wants to perform
- any uncertainty about scope, stage, or workflow routing

## Required Outputs

- a short explanation of the workflow framework
- the most relevant slash command or agent to start with
- the likely next handoff after that stage
- any alternate entry point when the task could reasonably start elsewhere

## Required Checks

- prefer the custom workflow entry points over generic advice
- distinguish stage-oriented entries from task-oriented entries
- recommend `/kage-clarify` when the user's request is ambiguous
- recommend `/kage-doctor` when the repository needs Kage adoption or workflow-health auditing

## Handoff Target

Hand off to the recommended slash command or agent once the user knows where to start.

## Example Output Format

```md
## Workflow Help

- recommended_entry: `/kage-package-maintenance`
- why: the task is package hygiene work and should stay aligned with existing monorepo maintenance scripts
- likely_next_handoff: `kage-review`
- alternate_entry:
	- `/kage-implement` if the maintenance change is already fully scoped and approved
```
