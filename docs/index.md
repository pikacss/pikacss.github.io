---
layout: home
description: Evaluate whether PikaCSS fits a static styling workflow, then move from constraints to a first successful build-time setup.

hero:
  name: PikaCSS
  text: Build-time atomic CSS-in-JS for teams that want static output without giving up CSS structure
  tagline: Author style objects in TypeScript, let the build extract class names and CSS, and keep overlapping declarations predictable where normal atomic systems usually flatten local intent.
  image:
    src: /logo-white.svg
    alt: PikaCSS logo
  actions:
    - theme: brand
      text: Evaluate Fit
      link: /getting-started/what-is-pikacss
    - theme: alt
      text: Start Setup
      link: /getting-started/installation
    - theme: alt
      text: Inspect Core Features
      link: /guide/core-features-overview

features:
  - icon: ⚙️
    title: CSS-in-JS authoring, static delivery
    details: Write style objects in JavaScript or TypeScript, then ship generated atomic CSS instead of a client-side styling runtime.
  - icon: 🧠
    title: Static by contract
    details: PikaCSS only accepts source the build can read ahead of time. That boundary enables generated files, autocomplete, and zero runtime styling work.
  - icon: 🧩
    title: CSS concepts stay intact
    details: Use variables, selectors, shortcuts, keyframes, preflights, and layers without switching from CSS rules to a utility naming game.
  - icon: 🔌
    title: One engine, multiple integrations
    details: Start in Vite, Nuxt, Rollup, Webpack, Rspack, Rolldown, or esbuild without changing how the team writes styles.
  - icon: 🛠️
    title: Extensible through public hooks
    details: Extend selectors, shortcuts, variables, keyframes, preflights, and autocomplete through one engine plugin model.
  - icon: 📚
    title: Reader path before feature sprawl
    details: The docs are organized to help teams evaluate fit, get one setup working, then scale usage with the right mental model.

---

## Start with the engine boundary, not the API surface

PikaCSS is strongest when your team wants CSS-in-JS ergonomics, but is willing to keep style input inside a static, build-time boundary. The engine is not trying to make arbitrary JavaScript styling logic fast later. It is trying to turn known source input into generated CSS before the app runs.

That matters for more than bundle size. PikaCSS still deduplicates atomic declarations, but it also tracks when overlap would make reuse unsafe. Later local intent can stay local instead of being overridden by whichever shared utility happened to land later in the stylesheet.

If your project can live inside that tradeoff, you get static CSS output, generated files, and strong autocomplete from the same model. If the project depends on computing style objects from live runtime data, reject PikaCSS early and move on.

::: warning What to read first
Do not skip [Static Constraints](/getting-started/static-arguments). Most incorrect first impressions of PikaCSS come from assuming `pika()` behaves like a runtime function.
:::

## Read in this order

1. Read [What Is PikaCSS?](/getting-started/what-is-pikacss), [Static Constraints](/getting-started/static-arguments), [How PikaCSS Works](/concepts/how-pikacss-works), and [Atomic Order And Cascade](/concepts/atomic-order-and-cascade) before you judge the tool.
2. Move to [Installation](/getting-started/installation), [First Pika](/getting-started/first-pika), and [Generated Files](/guide/generated-files) to prove one build-time path end to end.
3. Add [ESLint](/integrations/eslint) during onboarding so invalid `pika()` usage stops in the editor instead of leaking across the codebase.
4. Standardize [Configuration](/guide/configuration) and [Core Features Overview](/guide/core-features-overview) before each component starts inventing its own local conventions. Start with [Selectors](/guide/core-features/selectors) and [Variables](/guide/core-features/variables), then add [Shortcuts](/guide/core-features/shortcuts). Introduce [Keyframes](/guide/core-features/keyframes) and [Important](/guide/core-features/important) only when the team has a specific need for them.
5. Use [Component Styling](/patterns/component-styling), [Dynamic Values With CSS Variables](/patterns/dynamic-values-with-css-variables), and [Theming And Variables](/patterns/theming-and-variables) for the patterns the team will repeat in production.
6. When the team grows, revisit [Configuration](/guide/configuration) to lock shared conventions. Rely on [ESLint](/integrations/eslint) and [Common Problems](/troubleshooting/common-problems) to prevent usage drift as new developers onboard.

## For plugin authors

The main docs path is intentionally adopter-first. If you are extending the engine instead of only consuming it, jump to [Plugin System Overview](/plugin-system/overview) after you understand the core engine model.

## Next

- [What Is PikaCSS?](/getting-started/what-is-pikacss)
- [Installation](/getting-started/installation)
- [Core Features Overview](/guide/core-features-overview)
- [Plugin System Overview](/plugin-system/overview)
