---
description: Learn how plugin hooks are ordered, when payloads are passed forward, and how to choose the least intrusive hook that still solves the job.
---

# Hook Execution

If you only keep one plugin-authoring rule in mind, keep this one: choose the latest hook that still gives you the control you need. Later hooks tend to preserve more engine guarantees, interfere less with other plugins, and produce behavior that is easier to reason about in a large plugin chain.

## Hook decision table

| Need | Hook |
| --- | --- |
| modify user config before defaults are applied | `configureRawConfig` |
| react after config has been resolved | `configureResolvedConfig` |
| register engine behavior through public APIs | `configureEngine` |
| rewrite selector chains directly | `transformSelectors` |
| rewrite extracted style items | `transformStyleItems` |
| rewrite nested style definitions | `transformStyleDefinitions` |
| observe engine events only | sync notification hooks |

## Payload chaining

Async hooks can return a new payload, and that returned value becomes the input for the next plugin in order.

<<< @/.examples/plugin-system/overview-async-hook.ts

That behavior is useful, but it also means transform-heavy plugins should be conservative. Later plugins will see whatever shape you returned, not the original input.

## Error isolation

Hook failures are caught and logged so one broken plugin does not automatically collapse the whole pipeline. That makes the engine more resilient, but it also means a plugin can fail quietly if nobody checks the logs.

When behavior disappears unexpectedly, inspect logs before assuming the engine ignored your plugin.

## Notification hooks are for observation

Notification hooks exist for side effects, instrumentation, and reactions to engine updates. They are the right place for bookkeeping, diagnostics, and integration glue that should not mutate the main payload.

<<< @/.examples/plugin-system/hook-notifications.ts

## Sync vs async hooks

Transform hooks are async because they modify a shared payload and the engine must wait for each plugin to finish before the next one can start. The returned value is what the next plugin receives as input.

Notification hooks are sync because they only observe. There is no payload to pass forward. Returning a value from a notification hook has no effect on engine state.

Practical consequences:

- If you need to change what the engine emits, use a transform hook and return the modified payload.
- If you only need to log, measure, or react to an event, use a sync notification hook.
- Do not try to change engine behavior from inside a notification hook — the return value is silently ignored.

## Payload chaining and downstream safety

When a transform hook returns a modified payload, later plugins in the chain receive that modified shape, not the original. If one plugin removes selectors, renames style items, or filters definitions, every plugin that runs after it works with the reduced set.

<<< @/.examples/plugin-system/payload-chaining-example.ts

::: warning Always return complete payloads
Filtering a payload without documenting the contract in the plugin name or README can silently break downstream plugins. If your transform removes entries, document what was removed and why. Downstream plugins that need those entries should use `order: 'pre'` to run before the filtering plugin.
:::

## A practical rule for plugin authors

Bias toward `configureEngine`, then move earlier or deeper only when the public engine APIs stop being sufficient. That habit alone keeps many plugins smaller and more composable.

## Debugging when your plugin silently fails

If a plugin is loaded but appears to do nothing, work through these steps in order:

1. **Confirm the plugin is in the `plugins` array.** A plugin installed in `package.json` but not added to `plugins` in `pika.config.ts` will never run. Print the full config to verify.
2. **Add a `console.log` at the top of each hook.** If the log never prints, the hook is not being called. Check ordering — a `post` plugin runs after all default plugins, which may already be too late for some transforms.
3. **Check the build output for error messages.** Hook failures are caught and logged. The error message will name the plugin and the hook that failed.
4. **Verify that the hook you are using receives the input you expect.** Log the hook's first argument at the start of the function. If the input is empty or already filtered, a plugin earlier in the chain may have removed the entries your plugin needed.
5. **Use `configureEngine` to confirm the engine received the plugin.** The `configureEngine` hook fires once per engine initialization. If this hook logs but your transform hooks do not, the issue is in the transform hooks themselves.

See [Common Problems](/troubleshooting/common-problems) for more plugin-specific scenarios.

## Next

- [Create A Plugin](/plugin-system/create-plugin)
- [Core Features Overview](/guide/core-features-overview)
- [FAQ](/community/faq)
