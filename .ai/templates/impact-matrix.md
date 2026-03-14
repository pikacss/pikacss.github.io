# Impact Matrix

## Artifact Metadata

- Task ID:
- Status:
- Owner:
- Last Updated:

## Changed Area

## Directly Impacted Packages

## Required Downstream Checks

## Docs Impact

## Demo Impact

## Notes

## Example

```md
## Changed Area

- `packages/core`

## Directly Impacted Packages

- `@pikacss/core`
- `@pikacss/integration`

## Required Downstream Checks

- `pnpm --filter @pikacss/core test`
- `pnpm --filter @pikacss/core typecheck`
- `pnpm --filter @pikacss/core build`
- `pnpm --filter @pikacss/integration test`

## Docs Impact

- update docs only if the change becomes public behavior

## Demo Impact

- validate only if visible output changes

## Notes

- add unplugin validation when the changed surface reaches generated integration output
```
