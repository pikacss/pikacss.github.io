---
description: 在不把這個選擇和 selector 設計或 layer 順序混為一談的前提下，控制預設與每個 definition 的 !important 行為。
---

# Important

`important` 會控制 generated declarations 是否預設包含 `!important`，以及單一 style definition 是否能覆寫這個預設值。

它是 core feature，因為它會在輸出階段改變 CSS 優先權。它不是 plugin，也不是清楚 selectors 或合理 layer 順序的替代品。

## 設定預設值

當專案想要一條一致的預設規則時，就用 engine config 來設定。

<<< @/zh-TW/.examples/guide/config-important.ts

## 對單一 definition 覆寫

當某個 style definition 需要在不改動全域預設的情況下個別選擇開啟或關閉時，就使用 `__important`。

<<< @/zh-TW/.examples/guide/important-per-definition.pikainput.ts

## 什麼時候該用

當團隊清楚知道為什麼需要強制優先權，並且想有意識地套用這條規則時，再考慮使用 `important`。

典型理由包括與 legacy CSS 共存、受控的 integration 邊界，或一個定義很清楚而且必須始終勝出的 utility layer。

## 什麼時候不該用

如果 `!important` 不斷冒出來，底層問題通常在別處：

- selector aliases 太寬或太模糊
- layer ordering 在做錯工作
- 區域覆寫正在補償 design system 的不一致

遇到這些情況時，先修正結構，再讓 `important` 保持為例外，而不是基線。

## 它和 engine 其他部分的關係

`important` 只會改變輸出優先權。它不會替你定義可重用的 tokens、selectors 或 recipes。

這也是為什麼很多團隊會先採用 `selectors`、`variables` 與 `shortcuts`，之後才決定是否要把 `important` 納入慣例。

## Next

- [Core Features Overview](/zh-TW/guide/core-features-overview)
- [Variables](/zh-TW/guide/core-features/variables)
- [Selectors](/zh-TW/guide/core-features/selectors)
- [Configuration](/zh-TW/guide/configuration)
