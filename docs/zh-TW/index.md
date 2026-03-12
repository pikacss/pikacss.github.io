---
layout: home
description: 先判斷 PikaCSS 是否適合靜態 styling workflow，再從限制一路進到第一個成功的 build-time 設定。

hero:
  name: PikaCSS
  text: 給想保留 CSS 結構、同時交付靜態輸出的團隊的 build-time atomic CSS-in-JS
  tagline: 在 TypeScript 中撰寫 style objects，讓 build 抽出 class names 與 CSS，並在一般 atomic 系統常常沖淡局部意圖的地方，仍然保有可預測的重疊宣告行為。
  image:
    src: /logo-white.svg
    alt: PikaCSS logo
  actions:
    - theme: brand
      text: 評估適配性
      link: /zh-TW/getting-started/what-is-pikacss
    - theme: alt
      text: 開始設定
      link: /zh-TW/getting-started/installation
    - theme: alt
      text: 查看核心功能
      link: /zh-TW/guide/core-features-overview

features:
  - icon: ⚙️
    title: CSS-in-JS 撰寫方式，靜態交付
    details: 在 JavaScript 或 TypeScript 中撰寫 style objects，最後交付的是產生的 atomic CSS，而不是用戶端 styling runtime。
  - icon: 🧠
    title: 以靜態契約為前提
    details: PikaCSS 只接受 build 能預先讀懂的原始碼。這條邊界讓 generated files、autocomplete 與 zero runtime styling 成本成為可能。
  - icon: 🧩
    title: 保留 CSS 概念
    details: 你可以使用 variables、selectors、shortcuts、keyframes、preflights 與 layers，不必從 CSS 規則切換成 utility 命名遊戲。
  - icon: 🔌
    title: 一套 engine，多種 integrations
    details: 從 Vite、Nuxt、Rollup、Webpack、Rspack、Rolldown 到 esbuild 都能開始使用，而且不需要改變團隊撰寫樣式的方式。
  - icon: 🛠️
    title: 透過公開 hooks 擴充
    details: 你可以用同一套 engine plugin model 擴充 selectors、shortcuts、variables、keyframes、preflights 與 autocomplete。
  - icon: 📚
    title: 先安排讀者路徑，而不是堆滿功能
    details: 文件的安排是先幫團隊判斷是否適合、完成一條可運作的設定，再用正確的 mental model 擴展使用方式。

---

## 先理解 engine 的邊界，不要先看 API 表面

如果你的團隊想要 CSS-in-JS 的撰寫體驗，同時願意把 style 輸入維持在靜態、build-time 的邊界內，PikaCSS 會特別適合。這個 engine 不是要讓任意 JavaScript styling logic 之後再來想辦法加速，而是要在應用程式執行前，把已知的原始碼輸入轉成 generated CSS。

這件事影響的不只是 bundle 大小。PikaCSS 依然會去重 atomic declarations，但它也會追蹤哪些重疊情況會讓重用變得不安全。後面寫下的局部意圖可以保留在局部，而不是被剛好較晚落到 stylesheet 的共享 utility 蓋掉。

如果你的專案能接受這個取捨，你會從同一套模型得到靜態 CSS 輸出、generated files 與更強的 autocomplete。如果你的專案依賴從 live runtime 資料動態組出 style objects，就應該及早排除 PikaCSS。

::: warning 建議先讀
不要跳過 [靜態限制](/zh-TW/getting-started/static-arguments)。很多人第一次誤解 PikaCSS，都是因為先把 `pika()` 當成 runtime function 來理解。
:::

## 建議照這個順序閱讀

1. 先讀 [PikaCSS 是什麼？](/zh-TW/getting-started/what-is-pikacss)、[靜態限制](/zh-TW/getting-started/static-arguments)、[PikaCSS 如何運作](/zh-TW/concepts/how-pikacss-works) 與 [Atomic 順序與 Cascade](/zh-TW/concepts/atomic-order-and-cascade)，再判斷這個工具是否適合。
2. 再前往 [安裝](/zh-TW/getting-started/installation)、[First Pika](/zh-TW/getting-started/first-pika) 與 [Generated Files](/zh-TW/guide/generated-files)，把一條 build-time 流程完整跑通一次。
3. 在 onboarding 期間就加入 [ESLint](/zh-TW/integrations/eslint)，讓不合法的 `pika()` 用法在編輯器內被攔下來，而不是之後才擴散到整個 codebase。
4. 在每個 component 開始各自發明慣例之前，先統一 [Configuration](/zh-TW/guide/configuration) 與 [核心功能總覽](/zh-TW/guide/core-features-overview)。先從 [Selectors](/zh-TW/guide/core-features/selectors) 和 [Variables](/zh-TW/guide/core-features/variables) 開始，再加入 [Shortcuts](/zh-TW/guide/core-features/shortcuts)。只有在團隊有明確需求時，才引入 [Keyframes](/zh-TW/guide/core-features/keyframes) 和 [Important](/zh-TW/guide/core-features/important)。
5. 之後再用 [Component Styling](/zh-TW/patterns/component-styling)、[Dynamic Values With CSS Variables](/zh-TW/patterns/dynamic-values-with-css-variables) 與 [Theming And Variables](/zh-TW/patterns/theming-and-variables) 這些會在正式專案裡反覆出現的模式。
6. 當團隊規模擴大時，重新審視 [Configuration](/zh-TW/guide/configuration) 以鎖定共享慣例。依靠 [ESLint](/zh-TW/integrations/eslint) 與 [Common Problems](/zh-TW/troubleshooting/common-problems) 來防止新開發者加入後的用法偏差。

## 給 plugin authors

主要文件路徑刻意先服務採用者。如果你的目的是擴充 engine，而不只是使用它，在理解核心 engine model 之後，可以直接跳到 [Plugin System Overview](/zh-TW/plugin-system/overview)。

## Next

- [PikaCSS 是什麼？](/zh-TW/getting-started/what-is-pikacss)
- [安裝](/zh-TW/getting-started/installation)
- [核心功能總覽](/zh-TW/guide/core-features-overview)
- [Plugin System Overview](/zh-TW/plugin-system/overview)
