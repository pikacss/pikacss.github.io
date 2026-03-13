---
description: 讓主題化建立在 selectors 與 variables 上，把 token 變化集中管理，而不是擴散到各個 component 分支裡。
---

# Theming And Variables

如果主題邏輯不斷在 component 裡膨脹成重複的顏色分支，缺少的通常不是更多 runtime styling logic，而是 token architecture。

PikaCSS 在 selectors 描述 context、variables 承載會變動值時，效果最好。

## 在 config 中定義 variables

<<< @/zh-TW/.examples/guide/config-variables.ts

你可以把 variable definitions scope 在 selectors 之下，用來表達各種主題情境的 token 值。

<<< @/zh-TW/.examples/guide/config-variables-transitive.ts

如果某個 token 屬於 color 或 length 這類穩定值家族，就加上 `semanticType`，讓 autocomplete 維持在正確的 CSS properties 上。

<<< @/zh-TW/.examples/guide/config-variables-semantic-type.ts

## 在 component 中使用 variables

<<< @/zh-TW/.examples/guide/variables.pikainput.ts

<<< @/zh-TW/.examples/guide/variables.pikaoutput.css

如果某個值需要在 runtime 針對每個實例變動，請接著看 [Dynamic Values With CSS Variables](/zh-TW/patterns/dynamic-values-with-css-variables)。

## 一個實用的主題化策略

1. 用 selectors 描述 light、dark 或特定品牌容器這類主題 context。
2. 用 variables 承載該 context 下實際的 token values。
3. 讓 component style definitions 專注在語意化 token 的使用。

這種拆法比起為每個主題重複整個 component 物件更容易維護，也能把主題系統集中在單一位置檢視。

## 該做與不該做

| 該做 | 不該做 |
| --- | --- |
| 把主題值放進 CSS variables。 | 沒有理由地為每個主題複製整個 component。 |
| 用 selectors scope variable definitions。 | 把主題邏輯塞進 runtime 物件建構。 |
| 讓 component 物件保持語意化。 | 在每個 component 裡把所有 token 直接寫死。 |

## Next

- [Dynamic Values With CSS Variables](/zh-TW/patterns/dynamic-values-with-css-variables)
- [Responsive And Selectors](/zh-TW/patterns/responsive-and-selectors)
- [Configuration](/zh-TW/guide/configuration)
- [靜態限制](/zh-TW/getting-started/static-arguments)
