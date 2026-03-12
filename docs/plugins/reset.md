---
description: Learn when the reset plugin is useful, how to install it, and how to keep reset rules separate from project design decisions.
---

# Reset

`@pikacss/plugin-reset` gives PikaCSS projects a build-time place to define global reset behavior. The plugin keeps baseline normalization in the same config surface as the rest of the engine, so teams can review reset decisions alongside selectors, variables, and other plugins.

## When to use it

Use the reset plugin when a project needs one shared answer to browser defaults before component styling begins. That usually matters most for design systems, product suites, marketing sites, and docs platforms where many pages should inherit the same baseline.

Use less reset code when the product already has an intentional baseline. A reset should remove default inconsistency, not quietly become a second theme layer.

## Install

::: code-group
<<< @/.examples/plugins/reset-install.sh [pnpm]
<<< @/.examples/plugins/reset-install-npm.sh [npm]
<<< @/.examples/plugins/reset-install-yarn.sh [yarn]
:::

## Minimal setup

<<< @/.examples/plugins/reset-basic-usage.ts

That is the right starting point for most teams. Pick a preset, register the plugin, and only add more rules when repeated browser defaults are slowing real work down.

## Available presets

<<< @/.examples/plugins/reset-all-presets.ts

The preset names reflect different reset philosophies. `modern-normalize` is usually the safest default because it normalizes without aggressively restyling every element.

## When a reset helps and when it hurts

Reset code belongs at the boundary between browser defaults and your own system defaults. It helps when teams keep rediscovering the same margin, list, or form-control differences. It hurts when unrelated brand decisions get pushed into the global baseline.

::: warning Keep reset output boring
If a reset starts deciding typography hierarchy, component spacing, or application layout rules, it is doing the wrong job. Move those decisions into variables, shortcuts, or component styles instead.
:::

## Custom preset example

<<< @/.examples/plugins/reset-custom-preset.ts

The usual custom pattern is composition: keep an official preset, then add a tiny project-specific preflight for the few extra rules your product genuinely needs.

## A practical rule

Keep the reset layer small enough that you can explain every rule in a code review. If a rule only exists to make one component look right, it probably does not belong in the reset layer.

## Next

- [Typography](/plugins/typography)
- [Configuration](/guide/configuration)
- [Create A Plugin](/plugin-system/create-plugin)
- [Common Problems](/troubleshooting/common-problems)
