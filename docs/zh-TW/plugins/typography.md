---
description: 了解 typography plugin 如何替長文內容提供一致的 prose baseline，而不是把 app UI 變成逐標籤覆寫的集合。
---

# Typography

`@pikacss/plugin-typography` 封裝了一套面向內容的 prose system，適用於 PikaCSS。它的設計目標是文章本文、markdown 輸出、文件內容，以及其他以閱讀為主的介面；團隊可以依靠合理的預設值和以 tokens 驅動的自訂，而不是手動替每個標題與段落逐一寫樣式。

## 什麼時候該用它

Typography plugin 適用於：

- 文件頁面
- 部落格文章
- CMS 渲染內容
- 知識庫文章
- 任何主要任務是呈現可讀 prose 的容器

## Install

::: code-group
<<< @/zh-TW/.examples/plugins/typography-install.sh [pnpm]
<<< @/zh-TW/.examples/plugins/typography-install-npm.sh [npm]
<<< @/zh-TW/.examples/plugins/typography-install-yarn.sh [yarn]
:::

## 最小設定

<<< @/zh-TW/.examples/plugins/typography-basic-config.ts

## Usage

<<< @/zh-TW/.examples/plugins/typography-usage-prose.pikainput.ts

當 prose 被視為有自己預設值的內容介面，而不是逃避刻意 component styling 的捷徑時，這個 plugin 才能發揮最佳效果。

## 自訂 variables，而不是手動處理每個 element

<<< @/zh-TW/.examples/plugins/typography-custom-variables.ts

團隊應該在 variable layer 表達語氣與可讀性決策。這樣即使內容來自 markdown、CMS 輸出或多種 frontend frameworks，typography 仍能保持一致。

## 團隊最常在哪裡誤用它

Typography 預設值很適合閱讀型介面，但不適合 dashboards、密集型工具，或高度客製的 application components。

如果一個頁面主要由 cards、controls、data tables 和 layout primitives 組成，就應該停留在一般 component styling。Typography plugin 應該支援 prose，而不是取代介面設計。

## Next

- [Theming And Variables](/zh-TW/patterns/theming-and-variables)
- [Plugin System Overview](/zh-TW/plugin-system/overview)
- [Configuration](/zh-TW/guide/configuration)
- [FAQ](/zh-TW/community/faq)
