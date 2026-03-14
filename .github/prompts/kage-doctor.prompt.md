---
name: kage-doctor
description: Audit an existing repository for Kage workflow foundations and write durable onboarding call-to-action artifacts.
argument-hint: What repository, adoption goal, or workflow-health check should be audited?
agent: kage-doctor
---

Related instructions: [global-engineering](../instructions/kage-global-engineering.instructions.md), [planning](../instructions/kage-planning.instructions.md), [testing](../instructions/kage-testing.instructions.md), [impact-routing](../instructions/kage-impact-routing.instructions.md)

# Kage Doctor Prompt

## When To Use

Use this prompt when an existing repository needs Kage workflow adoption, a workflow-health audit, or a gap analysis before staged remediation begins.

## Required Inputs

- the repository or adoption target
- the adoption goal
- any known workflow gaps or constraints

## Required Outputs

- a doctor report artifact
- recommended call-to-action items
- a workstream map when the onboarding scope is too large for one fix sequence
- the recommended next Kage stage

## Required Checks

- audit workflow foundations before proposing remediation
- separate blocking foundations from optional enhancements
- use split workstreams when the onboarding backlog is too large for one coherent plan

## Handoff Target

Hand off to `/kage-clarify`, `/kage-spec`, `/kage-plan`, or `/kage-package-maintenance` depending on the doctor findings.

## Example Output Format

```md
## Doctor Summary

- doctor_report: `.ai/tasks/kage-bootstrap/doctor-report.md`
- workstream_map: `.ai/tasks/kage-bootstrap/workstream-map.md`
- blocking_foundations:
	- missing workflow templates under `.ai/templates/`
	- no documented dependency routing
- recommended_next_stage: `/kage-plan`
```
