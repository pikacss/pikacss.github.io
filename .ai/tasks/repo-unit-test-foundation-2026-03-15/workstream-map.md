# Workstream Map

## Parent Objective

Establish and roll out a repo-wide unit test baseline for hand-written `packages/*/src` modules with co-located tests, generated-artifact exclusions, barrel exceptions, and non-happy-path coverage expectations.

## Split Reason

The remediation spans multiple packages with distinct validation boundaries and dependency fan-out. Splitting keeps upstream ordering explicit and allows plugin work to proceed independently after core stabilization.

## Workstreams

### ws-a-baseline-ledger

- status: `ready-for-merge`
- accepted_scope: inventory modules, classify exceptions, and produce the remediation ledger
- out_of_scope: writing tests or refactoring production code
- dependencies: none
- owning_next_stage: `/kage-implement`
- required_validation: artifact consistency only
- merge_preconditions: exception list and package backlog are explicit

### ws-b-core

- status: `ready-for-merge`
- accepted_scope: remediate `packages/core/src` to the approved test baseline
- out_of_scope: downstream consumer remediation beyond required validation
- dependencies: `ws-a-baseline-ledger`
- owning_next_stage: `/kage-implement`
- required_validation: `pnpm --filter @pikacss/core test`, `pnpm --filter @pikacss/core typecheck`, and `pnpm --filter @pikacss/core build` if downstream public outputs require it
- merge_preconditions: core in-scope modules are paired or explicitly excepted

### ws-c-core-chain-consumers

- status: `ready-for-merge`
- accepted_scope: remediate `packages/integration/src`, `packages/unplugin/src`, and `packages/nuxt/src` in dependency order
- out_of_scope: plugin package remediation
- dependencies: `ws-b-core`
- owning_next_stage: `/kage-implement`
- required_validation: package test/typecheck per changed package plus downstream checks required by impact routing
- merge_preconditions: integration, unplugin, and nuxt slices each satisfy pairing or approved exceptions

### ws-d-plugins

- status: `ready-for-merge`
- accepted_scope: remediate `packages/plugin-fonts/src`, `packages/plugin-icons/src`, `packages/plugin-reset/src`, and `packages/plugin-typography/src`
- out_of_scope: core-chain consumer remediation
- dependencies: `ws-b-core`
- owning_next_stage: `/kage-implement`
- required_validation: package test/typecheck per changed plugin and core compatibility validation when relevant
- merge_preconditions: each changed plugin package reaches baseline compliance or records approved exceptions

### ws-e-support-packages

- status: `ready-for-merge`
- accepted_scope: evaluate and remediate `packages/eslint-config/src` only if inventory confirms meaningful in-scope unit boundaries
- out_of_scope: forcing artificial tests where no meaningful unit boundary exists
- dependencies: `ws-a-baseline-ledger`
- owning_next_stage: `/kage-implement`
- required_validation: package-local validation if implementation occurs
- merge_preconditions: package is either remediated or formally excepted with rationale

## Parallelism

- `ws-a-baseline-ledger` should start first.
- `ws-b-core` starts after baseline classification is explicit.
- `ws-c-core-chain-consumers` starts after `ws-b-core` stabilizes.
- `ws-d-plugins` can run in parallel with `ws-c-core-chain-consumers` after `ws-b-core` completes.
- `ws-e-support-packages` can run after `ws-a-baseline-ledger` if the inventory confirms real scope.

## Next Recommended Workstream

- none
- all scoped workstreams are now `ready-for-merge`
