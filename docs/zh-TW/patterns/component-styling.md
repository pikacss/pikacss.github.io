---
description: 用靜態組合、明確 variants 與共享 recipes 來規劃 PikaCSS component styling，讓它保持容易 review。
---

# Component Styling

最耐用的 PikaCSS components，通常是由小而靜態的片段組成。目標不是耍巧思，而是讓樣式形狀保持容易 review、容易重用，並且和 build-time 抽取相容。

當 component styling 開始變得困難時，通常不是能力不夠，而是太多責任被塞進同一個物件裡。

## 從組合開始，不要從條件分支開始

Base styles、variant styles 與局部 overrides，通常都應該拆成不同 arguments。

<<< @/zh-TW/.examples/getting-started/first-pika-multiple-args.vue

這種模式能擴展，是因為每一個部分都只有一個工作：

- base styles 定義結構
- variant styles 定義意圖
- 局部 overrides 解決狹窄的情境需求

當這些角色被壓成同一個巨大物件時，review 會變難，重用也會變弱。

## 用 shortcuts 承載共享 recipes

如果同一組樣式 bundle 在多個 component 中重複出現，就把它搬進 shortcut，而不是在不同檔案間複製同一個物件。

<<< @/zh-TW/.examples/guide/config-shortcuts.ts

<<< @/zh-TW/.examples/guide/shortcuts-usage.ts

<<< @/zh-TW/.examples/guide/shortcuts-output.css

Shortcuts 很適合承載共享的靜態 recipes，但不是藏 runtime 決策的地方。

## 優先使用明確的 variants

對 `primary`、`secondary`、`danger` 或 `compact` 這類狀態，先建立各自獨立的靜態 style blocks，然後讓 runtime 程式碼在它們之間做選擇。

::: tip 良好的 runtime 用法
Runtime 程式碼應該在預先宣告好的 class strings 中做選擇。Runtime 程式碼不應該自己組出樣式內容。
:::

## 把會變的值推進 variables

如果 component 仍然需要像寬度、accent color 或使用者資料這種每個實例都不同的值，就讓結構性的 style block 保持靜態，再把變動值移到 CSS variables。

這樣就能保留 build-time model，同時不放棄真正該由 runtime 負責的彈性。

## 建議的 review 清單

| 問這件事 | 為什麼重要 |
| --- | --- |
| 這段重複區塊能不能變成 shortcut？ | 它能減少重複，並讓意圖更清楚。 |
| 這個 variant 穩定到值得命名嗎？ | 有名字的 variants 比臨時覆寫更容易 review。 |
| 這份主題資料其實是不是 CSS variable 問題？ | Variables 通常會比反覆的顏色分支更耐用。 |
| 這個局部 override 仍然是靜態的嗎？ | 如果不是，build-time model 早晚會和你衝突。 |

## 該做與不該做

| 該做 | 不該做 |
| --- | --- |
| 組合 `pika(base, primary, localOverride)`。 | 把所有可能分支都塞進一個 inline expression。 |
| 把共享 recipes 移進 shortcuts。 | 在不同檔案裡複製同一個大物件。 |
| 讓 variants 穩定而且有名字。 | 每個 component 都重新發明一套動態形狀規則。 |

## Next

- [Responsive And Selectors](/zh-TW/patterns/responsive-and-selectors)
- [Dynamic Values With CSS Variables](/zh-TW/patterns/dynamic-values-with-css-variables)
- [Theming And Variables](/zh-TW/patterns/theming-and-variables)
- [Configuration](/zh-TW/guide/configuration)
