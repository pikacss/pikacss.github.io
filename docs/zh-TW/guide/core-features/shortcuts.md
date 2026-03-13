---
description: 學習兩種套用 shortcuts 的方式、如何在 engine config 中定義靜態與動態 shortcut recipes，以及什麼時候 shortcuts 才是處理重複樣式組合的正確工具。
---

# Shortcuts

`shortcuts` 讓你在 engine config 中定義具名的靜態 recipes 與動態 shortcut patterns。

這個 core feature 會把重複的樣式組合壓縮成團隊慣例，同時不放棄 build-time model。

## 套用 Shortcuts

在 `pika()` 中套用 shortcut 有兩種方式。

**String argument** — 把 shortcut 名稱作為第一個引數傳入 `pika()`。後續可以跟著額外的 style definitions 作為補充引數。

<<< @/zh-TW/.examples/guide/built-ins/shortcuts-string-arg.pikainput.ts

<<< @/zh-TW/.examples/guide/built-ins/shortcuts-string-arg.pikaoutput.css

**`__shortcut` 屬性** — 在 style definition object 中加入 `__shortcut` key，設定為一個 shortcut 名稱或名稱陣列。同一個物件中的其他屬性會套疊在 shortcut 之上。

<<< @/zh-TW/.examples/guide/built-ins/shortcuts-property.pikainput.ts

<<< @/zh-TW/.examples/guide/built-ins/shortcuts-property.pikaoutput.css

## 在 config 中定義 shortcuts

<<< @/zh-TW/.examples/guide/built-ins/shortcuts-config.ts

Config 支援四種形式：

- **純字串** — 只登記 autocomplete hint，不建立展開規則。
- **靜態 tuple** — 將名稱對應到一或多個 style definition objects。
- **動態 regex tuple** — 從符合 regex 的名稱推導出 style definition。
- **Object form** — 與 tuple 形式等價，以具名物件形式撰寫。

靜態 shortcut 的值可以是 style definition objects 的陣列。Engine 會依序套用，每個唯一 property 各發出一條原子規則。

## 遞迴 shortcuts

Shortcut 的值可以引用另一個已登記 shortcut 的名稱。Engine 會遞迴解析這條引用鏈。

<<< @/zh-TW/.examples/guide/built-ins/shortcuts-recursive.ts

## shortcuts 擅長什麼

當同一組靜態組合在很多 component 中反覆出現時，就使用 shortcuts，例如 button bases、layout helpers、accessibility utilities、spacing recipes，以及其他可重用模式。

它們能減少局部雜訊，並讓共享慣例在 config 層清楚可見。

## shortcuts 不是什麼

Shortcuts 不是把任意 runtime logic 偷渡回 `pika()` 的通道。

它們仍然屬於靜態撰寫。當 component 需要每個實例都不同的值時，應該把 shortcuts 和 variables 搭配，而不是在 runtime 重新計算 style objects。

## Next

- [Core Features Overview](/zh-TW/guide/core-features-overview)
- [Variables](/zh-TW/guide/core-features/variables)
- [Keyframes](/zh-TW/guide/core-features/keyframes)
- [Component Styling](/zh-TW/patterns/component-styling)
