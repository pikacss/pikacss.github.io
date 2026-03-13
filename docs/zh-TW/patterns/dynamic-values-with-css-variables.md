---
description: 在 PikaCSS 中處理 runtime values 時，讓樣式形狀保持靜態，只把會變的值綁進 CSS variables。
---

# Dynamic Values With CSS Variables

PikaCSS 不提供 styling runtime。這正是它能保持可預測且快速的部分原因，但也會改變你建模 dynamic styling 的方式。

當某個值必須在 runtime 改變時，請讓 `pika()` 裡的 style definition 保持靜態，然後把變動的值綁進 CSS variable。

## 為工作選對模式

| 需求 | 模式 | 原因 |
| --- | --- | --- |
| 有限的視覺狀態集合 | 預先宣告 variants，並在 runtime 切換 class names。 | PikaCSS 可以提前掃描每一種樣式形狀。 |
| 連續變化或每個實例都不同的值 | 在 `pika()` 裡使用 `var(--...)`，並在 runtime 綁定 variable。 | 樣式形狀保持靜態，而值仍然能動態改變。 |
| 共享的主題 tokens | 在 config 裡定義 variables，並用 selectors scope。 | Design system 能保持集中且可重用。 |

## 不要這樣做

這就是最常造成第一次和 PikaCSS 不匹配的 runtime CSS-in-JS 習慣。

<<< @/zh-TW/.examples/patterns/dynamic-values-bad.pikainput.tsx

`pika()` 無法安全地抽取這種物件，因為樣式值要等應用程式跑起來之後才知道。

## 透過 CSS variables 綁定 runtime values

正確做法不是把更多 runtime logic 塞進 `pika()`，而是讓 PikaCSS 輸出參照 CSS variables 的靜態 declarations，再由你的 framework 或 DOM 程式碼去指派這些 variables。

<<< @/zh-TW/.examples/patterns/dynamic-values-react.pikainput.tsx

這能成立，是因為 PikaCSS 只需要輸出像 `width: var(--progress-width)` 或 `background-color: var(--progress-color)` 這種 declarations。真正的 runtime 值指派仍然由 app 負責。

這條邊界就是整個模式的核心：PikaCSS 負責結構，app 負責會變的值。

## 讓樣式形狀保持靜態，variants 另外切換

很多 component 同時需要兩種動態性：

1. 像 `solid` 或 `outline` 這類離散狀態
2. 像資料帶來的品牌顏色這類每個實例都不同的值

請把這兩件事分開處理。

<<< @/zh-TW/.examples/patterns/dynamic-values-variants.pikainput.tsx

在 runtime 選擇預先宣告好的 class string，再把會變的值綁進 CSS variable。

## 一個好用的遷移心智模型

如果你是從 runtime CSS-in-JS 過來，轉換方式其實很直接：

1. 不要從 runtime 資料建構 style objects。
2. 要在 runtime 從預先宣告好的 style objects 中做選擇。
3. 要把會變的值推進 CSS variables。
4. 要讓 app layer 自己負責 variable 的指派。

::: tip 記住這條邊界
PikaCSS 可以幫你產生 `var(--accent)` 這種 references，但不會管理 `--accent` 的 runtime 狀態。
:::

如果你要處理共享 tokens 與主題切換，請接著看 [Theming And Variables](/zh-TW/patterns/theming-and-variables)。

## Next

- [靜態限制](/zh-TW/getting-started/static-arguments)
- [Theming And Variables](/zh-TW/patterns/theming-and-variables)
- [Component Styling](/zh-TW/patterns/component-styling)
- [Common Problems](/zh-TW/troubleshooting/common-problems)
