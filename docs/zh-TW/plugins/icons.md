---
description: 了解 icons plugin 如何把 Iconify collections 和自訂 SVG 來源轉成靜態的 PikaCSS style input。
---

# Icons

`@pikacss/plugin-icons` 會把 icons 拉進和其他 PikaCSS 一樣的靜態撰寫模型。它不需要額外引入一層 runtime component，而是在 build 過程中解析 icon names，並輸出仍然符合 engine atomic workflow 的 CSS 驅動 icon styles。

## 什麼時候該用它

當你想要下面這些能力時，就用 icons plugin：

- 讓 icon usage 維持在靜態原始碼字串裡
- 使用大型 Iconify collections，但不引入 runtime icon components
- 使用自訂 SVG 來源，同時維持同一套命名模型
- 讓 CSS 輸出繼承系統其餘部分的顏色、尺寸與主題化能力

## Install

::: code-group
<<< @/zh-TW/.examples/plugins/icons-install.sh [pnpm]
<<< @/zh-TW/.examples/plugins/icons-install-npm.sh [npm]
<<< @/zh-TW/.examples/plugins/icons-install-yarn.sh [yarn]
:::

## 最小設定

<<< @/zh-TW/.examples/plugins/icons-basic-config.ts

## Usage

<<< @/zh-TW/.examples/plugins/icons-usage.ts

<<< @/zh-TW/.examples/plugins/icons-usage.vue

重點不只是 icons 能正常運作，而是 icon names 即使用在 template 綁定裡，也仍然要先出現在靜態的 PikaCSS 輸入中。這樣 icon 使用才會維持成可審查的靜態原始碼，也能讓大型 codebase 更容易做搜尋、linting 與命名規範管理。

## 命名模型

預設情況下，icon names 會使用 `i-` prefix，再接上 `collection:name`，例如 `i-mdi:home`。這個形狀很重要，因為它讓 icons 和其他 PikaCSS 輸入保持一致，都是可以在 build-time 掃描、轉換、推理的普通原始碼字串。

一旦 icon 使用只是原始碼輸入，命名漂移就會變成維護問題。請盡早決定 prefix 與 collection 規則，避免團隊後續各自發明互相競爭的慣例。

## 該做與不該做

| 該做 | 不該做 |
| --- | --- |
| 安裝或預載專案實際會用到的 collections。 | 假設所有 icon 在每個 CI 環境裡都一定能遠端解析成功。 |
| 對 prefixes 與 collection names 維持單一命名慣例。 | 在沒有規劃的情況下混用 runtime components、臨時 prefixes 和 raw collection names。 |
| 先為大家每天最常用的 icon names 準備 autocomplete。 | 期待每個人都能準確記住幾十個 collection 專屬名稱。 |

## 進階自訂

<<< @/zh-TW/.examples/plugins/icons-advanced-config.ts

<<< @/zh-TW/.examples/plugins/icons-custom-collections.ts

你也可以把 custom collection 指到由 repository 自己維護的 SVG assets，並在第一方與第三方 icons 之間共用同一套 `i-collection:name` 語法。

<<< @/zh-TW/.examples/plugins/icons-directory-collection.ts

## 一個實用規則

把 icon 命名當成 design-system vocabulary 的一部分，而不是偶然出現的語法。當 icon names 穩定、可搜尋、可審查時，這個 plugin 才能發揮最好效果。

## Next

- [Reset](/zh-TW/plugins/reset)
- [Typography](/zh-TW/plugins/typography)
- [Create A Plugin](/zh-TW/plugin-system/create-plugin)
- [Configuration](/zh-TW/guide/configuration)
