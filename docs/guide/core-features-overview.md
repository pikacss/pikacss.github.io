---
description: See which capabilities are part of the PikaCSS engine itself and how each core feature fits into the adoption path.
---

# Core Features Overview

PikaCSS ships with a set of engine capabilities that are available without installing extra packages. They are configured through top-level engine config keys because they shape the default styling model itself.

Older implementation details may refer to them as built-in plugins, but the user-facing distinction is simpler: these are core features, not installable ecosystem modules.

## What makes something a core feature

A capability is a core feature when it changes how the engine interprets style input, emits CSS, or exposes autocomplete without asking you to install another package.

That is why these features live directly in engine config instead of the external `plugins` array.

That core surface also includes output defaults such as layer routing. Teams can set shared layer policy in config and override one definition at a time with `__layer` when a style must land somewhere other than the default utilities layer.

## The core feature set

| Core feature | Use it for | What it changes |
| --- | --- | --- |
| important | global and per-definition `!important` behavior | declaration priority in generated CSS |
| variables | CSS custom properties, token scoping, autocomplete | available tokens and property value suggestions |
| keyframes | animation registration and autocomplete | reusable animation names and emitted `@keyframes` |
| selectors | pseudo states, media aliases, custom selector expansion | how selector-like input is expanded into CSS |
| shortcuts | reusable style recipes and dynamic shortcut patterns | how repeated static style patterns are authored and reused |

<<< @/.examples/guide/core-features-config.ts

## Chapter map

Most teams should start with [Selectors](/guide/core-features/selectors) and [Variables](/guide/core-features/variables), because those two features shape how the team expresses breakpoints, states, and design tokens. Add [Shortcuts](/guide/core-features/shortcuts) once repeated style patterns become obvious across components. Introduce [Keyframes](/guide/core-features/keyframes) and [Important](/guide/core-features/important) only when the team has a concrete need for animations or priority overrides.

- [Selectors](/guide/core-features/selectors) covers reusable state, context, and media aliases. **Start here.**
- [Variables](/guide/core-features/variables) covers tokens, scoping, and runtime-safe value changes. **Read second.**
- [Shortcuts](/guide/core-features/shortcuts) covers named static recipes and dynamic shortcut patterns.
- [Keyframes](/guide/core-features/keyframes) covers animation registration, autocomplete, and output.
- [Important](/guide/core-features/important) covers global defaults and per-definition overrides.

## What core features are not

Core features are not installable packages.

Core features are not configured inside the external `plugins` array.

Core features are not a license to rebuild runtime styling inside `pika()`.

If you need icons, reset, typography, or fonts, you are looking for external plugins. If you need selectors, shortcuts, variables, keyframes, or `important`, you are configuring the engine itself.

## Why this distinction matters

New adopters often assume every extension point belongs in `plugins`. That assumption works for ecosystem modules, but it fails for engine behavior.

If the config key is `variables`, `selectors`, `shortcuts`, `keyframes`, or `important`, keep it at the top level. If it is an installable module such as `@pikacss/plugin-icons`, put it in `plugins`.

## How teams usually adopt them

Most teams start with `selectors` and `variables`, because those shape breakpoints, states, and theme tokens.

`shortcuts` usually follow once repeated patterns become obvious.

`keyframes` and `important` tend to be introduced more deliberately, because they solve narrower problems and benefit from stronger team rules.

## Where to go deeper

- selectors in component architecture are covered in [Responsive And Selectors](/patterns/responsive-and-selectors)
- variables in theme workflows are covered in [Theming And Variables](/patterns/theming-and-variables)
- runtime-friendly value changes are covered in [Dynamic Values With CSS Variables](/patterns/dynamic-values-with-css-variables)
- engine-level setup is covered in [Configuration](/guide/configuration)
- extension APIs are covered in [Plugin System Overview](/plugin-system/overview)

## Next

- [Configuration](/guide/configuration)
- [Important](/guide/core-features/important)
- [Variables](/guide/core-features/variables)
- [Selectors](/guide/core-features/selectors)
