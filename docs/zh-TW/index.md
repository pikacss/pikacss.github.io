---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: "PikaCSS"
  text: "Instant on-demand Atomic CSS-in-JS"
  tagline: 使用熟悉的 CSS-in-JS 語法撰寫樣式，享有完整的 TypeScript 自動補齊，並在建置時期編譯為最佳化的原子化 CSS — 零執行期負擔。
  image:
    src: /logo-white.svg
    alt: PikaCSS 標誌
  actions:
    - theme: brand
      text: 開始使用
      link: /zh-TW/getting-started/what-is-pikacss
    - theme: alt
      text: 探索整合方式
      link: /zh-TW/integrations/overview

features:
  - icon: ⚡
    title: 零執行期
    details: 所有樣式處理均在建置時期完成。正式環境的打包產物只包含純粹的 class 名稱字串與靜態 CSS 檔案 — 無任何執行期負擔。
  - icon: 🧩
    title: 原子化 CSS 輸出
    details: 每個 CSS 屬性值對都會成為獨立且可重複使用的原子化 class。相同的樣式會自動去重複化，讓 CSS 大小保持最小。
  - icon: ⚙️
    title: 預設零設定
    details: 以合理的預設值開箱即用。PikaCSS 會在需要時自動探索或建立設定檔 — 無需任何樣板程式碼。
  - icon: 🧠
    title: 靜態可分析性優先
    details: 樣式引數在建置時期透過 `new Function(...)` 進行求值，因此必須是靜態可分析的。無需學習任何自訂語法。
  - icon: 🤖
    title: TypeScript 自動補齊
    details: 完整型別化的樣式撰寫體驗，並附有產生的自動補齊支援。CSS 屬性、值、選擇器以及插件定義的 token 全都具備型別安全。
  - icon: 🔌
    title: 通用建置工具支援
    details: 透過 `@pikacss/unplugin-pikacss`，一套引擎支援 Vite、Rollup、Webpack、esbuild、Rspack、Rolldown 與 Nuxt。
  - icon: 🎨
    title: 巢狀選擇器與變體
    details: 在樣式定義中行內支援偽類別、偽元素、媒體查詢以及自訂選擇器。
  - icon: 🧰
    title: 可擴充的插件系統
    details: 5 個內建插件（variables、keyframes、selectors、shortcuts、important）加上用於圖示、CSS 重置與排版的外部插件。
---
