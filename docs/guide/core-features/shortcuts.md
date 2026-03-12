---
description: Learn both ways to apply shortcuts, how to define static and dynamic shortcut recipes in engine config, and when shortcuts are the right tool for repeated style composition.
---

# Shortcuts

`shortcuts` lets you define named static recipes and dynamic shortcut patterns in engine config.

This is the core feature that compresses repeated style composition into conventions without giving up the build-time model.

## Applying shortcuts

There are two ways to apply a shortcut inside `pika()`.

**String argument** — pass the shortcut name as the first argument to `pika()`. Additional style definitions can follow as extra arguments.

<<< @/.examples/guide/built-ins/shortcuts-usage-string-arg.ts

<<< @/.examples/guide/built-ins/shortcuts-output-string-arg.css

**`__shortcut` property** — include a `__shortcut` key in a style definition object. Set it to a shortcut name or an array of names. Other properties in the same object are applied on top of the shortcut.

<<< @/.examples/guide/built-ins/shortcuts-usage-property.ts

<<< @/.examples/guide/built-ins/shortcuts-output-property.css

## Define shortcuts in config

<<< @/.examples/guide/built-ins/shortcuts-config.ts

The config supports four forms:

- **Plain string** — registers an autocomplete-only hint with no expansion rule.
- **Static tuple** — maps a name to one or more style definition objects.
- **Dynamic regex tuple** — derives a style definition from a name that matches a regex.
- **Object form** — equivalent to the tuple forms, written as a named object.

A static shortcut value can be an array of style definition objects. The engine applies them in order, emitting one atomic rule per unique property.

## Recursive shortcuts

A shortcut value can reference another registered shortcut by name. The engine resolves the chain recursively.

<<< @/.examples/guide/built-ins/shortcuts-recursive.ts

## What shortcuts are good at

Use shortcuts when the same static combination appears across many components: button bases, layout helpers, accessibility utilities, spacing recipes, and other repeatable patterns.

They reduce local noise and make shared conventions visible at the config layer.

## What shortcuts are not

Shortcuts are not a tunnel for arbitrary runtime logic back into `pika()`.

They still belong to static authoring. When a component needs per-instance values, pair shortcuts with variables instead of computing fresh style objects at runtime.

## Next

- [Core Features Overview](/guide/core-features-overview)
- [Variables](/guide/core-features/variables)
- [Keyframes](/guide/core-features/keyframes)
- [Component Styling](/patterns/component-styling)
