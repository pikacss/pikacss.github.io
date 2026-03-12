---
description: Learn how the fonts plugin manages hosted fonts, local font faces, and semantic font tokens in one PikaCSS workflow.
---

# Fonts

`@pikacss/plugin-fonts` lets you treat font loading and font naming as one system. Instead of scattering `@import` rules, `@font-face` blocks, and semantic aliases across multiple files, you can describe them once in engine config and let the plugin generate the CSS imports, variables, and shortcuts.

## When to use it

Use the fonts plugin when you want:

- hosted font imports to live in config instead of handwritten URLs
- semantic names like `sans`, `mono`, or `display` instead of vendor-specific family strings everywhere
- local `@font-face` rules and remote providers to share one vocabulary
- provider-specific query options without building URLs by hand

## Install

::: code-group
<<< @/.examples/plugins/fonts-install.sh [pnpm]
<<< @/.examples/plugins/fonts-install-npm.sh [npm]
<<< @/.examples/plugins/fonts-install-yarn.sh [yarn]
:::

## Minimal setup

<<< @/.examples/plugins/fonts-basic-config.ts

Each configured token becomes a reusable font family stack plus a matching `font-{token}` shortcut. That makes the plugin useful even when a team later changes providers, because application code can keep the semantic token names.

## Provider-specific options

Built-in providers cover the common hosted workflows, but provider URLs still need small differences such as `text` subsets or display settings. Put that detail in `providerOptions` so the rest of the project can stay focused on font roles.

<<< @/.examples/plugins/fonts-provider-options.ts

## Custom providers

When a provider is not built in, define a provider once and keep the same token model for the rest of the project. That preserves the value of semantic font names even when the import mechanism is custom.

<<< @/.examples/plugins/fonts-custom-provider.ts

## Manual `@font-face` and local files

Hosted imports are optional. If a project already owns the font files, the plugin can still register local faces and expose them through the same family tokens.

<<< @/.examples/plugins/fonts-font-face.ts

## A practical rule

Name font tokens by role, not by vendor. `sans`, `mono`, and `display` survive redesigns much better than tokens that expose the first provider choice.

## Next

- [Typography](/plugins/typography)
- [Configuration](/guide/configuration)
- [Theming And Variables](/patterns/theming-and-variables)
- [Create A Plugin](/plugin-system/create-plugin)
