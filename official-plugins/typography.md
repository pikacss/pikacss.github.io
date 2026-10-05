---
url: /official-plugins/typography.md
description: Semantic prose styling for long-form content with the typography plugin.
---

# Typography

Semantic typography styles for long-form prose content.

The typography plugin provides a set of `prose-*` shortcuts that style long-form HTML content (articles, blog posts, documentation) with sensible typographic defaults.

::: code-group

```sh [pnpm]
pnpm add -D @pikacss/plugin-typography
```

```sh [npm]
npm install -D @pikacss/plugin-typography
```

```sh [yarn]
yarn add -D @pikacss/plugin-typography
```

:::

```ts
import { defineEngineConfig } from '@pikacss/core'
import { typography } from '@pikacss/plugin-typography'

export default defineEngineConfig({
	plugins: [typography()],
})
```

Available shortcuts:

| Shortcut | Purpose |
|----------|---------|
| `prose-base` | Base prose container styles shared by the other `prose-*` shortcuts |
| `prose` | Base prose styling — applies all component styles |
| `prose-paragraphs` | Paragraph spacing and line height |
| `prose-links` | Link colors and underline |
| `prose-emphasis` | Bold and italic styling |
| `prose-kbd` | Keyboard input styling |
| `prose-lists` | Ordered and unordered list styling |
| `prose-hr` | Horizontal rule styling |
| `prose-headings` | Heading sizes and spacing |
| `prose-quotes` | Blockquote styling |
| `prose-media` | Image and video styling |
| `prose-code` | Inline code and code block styling |
| `prose-tables` | Table styling |

Size variants:

| Shortcut | Purpose |
|----------|---------|
| `prose-sm` | Small prose sizing |
| `prose-lg` | Large prose sizing |
| `prose-xl` | Extra large prose sizing |
| `prose-2xl` | Double extra large prose sizing |

Usage:

The typography shortcuts are regular `pika()` inputs. For example, you can apply a focused module shortcut like this:

::: code-group

```ts \[Input]
const articleLinksClassName = pika('prose-links')
```

```css \[Output]
@layer utilities {
  .pk-a {
    color: var(--pk-prose-color-body);
  }
  .pk-b {
    max-width: 65ch;
  }
  .pk-c {
    font-size: 1rem;
  }
  .pk-d {
    line-height: 1.75;
  }
  .pk-e > :first-child {
    margin-top: 0;
  }
  .pk-f > :last-child {
    margin-bottom: 0;
  }
  .pk-g a {
    color: var(--pk-prose-color-links);
  }
  .pk-h a {
    text-decoration: underline;
  }
  .pk-i a {
    font-weight: 500;
  }
  .pk-j a strong {
    color: inherit;
  }
  .pk-k a code {
    color: inherit;
  }
}

```

:::

Prose color roles use `--pk-prose-color-*` CSS variables such as `--pk-prose-color-body`, `--pk-prose-color-links`, and `--pk-prose-color-headings`. Keyboard key shadows use `--pk-prose-kbd-shadows`.

## Config

Configure the plugin through the top-level `typography` key in your engine config.

| Property | Description |
|---|---|
| variables | Nested under `typography`. CSS variable overrides for the registered prose variables, including the `--pk-prose-color-*` set and `--pk-prose-kbd-shadows`. |

```ts
import { defineEngineConfig } from '@pikacss/core'
import { typography } from '@pikacss/plugin-typography'

export default defineEngineConfig({
	typography: {
		variables: {
			'--pk-prose-color-links': '#2563eb',
		},
	},
	plugins: [typography()],
})
```

> See [API Reference — Plugin Typography](/api/plugin-typography) for full type signatures and defaults.

## Next

* [Icons](/official-plugins/icons) — icon integration via Iconify.
* [Fonts](/official-plugins/fonts) — web font loading.
