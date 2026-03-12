---
description: 理解 `$` placeholder 的作用、學習如何定義 state、context 與 media conditions 的 selector aliases，並了解為何具名 selectors 能讓 component 程式碼在規模化時保持一致。
---

# Selectors

`selectors` 讓你在 engine config 中為 CSS 條件登記具名別名——pseudo states、父層 context、at-rules，以及動態 patterns。這些名稱就是你在 `pika()` style objects 裡使用的 key。

這是 PikaCSS 最重要的擴展功能之一，因為它讓整個 codebase 能對 state、context 與 responsive conditions 使用同一套語言。

::: warning 把條件登記為具名 selectors——不要在 key 裡使用原始 CSS 語法

一個常見錯誤是直接把像 `'&:hover'` 這種原始 CSS selector 語法寫成 `pika()` 呼叫裡的 key。這會產生 **CSS nesting rule**，而不是 flat atomic rule。Nesting rules 不會像 atomic rules 一樣在 components 之間被去重或重用。

永遠要把條件登記為 config 裡的具名 selector，並以該名稱作為 key：

<<< @/zh-TW/.examples/guide/built-ins/selectors-nesting-antipattern.ts

<<< @/zh-TW/.examples/guide/built-ins/selectors-nesting-antipattern-output.css

你在 selector config values 裡看到的 `$` 是一個 placeholder，標示生成的 atomic class name 在 CSS rule 中出現的位置。它是 engine config 語法，不是 CSS 語法，也永遠不會出現在 `pika()` 呼叫裡。
:::

::: tip 從 Tailwind 轉換過來的開發者
如果你的團隊使用 Tailwind，Tailwind 的 `md:` prefix 對應的就是在 PikaCSS config 裡登記一個 `screen-md` selector。名稱的選擇完全由你決定——engine 對命名方式沒有限制。同樣地，Tailwind 的 `hover:` prefix 對應的是 PikaCSS 裡的 `hover` selector。
:::

## `$` placeholder

當你定義一個針對元素本身的 selector 時，在 pattern 字串中使用 `$` 作為 placeholder，標示生成的原子 class name 在最終 CSS rule 中出現的位置。

<<< @/zh-TW/.examples/guide/built-ins/selectors-placeholder-pseudo.ts

Engine 會在 build time 將 `$` 替換成生成的 class name：

- `['hover', '$:hover']` → `.pk-a:hover { ... }`
- `['before', '$::before']` → `.pk-a::before { ... }`
- `['dark', '[data-theme="dark"] $']` → `[data-theme="dark"] .pk-a { ... }`

像 `@media` 這類 at-rules 不需要 `$`。Engine 會自動將原子 class 巢入 at-rule block 內：

<<< @/zh-TW/.examples/guide/built-ins/selectors-at-rule-output.css

## 在 config 中定義 selectors

<<< @/zh-TW/.examples/guide/built-ins/selectors-config.ts

Config 支援四種形式：

- **純字串** — 只登記 autocomplete hint，不建立展開規則。
- **靜態 tuple** — 將名稱對應到一或多個包含 `$` 的 CSS selector patterns。
- **動態 regex tuple** — 從符合 regex 的名稱推導出 selector pattern。
- **Object form** — 與 tuple 形式等價，以具名物件形式撰寫。

## Multi-value selectors

靜態 selector 可以展開成多個 CSS selector patterns。把多個 patterns 包在陣列裡，作為 tuple 的第二個元素。

<<< @/zh-TW/.examples/guide/built-ins/selectors-tuple-static.ts

## Selector 如何在 pika() 中展開

在任何傳入 `pika()` 的 style object 中，以已登記的 selector 名稱作為 key。Engine 會將其展開成對應的 CSS 條件。

<<< @/zh-TW/.examples/guide/built-ins/selectors-usage.ts

<<< @/zh-TW/.examples/guide/built-ins/selectors-output.css

## Selector aliases

Selector 的值可以引用另一個已登記 selector 的名稱。Engine 會遞迴解析這條引用鏈。

<<< @/zh-TW/.examples/guide/built-ins/selectors-recursive.ts

## selectors 擅長什麼

Selectors 很適合拿來表示穩定條件：hover states、focus 行為、主題 context、breakpoint aliases，以及其他可重用的結構規則。

這能讓 component 程式碼更容易閱讀，也能防止原始 selector 語法或重複的 media queries 散落在整個應用程式裡。

## selectors 不是什麼

Selectors 不該把整個 component contract 藏進一個模糊的名稱後面。

如果一個 alias 打包了太多互不相干的事，review 會更難做，區域覆寫也會變得更不可預測。

## Next

- [Core Features Overview](/zh-TW/guide/core-features-overview)
- [Shortcuts](/zh-TW/guide/core-features/shortcuts)
- [Responsive And Selectors](/zh-TW/patterns/responsive-and-selectors)
- [Configuration](/zh-TW/guide/configuration)
