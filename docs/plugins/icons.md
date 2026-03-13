---
description: Learn how the icons plugin turns Iconify collections and custom SVG sources into static PikaCSS style input.
---

# Icons

`@pikacss/plugin-icons` pulls icons into the same static authoring model as the rest of PikaCSS. Instead of introducing a separate runtime component layer, the plugin resolves icon names during the build and emits CSS-driven icon styles that still fit the engine's atomic workflow.

## When to use it

Use the icons plugin when you want:

- icon usage to stay in static source strings
- large Iconify collections without runtime icon components
- custom SVG sources that still follow the same naming model
- CSS output that can inherit color, sizing, and theming from the rest of the system

## Install

::: code-group
<<< @/.examples/plugins/icons-install.sh [pnpm]
<<< @/.examples/plugins/icons-install-npm.sh [npm]
<<< @/.examples/plugins/icons-install-yarn.sh [yarn]
:::

## Minimal setup

<<< @/.examples/plugins/icons-basic-config.ts

## Usage

<<< @/.examples/plugins/icons-usage.pikainput.ts

<<< @/.examples/plugins/icons-usage-vue.pikainput.vue

The important part is not only that icons work. The icon name still needs to appear inside static PikaCSS input, even when you later bind the returned class names in a template. That keeps icon usage reviewable static source and makes search, linting, and naming conventions much easier to enforce across a large codebase.

## Naming model

By default, icon names use an `i-` prefix followed by `collection:name`, such as `i-mdi:home`. That shape matters because it keeps icons aligned with the rest of PikaCSS input: plain source strings that can be scanned, transformed, and reasoned about at build time.

Once icon usage is just source input, naming drift becomes a maintenance problem. Decide the prefix and collection rules early so teams do not invent competing conventions.

## Do and do not

| Do | Do not |
| --- | --- |
| Install or preload the collections your project actually uses. | Assume every icon will resolve remotely in every CI environment. |
| Keep one naming convention for prefixes and collection names. | Mix runtime components, ad hoc prefixes, and raw collection names without a plan. |
| Seed autocomplete for the icon names people reach for every day. | Expect everyone to remember dozens of collection-specific names accurately. |

## Advanced customization

<<< @/.examples/plugins/icons-advanced-config.ts

<<< @/.examples/plugins/icons-custom-collections.ts

You can also point a custom collection at repository-owned SVG assets and keep the same `i-collection:name` syntax across first-party and third-party icons.

<<< @/.examples/plugins/icons-directory-collection.ts

## A practical rule

Treat icon naming as part of design-system vocabulary, not as incidental syntax. The plugin works best when icon names are stable, searchable, and reviewable.

## Next

- [Reset](/plugins/reset)
- [Typography](/plugins/typography)
- [Create A Plugin](/plugin-system/create-plugin)
- [Configuration](/guide/configuration)
