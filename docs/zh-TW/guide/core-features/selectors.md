---
description: 理解 `$` placeholder 的作用、學習如何定義 state、context 與 media conditions 的 selector aliases，並了解為何具名 selectors 能讓 component 程式碼在規模化時保持一致。
---

# Selectors

`selectors` 讓你在 engine config 中為 CSS 條件登記具名別名——pseudo states、父層 context、at-rules，以及動態 patterns。這些名稱就是你在 `pika()` style objects 裡使用的 key。

這是 PikaCSS 最重要的擴展功能之一，因為它讓整個 codebase 能對 state、context 與 responsive conditions 使用同一套語言。

::: warning 把條件登記為具名 selectors——不要在 key 裡使用原始 CSS 語法

一個常見錯誤是直接把像 `'&:hover'` 這種原始 CSS selector 語法寫成 `pika()` 呼叫裡的 key。這會產生 **CSS nesting rule**，而不是 flat atomic rule。Nesting rules 不會像 atomic rules 一樣在 components 之間被去重或重用。

永遠要把條件登記為 config 裡的具名 selector，並以該名稱作為 key：

正確寫法：使用已登記的 selector 名稱，讓 engine 輸出 flat atomic rule。

<<< @/zh-TW/.examples/guide/built-ins/selectors-nesting-correct.pikainput.ts

<<< @/zh-TW/.examples/guide/built-ins/selectors-nesting-correct.pikaoutput.css

錯誤寫法：像 `'&:hover'` 這種原始 CSS key 會改成輸出 nesting rule。

<<< @/zh-TW/.examples/guide/built-ins/selectors-nesting-wrong.pikainput.ts

<<< @/zh-TW/.examples/guide/built-ins/selectors-nesting-wrong.pikaoutput.css

你在 selector config values 裡看到的 `$`，是目前 default selector 的 placeholder。預設情況下這個 selector 是 `.%`，所以 `$` 是大多數使用者會接觸到的簡寫。它是 engine config 語法，不是 CSS 語法，也永遠不會出現在 `pika()` 呼叫裡。
:::

::: tip 從 Tailwind 轉換過來的開發者
如果你的團隊使用 Tailwind，Tailwind 的 `md:` prefix 對應的就是在 PikaCSS config 裡登記一個 `screen-md` selector。名稱的選擇完全由你決定——engine 對命名方式沒有限制。同樣地，Tailwind 的 `hover:` prefix 對應的是 PikaCSS 裡的 `hover` selector。
:::

## 心智模型：`$`、default selector 與 at-rules

Selector 邏輯其實發生在兩個不同的位置：

- 在 `pika()` 裡，你把像 `hover`、`theme-dark`、`screen-md` 這些 selector 名稱寫成靜態 object keys。
- 在 selector config 裡，你決定這些名稱要如何展開成 CSS 條件。

`$` 的意思是「把目前的 default selector 放在這裡」。在預設設定下，這個 selector 是 `.%`，所以這些規則最後會渲染成像 `.pk-a` 這樣的 atomic class name。

這也是為什麼 inline 條件需要 `$`，但 wrapper 條件通常不需要：

- `['hover', '$:hover']` 會把元素 selector 放在 pseudo state 前面。
- `['dark', '[data-theme="dark"] $']` 會把元素 selector 放進父層 context 裡。
- `['md', '@media (min-width: 768px)']` 不需要 `$`，因為 at-rule 是包住 atomic selector，而不是內嵌放置它。

如果一整條 selector chain 只產生像 `@media` 這種 wrappers，沒有自行放入 atomic selector，engine 會在最內層自動補上 default selector。

## config 裡的 `$` placeholder

當你定義一個針對元素本身的 selector 時，在 pattern 字串中使用 `$` 作為 placeholder，標示生成的原子 class name 在最終 CSS rule 中出現的位置。

<<< @/zh-TW/.examples/guide/built-ins/selectors-placeholder-pseudo.ts

Engine 會先透過目前的 default selector 展開 `$`，再在 build time 將其渲染成生成的 class name：

- `['hover', '$:hover']` → `.pk-a:hover { ... }`
- `['before', '$::before']` → `.pk-a::before { ... }`
- `['dark', '[data-theme="dark"] $']` → `[data-theme="dark"] .pk-a { ... }`

像 `@media` 這類 at-rules 不需要 `$`。Engine 會把它們視為 wrappers，並自動將原子 selector 巢入 at-rule block 內：

<<< @/zh-TW/.examples/guide/built-ins/selectors-at-rule.pikaoutput.css

## 在 config 中定義 selectors

<<< @/zh-TW/.examples/guide/built-ins/selectors-config.ts

Config 支援四種形式：

- **純字串** — 只登記 autocomplete hint，不建立展開規則。
- **靜態 tuple** — 將名稱對應到一或多個 CSS selector patterns；當條件需要內嵌放置元素 selector 時，可以包含 `$`。
- **動態 regex tuple** — 從符合 regex 的名稱推導出 selector pattern。
- **Object form** — 與 tuple 形式等價，以具名物件形式撰寫。

## Multi-value selectors

靜態 selector 可以展開成多個 CSS selector patterns。把多個 patterns 包在陣列裡，作為 tuple 的第二個元素。

<<< @/zh-TW/.examples/guide/built-ins/selectors-tuple-static.ts

## Selector 如何在 pika() 中展開

在任何傳入 `pika()` 的 style object 中，以已登記的 selector 名稱作為 key。Engine 會將其展開成對應的 CSS 條件。

如果展開後的 selector pattern 已經用了 `$`，那個 pattern 就精確決定 atomic selector 要放在哪裡。如果展開後的 pattern 只是像 `@media` 這樣的 wrapper，engine 會自動在裡面補上 default selector。

<<< @/zh-TW/.examples/guide/built-ins/selectors.pikainput.ts

<<< @/zh-TW/.examples/guide/built-ins/selectors.pikaoutput.css

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
