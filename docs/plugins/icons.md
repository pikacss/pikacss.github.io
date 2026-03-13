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

The advanced surface is larger than `scale` and `mode`:

- `prefix` accepts either one string or an array of prefixes when a codebase needs more than one naming convention during a migration.
- `cwd` controls where local Iconify packages are resolved from.
- `autoInstall` can install missing Iconify packages during a Node build, but it is still a build-environment convenience, not a guarantee that every editor or CI context can resolve packages the same way.
- `cdn` can be either a base URL or a URL template containing `{collection}` for remote collection JSON.
- `processor` receives the generated style item plus metadata about the resolved icon source, which makes it the right place for last-mile CSS adjustments.
- `extraProperties` and `unit` let the plugin enforce display and sizing defaults without wrapping every icon in another shortcut.

Environment boundaries matter here. The plugin only attempts local Iconify package resolution in a normal Node build context. In VS Code and ESLint environments it skips that local-package path, so custom collections and CDN fallback become the portable ways to keep icon resolution predictable across tooling.

<<< @/.examples/plugins/icons-custom-collections.ts

You can also point a custom collection at repository-owned SVG assets and keep the same `i-collection:name` syntax across first-party and third-party icons.

<<< @/.examples/plugins/icons-directory-collection.ts

## For plugin authors using Icons as a reference

Read this page as a reference implementation when your plugin needs async build-time expansion from static source strings.

- The plugin is a good model for build-time resolution work that still preserves static authoring.
- It is a better reference for async asset or collection handling than for simple additive config.
- Pair this page with [Create A Plugin](/plugin-system/create-plugin) and [Hook Execution](/plugin-system/hook-execution) so the hook choice stays clear.

## A practical rule

Treat icon naming as part of design-system vocabulary, not as incidental syntax. The plugin works best when icon names are stable, searchable, and reviewable.

## Next

- [Reset](/plugins/reset)
- [Typography](/plugins/typography)
- [Create A Plugin](/plugin-system/create-plugin)
- [Configuration](/guide/configuration)
