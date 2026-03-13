---
description: 建立 responsive rules、states 與 context-driven styling 的共享 selector vocabulary，讓你的團隊不再需要在每個 component 裡重新定義相同條件。
---

# Responsive And Selectors

Selectors 是 PikaCSS 從 helper 變成系統的起點。它們讓你把 states、主題與 breakpoints 先在 config 中命名一次，再在所有地方重用這些名稱。

真正的價值不是語法變短，而是為結構性樣式條件建立一套共享 vocabulary。

## 設計你的 breakpoint vocabulary

把所有 breakpoint aliases 定義在 engine config 裡，不要放進個別 component。這能讓命名保持一致，也讓團隊可以在整個 codebase 中掃描 breakpoint 使用情況。

<<< @/zh-TW/.examples/guide/selectors-config.ts

偏好用像 `screen-sm`、`screen-md` 和 `screen-lg` 這樣樸素、可預期的名稱。如果每個開發者都發明不同的命名方式，具名 selectors 就不再是共享語言，而只會退回成局部語法雜訊。

## 在 components 中使用 selectors

一旦 selectors 登記完成，就可以在 `pika()` style objects 中把它們的名稱當作 key 使用。Component 檔案永遠不需要知道原始的 media query 或 selector 字串。

<<< @/zh-TW/.examples/guide/selectors.pikainput.ts

<<< @/zh-TW/.examples/guide/selectors.pikaoutput.css

## 巢狀 selector objects 仍然是靜態的

把 style object 巢入 selector key 之下是在原始碼中宣告的，而不是在 runtime 計算出來的，它與 build-time model 完全相容。

完整 API（包含 `$` placeholder 與展開機制）請參閱 [Selectors](/zh-TW/guide/core-features/selectors)。

## 搭配 shortcuts 使用 selectors

當 selector 驅動的樣式組合在多個 component 中反覆出現，通常就是將其提取成 shortcut 的時機。

Shortcuts 能把建立在 selectors 之上的重複靜態組合收斂成一個具名慣例，而不是讓同樣的 key pattern 一再重複。

定義 shortcut recipes 的方式請參閱 [Shortcuts](/zh-TW/guide/core-features/shortcuts)。

## 把責任切乾淨

Selectors 應該描述結構：state、context 與 breakpoints。

Variables 應該承載會變化的值。

Shortcuts 應該捕捉建立在這些 selectors 之上的重複靜態組合。

## 建議模式

- 把 breakpoint aliases 放在 config，不要放在個別 component 裡。
- 讓 selector names 具備足以在團隊層級重用的語意。
- 用 selectors 表達結構條件，用 variables 表達值的變化。
- 當 selector 驅動的模式反覆出現時，就用 shortcuts 收斂。

::: warning 不要讓 selectors 過度承載
如果一個 selector alias 把太多互不相干的規則都藏在裡面，review 會變難，局部覆寫也會變得不可預測。Selector 應該描述一個穩定條件，而不是整個 component contract。
:::

## Next

- [Component Styling](/zh-TW/patterns/component-styling)
- [Theming And Variables](/zh-TW/patterns/theming-and-variables)
- [Dynamic Values With CSS Variables](/zh-TW/patterns/dynamic-values-with-css-variables)
- [Configuration](/zh-TW/guide/configuration)
