---
description: 了解 fonts plugin 如何在同一套 PikaCSS workflow 中管理 hosted fonts、本地 font face 與語意化 font tokens。
---

# Fonts

`@pikacss/plugin-fonts` 讓你把字體載入和字體命名視為同一個系統。你不需要再把 `@import` 規則、`@font-face` 區塊和語意別名分散在多個檔案裡，而是可以在 engine config 中一次描述，交給 plugin 產生 CSS imports、variables 與 shortcuts。

## 什麼時候該用它

當你想要下面這些能力時，就用 fonts plugin：

- 讓 hosted font imports 住在 config 裡，而不是手寫 URL
- 在整個專案中使用像 `sans`、`mono`、`display` 這種語意名稱，而不是到處出現 vendor 專屬 family 字串
- 讓本地 `@font-face` 規則和遠端 providers 共用同一套 vocabulary
- 在不手動拼接 URL 的情況下處理 provider-specific query options

## Install

::: code-group
<<< @/zh-TW/.examples/plugins/fonts-install.sh [pnpm]
<<< @/zh-TW/.examples/plugins/fonts-install-npm.sh [npm]
<<< @/zh-TW/.examples/plugins/fonts-install-yarn.sh [yarn]
:::

## 最小設定

<<< @/zh-TW/.examples/plugins/fonts-basic-config.ts

每個設定好的 token 都會變成一組可重用的 font family stack，並附帶對應的 `font-{token}` shortcut。這也讓 plugin 在團隊未來更換 provider 時依然有價值，因為應用程式端可以繼續沿用同一組語意 token 名稱。

## Provider-specific options

內建 providers 已經覆蓋常見的 hosted workflow，但 provider URL 往往還是需要一些小差異，例如 `text` 子集或 display 設定。請把這些細節放進 `providerOptions`，讓專案其他部分能專注在字體角色本身。

<<< @/zh-TW/.examples/plugins/fonts-provider-options.ts

## 內建 provider matrix

內建的 hosted provider 名稱如下：

- `google`
- `bunny`
- `fontshare`
- `coollabs`
- `none`

當專案仍然想保留語意化 font tokens 與 generated shortcuts，但不希望 plugin 輸出 hosted import URLs 時，就使用 `none`。這是把字體交回 self-hosted、手動管理 font delivery，或分階段從第三方 provider 遷移出去時最乾淨的交接點。

## Custom providers

當某個 provider 不是內建時，就定義一次 provider，並讓專案其他部分繼續沿用同一套 token model。即使匯入機制是自訂的，這樣仍然能保留語意字體名稱的價值。

<<< @/zh-TW/.examples/plugins/fonts-custom-provider.ts

## 手動 `@font-face` 與本地檔案

Hosted imports 並不是必要條件。如果專案本來就擁有字體檔，plugin 一樣可以註冊本地 faces，並透過相同的 family tokens 暴露出去。

<<< @/zh-TW/.examples/plugins/fonts-font-face.ts

## 一個實用規則

請依照角色命名字體 tokens，不要依照 vendor。`sans`、`mono`、`display` 這類名稱，在重新設計時通常會比暴露第一個 provider 選擇的 token 更耐用。

## Next

- [Typography](/zh-TW/plugins/typography)
- [Configuration](/zh-TW/guide/configuration)
- [Theming And Variables](/zh-TW/patterns/theming-and-variables)
- [Create A Plugin](/zh-TW/plugin-system/create-plugin)
