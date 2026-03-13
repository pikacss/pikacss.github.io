---
description: 把 CSS variables 定義成 engine data，讓 tokens、scope 與 runtime 值變化都能和 PikaCSS 的 build-time 規則相容。
---

# Variables

`variables` 會把 CSS custom properties 變成結構化的 engine config，而不是讓它們以零散字串的形式散落在 component 程式碼裡。

這是最直接把 build-time 樣式撰寫與 runtime 彈性接起來的 core feature。class 的結構保持靜態，但實際值仍然可以透過 `var(--token)` 改變。

## 在 config 中定義 variables

<<< @/zh-TW/.examples/guide/config-variables.ts

Variables 也可以 scope 在 selectors 之下，這正是主題感知 tokens 與 context-specific overrides 的基礎。

<<< @/zh-TW/.examples/guide/config-variables-transitive.ts

## 讓 autocomplete 保持有意義

如果某個 token 屬於 color、length 或 time 這種穩定家族，就使用 `semanticType`，讓 autocomplete 只掛在這個 token 真正有意義的 properties 上。

<<< @/zh-TW/.examples/guide/config-variables-semantic-type.ts

## 在 style definitions 中使用 variables

<<< @/zh-TW/.examples/guide/variables.pikainput.ts

<<< @/zh-TW/.examples/guide/variables.pikaoutput.css

## variables 擅長什麼

Variables 很適合拿來承載 design tokens、主題值，以及那些值會改變，但 style definition 結構應該保持固定的情境。

這也是為什麼當團隊開始超越 trivial 範例時，variables 往往會是最早採用的 core features 之一。

## variables 不是什麼

Variables 不是把任意 style objects 重新搬回 runtime 的理由。

它們解決的是值的變化，不是結構的變化。當改變的是樣式形狀本身時，請改用 variants、selectors 或 shortcuts。

## Next

- [Core Features Overview](/zh-TW/guide/core-features-overview)
- [Selectors](/zh-TW/guide/core-features/selectors)
- [Dynamic Values With CSS Variables](/zh-TW/patterns/dynamic-values-with-css-variables)
- [Theming And Variables](/zh-TW/patterns/theming-and-variables)
