---
description: Register animation names and frame definitions once so keyframes become reusable, typed engine data instead of scattered CSS fragments.
---

# Keyframes

`keyframes` registers animation names and optional frame definitions in engine config so they can participate in autocomplete and generated CSS output.

That keeps animation naming centralized. Instead of repeating raw `@keyframes` logic across components, the project gets one shared animation vocabulary.

## Register keyframes in config

<<< @/.examples/guide/config-keyframes.ts

The config supports name-only entries, tuple form, object form, autocomplete hints, and pruning control.

## Use them in style definitions

<<< @/.examples/guide/keyframes.pikainput.ts

<<< @/.examples/guide/keyframes.pikaoutput.css

## Why this belongs in core features

Keyframes affect CSS emission and autocomplete in the same way selectors, shortcuts, and variables shape other parts of the engine.

They are not only a convenience wrapper. They are part of how a codebase standardizes motion tokens and reviews animation usage.

## A practical rule

Register animation names once, then reuse those names everywhere.

When animation strings are copied ad hoc between components, teams lose pruning, autocomplete, and a clear review surface for motion conventions.

## Next

- [Core Features Overview](/guide/core-features-overview)
- [Shortcuts](/guide/core-features/shortcuts)
- [Configuration](/guide/configuration)
- [Component Styling](/patterns/component-styling)
