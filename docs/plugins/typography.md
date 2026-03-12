---
description: Learn how the typography plugin gives long-form content a consistent prose baseline without turning app UI into tag-by-tag overrides.
---

# Typography

`@pikacss/plugin-typography` packages a content-oriented prose system for PikaCSS. It is meant for article bodies, markdown output, docs content, and other reading surfaces where teams want sensible defaults and token-driven customization instead of styling every heading and paragraph by hand.

## When to use it

Use the typography plugin for:

- docs pages
- blog posts
- CMS-rendered content
- knowledge-base articles
- any container whose main job is to present readable prose

## Install

::: code-group
<<< @/.examples/plugins/typography-install.sh [pnpm]
<<< @/.examples/plugins/typography-install-npm.sh [npm]
<<< @/.examples/plugins/typography-install-yarn.sh [yarn]
:::

## Minimal setup

<<< @/.examples/plugins/typography-basic-config.ts

## Usage

<<< @/.examples/plugins/typography-usage-prose.ts

The plugin works best when prose is treated as a content surface with its own defaults, not as a shortcut for avoiding deliberate component styling.

## Customize variables, not every element by hand

<<< @/.examples/plugins/typography-custom-variables.ts

The variable layer is where teams should express tone and readability decisions. That keeps typography consistent even when content comes from markdown, CMS output, or multiple frontend frameworks.

## Where teams usually misuse it

Typography defaults are a strong fit for reading surfaces. They are a weak fit for dashboards, dense tools, and bespoke application components.

If a page is mostly composed of cards, controls, data tables, and layout primitives, stay in normal component styling. The typography plugin should support prose, not replace interface design.

## Next

- [Theming And Variables](/patterns/theming-and-variables)
- [Plugin System Overview](/plugin-system/overview)
- [Configuration](/guide/configuration)
- [FAQ](/community/faq)
