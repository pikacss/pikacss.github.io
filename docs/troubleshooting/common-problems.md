---
description: Diagnose the most common PikaCSS failures by checking scan coverage, generated files, static input, and plugin wiring before changing config blindly.
---

# Common Problems

When PikaCSS output looks wrong, the cause is usually one of a few repeat offenders rather than a deep engine bug. This page focuses on the checks that eliminate those common mistakes quickly.

## `pika()` did not generate what I expected

Check these first:

1. Is the source file included in your scan patterns?
2. Is the generated CSS file actually imported into the app?
3. Is the `pika()` input static enough for the build to understand?
4. Did you inspect the generated CSS or generated typings instead of guessing?

Those four checks rule out most first-run failures. If they are wrong, changing more config usually just makes the real problem harder to see.

## I used runtime values inside `pika()`

This is the most common failure mode.

<<< @/.examples/community/faq-static-bad.pikainput.ts

PikaCSS needs build-time-readable input. When the styling choice is truly runtime data, move the runtime part into CSS variables and keep the style shape static.

<<< @/.examples/community/faq-static-ok.pikainput.ts

See [Dynamic Values With CSS Variables](/patterns/dynamic-values-with-css-variables) for the workflow that preserves static extraction while still allowing per-instance values.

## I edited generated files and my changes disappeared

Generated files are output artifacts, not source files. Edit the source `pika()` call, engine config, plugin setup, or integration wiring instead. If generated files keep changing in surprising ways, the source of truth is still upstream.

## I added a plugin but nothing changed

Check whether you configured a built-in core feature or registered an external plugin. Those are different extension surfaces. Also verify that the plugin is actually in `plugins`, not only installed in `package.json`.

If the plugin is in `plugins` and still does nothing, add a `console.log` at the top of each hook to confirm the hooks are firing. If no logs appear, the plugin may have an initialization error — check build output for caught exceptions.

## My plugin hook fires but the output is wrong

Check whether your hook is using `configureEngine` or a transform hook. If you call `engine.appendSelectors()` inside `configureEngine`, the registration is permanent and additive. If you use `transformSelectors`, you are rewriting the payload that flows between plugins — return the full replacement, not a mutation of the input.

If the output looks like the default and ignores your plugin, confirm your plugin's `order` setting. A `post` plugin runs last, but some engine state is already committed by the time `post` plugins run.

## My plugin works in isolation but breaks when combined with another plugin

This is a payload chaining problem. Transform hooks pass their return value to the next plugin. If Plugin A filters the payload and Plugin B expects the original shape, Plugin B silently skips its logic.

To diagnose: log the hook input at the start of each transform hook in both plugins. If Plugin B receives fewer entries than expected, Plugin A is filtering them.

To fix: either run Plugin B before Plugin A using `order: 'pre'`, or teach Plugin B to handle the reduced payload gracefully.

## My preflight styles are affecting pages where I did not intend them

Preflights apply globally to every page before component styles run. If a preflight contains component-level rules, those rules appear everywhere.

Move component-specific styles out of preflights and into `pika()` calls or shared shortcut recipes instead.

## My theme logic feels repetitive

That usually means values belong in variables and theme context belongs in selectors. If every component repeats the same raw color decisions, the project has not centralized its design tokens enough yet.

## The build works but team usage is drifting

Add the ESLint integration early, then move recurring conventions into config-level selectors, shortcuts, and variables. PikaCSS stays maintainable when the shared vocabulary lives in config instead of being rediscovered in every component.

## Next

- [Static Constraints](/getting-started/static-arguments)
- [Dynamic Values With CSS Variables](/patterns/dynamic-values-with-css-variables)
- [Generated Files](/guide/generated-files)
- [ESLint](/integrations/eslint)
