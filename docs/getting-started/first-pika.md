---
description: Build one minimal PikaCSS flow, inspect the emitted CSS, and make the build-time model concrete before scaling usage.
---

# First Pika

The goal of this page is simple: get one successful `pika()` flow working, inspect the output, and make the build-time model concrete before you scale usage.

## 1. Import the virtual CSS module

Import the virtual CSS module in your application entry:

<<< @/.examples/getting-started/first-pika-entry.ts

## 2. Write one static style block

This is the smallest useful `pika()` call:

<<< @/.examples/getting-started/first-pika-basic.pikainput.ts

If you are working in Vue, the same idea looks like this:

<<< @/.examples/getting-started/first-pika-basic-vue.pikainput.vue

## 3. Look at the generated result

PikaCSS does not keep this object around at runtime. The integration turns it into atomic class names and emits CSS during the build.

<<< @/.examples/getting-started/first-pika-basic.pikaoutput.css

Inspect the generated CSS once, early. It makes the rest of the docs read like engineering details instead of marketing language.

## 4. Compose with multiple arguments

Use multiple `pika()` arguments to separate stable structure from local intent.

<<< @/.examples/getting-started/first-pika-multiple-args.pikainput.vue

That composition pattern scales better than collapsing every concern into one giant object.

## 5. Use the output shape that fits the call site

Use the output form that best matches the framework and the place where you consume the class names.

<<< @/.examples/getting-started/first-pika-variants.pikainput.ts

## 6. Keep states and at-rules inside static input

You do not need to leave the style object when you add pseudo states or at-rules.

<<< @/.examples/getting-started/first-pika-nested.pikainput.vue

<<< @/.examples/getting-started/first-pika-nested.pikaoutput.css

## What to verify before continuing

- Your app imports `pika.css` from an entry file.
- One literal `pika()` call transforms successfully.
- You have inspected generated CSS at least once.
- You understand that selectors and composition stay inside static style input.

## Practical do and do not

| Do | Do not |
| --- | --- |
| Start with literal objects and simple composition. | Start with dynamic expressions and debug build failures later. |
| Inspect generated CSS once so the model becomes concrete. | Treat `pika()` like a runtime helper that can read current state. |
| Split base styles and overrides across multiple arguments. | Put every variant branch inside one massive style object. |

## Next

- [Generated Files](/guide/generated-files)
- [Static Constraints](/getting-started/static-arguments)
- [How PikaCSS Works](/concepts/how-pikacss-works)
- [Component Styling](/patterns/component-styling)
