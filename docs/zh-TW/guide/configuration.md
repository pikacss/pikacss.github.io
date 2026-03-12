---
description: 了解如何區分 engine config、external plugins 與 integration options，讓 PikaCSS 隨著專案成長仍然保持可預測。
---

# Configuration

一旦你不再把 PikaCSS configuration 視為單一扁平物件，設定就會容易很多。它其實分成三個不同的區塊，而且每一個都在解決不同的問題。

1. 頂層 engine config 會改變樣式如何被理解與輸出
2. `plugins` array 會註冊可安裝的 external plugins
3. integration options 控制掃描、generated files 與 transform 行為

## 何時需要加入 config 檔案

Zero-config 適合第一次驗證 build。當下列任何訊號出現時，就補上 config 檔案：

- 同一個 selector 名稱、shortcut recipe 或 variable token 出現在兩個以上的 components。
- 第二位開發者加入專案，需要知道應該遵守哪些命名慣例。
- 團隊想在整個 codebase 共享一致的 breakpoint aliases、設計 tokens 或可重用的 shortcut recipes。
- 某個 plugin 需要跨所有 builds 共享的設定。

最早的可靠訊號是重複：如果你在兩個地方分別定義了相同的 `screen-md` breakpoint，就在它出現第三次之前把它移進共享 config。

## Engine config

凡是屬於樣式行為，而且不論哪個 bundler 載入 engine 都應該成立的設定，都放在 engine config。

- plugins
- autocomplete
- selectors
- shortcuts
- variables
- keyframes
- layers
- cssImports
- preflights
- prefix 與 selector defaults

<<< @/zh-TW/.examples/guide/config-basic.ts

<<< @/zh-TW/.examples/guide/config-full-example.ts

讓這份檔案只專注在共享的樣式規則。如果某個設定只是為了讓 bundler 找到檔案，或選擇輸出路徑，那它就屬於 integration layer，不是這裡。

## Custom autocomplete

當你的 design system 有穩定的 tokens、selectors 或 style item strings，而且你希望它們在 editor suggestions 裡看起來像內建能力時，就使用 `autocomplete`。

這些補充會和 engine 內建的 autocomplete，以及 plugins 提供的 autocomplete 合併，最後寫進 `pika.gen.ts`。

<<< @/zh-TW/.examples/guide/config-autocomplete.ts

## Semantic variable autocomplete

當某個 token 屬於穩定的 CSS 值家族，而且只應該出現在相符的 properties 上時，就使用 `variables.*.semanticType`。

目前內建的 semantic families 有：

- `color`
- `length`
- `time`
- `number`
- `easing`
- `font-family`

`semanticType` 會先展開成內建的 property family，再和你自己額外加入的 `autocomplete.asValueOf` targets 做 union。

<<< @/zh-TW/.examples/guide/config-variables-semantic-type.ts

## 核心功能是用頂層 keys 設定的

Variables、keyframes、selectors、shortcuts 與 `important` 都屬於 engine 本身。它們不是透過 external `plugins` array 註冊的。

較早期的說法可能會把它們稱為 built-in plugins，但對使用者來說規則其實更簡單：只要 config key 是 `variables`、`keyframes`、`selectors`、`shortcuts` 或 `important`，就把它留在頂層。

<<< @/zh-TW/.examples/guide/core-features-config.ts

| 核心功能 | 設定位置 |
| --- | --- |
| variables | `variables` |
| keyframes | `keyframes` |
| selectors | `selectors` |
| shortcuts | `shortcuts` |
| important | `important` |

## External plugins 放在 `plugins`

<<< @/zh-TW/.examples/guide/config-plugins.ts

::: warning 常見誤解
reset、icons、fonts 與 typography 這類官方 plugins 都是可安裝模組。它們不會取代頂層的 core feature config，而 core feature config 也不會替你註冊這些 modules。
:::

## Build plugin options

檔案掃描、config path 解析、generated file 路徑，以及替代函式名稱，這些都應該放在 integration options。

<<< @/zh-TW/.examples/integrations/plugin-options.ts

這種拆分很重要，因為 integration options 是 adapter-specific 的，而 engine config 應該能在不同 adapter 間攜帶。

## Layers、CSS imports、preflights 與順序

對較大的系統來說，CSS 順序必須是有意識設計的。Layers 讓輸出的優先權可被檢查，而不是碰巧如此。

當頂層 `@import` 規則必須固定排在 generated layers 前面時，就使用 `cssImports`。當 reset 或 base rules 需要穩定插槽時，就使用帶 layer 的 preflights。

<<< @/zh-TW/.examples/guide/config-layers.ts

<<< @/zh-TW/.examples/guide/config-css-imports.ts

<<< @/zh-TW/.examples/guide/config-preflights-with-layer.ts

## Type helpers

PikaCSS 匯出了一組 identity helpers，讓 config 與抽離出來的 style objects 保持型別，而且不改變 runtime 行為。

- `defineEngineConfig()`
- `defineStyleDefinition()`
- `defineSelector()`
- `defineShortcut()`
- `defineKeyframes()`
- `defineVariables()`
- `defineEnginePlugin()`

<<< @/zh-TW/.examples/guide/built-ins/style-definition-define-helper.ts

## 大多數團隊該標準化什麼

- 共享 selectors
- token variables
- shortcut 命名
- plugin 使用方式
- layer 策略
- 對靜態輸入的 ESLint 強制規則

## Next

- [Generated Files](/zh-TW/guide/generated-files)
- [Core Features Overview](/zh-TW/guide/core-features-overview)
- [Theming And Variables](/zh-TW/patterns/theming-and-variables)
- [Plugin System Overview](/zh-TW/plugin-system/overview)
