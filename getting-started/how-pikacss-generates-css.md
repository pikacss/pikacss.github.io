---
url: /getting-started/how-pikacss-generates-css.md
description: >-
  The runtime model — deduplication, property overrides, value fallbacks,
  ordering, and layer grouping.
---

# How PikaCSS Generates CSS

What the engine does between a `pika()` call and the generated stylesheet. Knowing these rules explains every byte of `pika.gen.css`.

## The Pipeline

1. The build plugin scans included files and finds `pika()` calls.
2. Each call's arguments are evaluated at build time and passed to the engine.
3. The engine extracts every `[selector, property, value]` triple into an atomic style with a short class ID (`pk-a`, `pk-b`, ...).
4. The call in your source is replaced with the resulting class-name string literal.
5. All collected atomic styles are rendered into the generated CSS file, which `import 'pika.css'` resolves to.

## Deduplication

Atomic styles are keyed by their `[selector, property, value]` content. The same declaration used anywhere in your project — same file or not — resolves to the same class:

::: code-group

```ts \[Input]
const cardClass = pika({ display: 'flex', padding: '1rem' })
const bannerClass = pika({ display: 'flex', color: 'white' })

export { bannerClass, cardClass }

```

```css \[Output]
@layer utilities {
  .pk-a {
    display: flex;
  }
  .pk-b {
    padding: 1rem;
  }
  .pk-c {
    color: white;
  }
}

```

:::

Both calls share `.pk-a { display: flex; }`. The output size grows with the number of *unique* declarations, not with the number of call sites.

## Last Wins Per Property

Within one `pika()` call (across all its arguments, including expanded shortcuts), a later definition of the same `[selector, property]` pair replaces the earlier one — only the final value is emitted:

::: code-group

```ts \[Input]
const overriddenClass = pika(
	{ color: 'red', padding: '1rem' },
	{ color: 'blue' },
)

export { overriddenClass }

```

```css \[Output]
@layer utilities {
  .pk-a {
    padding: 1rem;
  }
  .pk-b {
    color: blue;
  }
}

```

:::

`color: 'red'` never reaches the stylesheet. This is what makes composition like `pika('btn', { backgroundColor: 'purple' })` behave like an override rather than a conflict.

## `null` Removes a Property

Passing `null` (or `undefined`) as a value removes any earlier definition of that property in the same call — useful for subtracting one declaration from a shortcut or a shared base:

::: code-group

```ts \[Input]
const quietCardClass = pika(
	{ padding: '1rem', boxShadow: '0 1px 2px rgb(0 0 0 / 0.2)' },
	{ boxShadow: null },
)

export { quietCardClass }

```

```css \[Output]
@layer utilities {
  .pk-a {
    padding: 1rem;
  }
}

```

:::

The `boxShadow` declaration is dropped entirely; no atomic class is generated for it.

## Value Fallbacks

A `[value, fallbacks]` tuple renders the fallbacks first and the primary value last inside a single rule, so browsers that support the primary value use it and older ones keep the fallback:

::: code-group

```ts \[Input]
const fullHeightClass = pika({
	height: ['100dvh', ['100vh']],
})

export { fullHeightClass }

```

```css \[Output]
@layer utilities {
  .pk-a {
    height: 100vh;
    height: 100dvh;
  }
}

```

:::

## Output Ordering

The generated stylesheet is deterministic:

* Every atomic style gets a **rendering weight**: `0` when it uses only the default selector (a plain class rule), otherwise the number of nested selector segments (a rule inside `@media` inside a pseudo-selector weighs more than a plain rule). Styles are sorted by weight ascending, so simpler rules always come first.
* Within the same weight, styles keep their **registration order** (the sort is stable).
* **Shorthand/longhand conflicts** are order-protected: when a property overlaps the effect of an earlier one in the same call (e.g. `padding` then `paddingTop`), the engine marks the later one order-sensitive and only reuses an existing class if it already sits after the classes it must override — otherwise it mints a new class. This is why `paddingTop` reliably beats `padding` regardless of how classes got reused elsewhere.

A practical consequence: when two *independent* atomic classes on the same element set the same property, the stylesheet position — not the order in your `class` attribute — decides the winner. Prefer single-call composition (last-wins) over stacking conflicting classes.

## Layer Grouping

Atomic styles are wrapped in a CSS `@layer` block. By default the engine declares two layers, `preflights` (weight `1`) and `utilities` (weight `10`), and emits an order declaration sorted by weight:

```css
@layer preflights, utilities;
```

* Atomic styles go into the default utilities layer unless a definition sets `__layer` to another configured layer.
* Preflights without an explicit layer are wrapped in the default preflights layer when that layer name exists in the configured layers.
* A `__layer` value that is **not** in the configured layers is not silently honored: the engine logs a warning and renders the style unlayered. Note that unlayered CSS has higher cascade priority than any layer, so always register custom layers in `layers` config.
* A preflight assigned to an undeclared layer renders as a trailing `@layer` block that is missing from the order declaration — by `@layer` semantics it is then ordered after every declared layer, so it *wins over all of them*, which usually inverts the intent. Register the layer with an explicit weight instead.

See [Layers](/customizations/layers) for configuring layer names and weights.

## Next

* [Layers](/customizations/layers) — control layer names, weights, and `__layer` usage.
* [Dynamic Styles](/getting-started/dynamic-styles) — runtime-driven styling patterns built on these rules.
* [Engine Config](/getting-started/engine-config) — all engine options.
