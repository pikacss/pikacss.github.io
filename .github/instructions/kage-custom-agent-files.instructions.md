---
name: kage-custom-agent-files
description: Structure, frontmatter, and handoff rules for VS Code Copilot custom agents in .github/agents.
applyTo: '.github/agents/**/*.agent.md'
---

# Custom Agent File Rules

## When To Use A Custom Agent

Create a `.agent.md` file when the workflow needs:

- a persistent persona or role
- a restricted tool list
- model preferences
- subagent control
- native handoff buttons between stages

If the workflow only needs a reusable slash command, prefer a `.prompt.md` file instead.

## Required Frontmatter

Every custom agent should include frontmatter with at least:

- `name`
- `description`

Add these fields intentionally when the workflow needs them:

- `argument-hint`
- `tools`
- `agents`
- `model`
- `user-invocable`
- `disable-model-invocation`
- `handoffs`

## Tooling Rules

- Apply the principle of least privilege.
- Read-only or planning agents should avoid edit-capable tools unless absolutely necessary.
- If `agents` is specified, ensure the agent tool is available through the chosen configuration.
- Only pin a model when the task quality or cost profile truly depends on it.

## Body Structure

Agent files should normally include:

- a short overview of the role
- the workflow expectations for that agent
- the files or rules it should consult first
- the output shape it should produce
- any escalation or handoff behavior that the frontmatter alone does not capture

## Handoff Rules

- Use frontmatter `handoffs` for real VS Code native handoff buttons.
- Keep handoff labels short and action-oriented.
- Use handoff prompts that carry the next stage forward without restating the whole workflow.
- Use `send: true` only when automatic submission is safe.

## Avoid

- Do not recreate prompt files as agents unless the workflow benefits from persistent tools or handoffs.
- Do not give broad tool access to review-only or planning-only agents.
- Do not hide unclear workflow assumptions in the body; make them explicit.
