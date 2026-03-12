---
description: 了解 reset plugin 何時有用、如何安裝，以及如何把 reset 規則和專案設計決策分開。
---

# Reset

`@pikacss/plugin-reset` 替 PikaCSS 專案提供一個在 build-time 定義全域 reset 行為的位置。這個 plugin 讓基礎正規化和 engine 其他部分共用同一個 config 介面，團隊也能把 reset 決策和 selectors、variables 及其他 plugins 放在一起審查。

## 什麼時候該用它

當專案需要先對瀏覽器預設行為給出一套共享答案，再開始做 component styling 時，就應該使用 reset plugin。這通常特別適合 design systems、產品套件、行銷網站，以及希望多個頁面共用同一個 baseline 的文件平台。

如果產品本來就已經有一套刻意設計過的 baseline，就應該減少 reset 程式碼。Reset 的工作是移除預設值的不一致，不是默默變成第二層主題。

## Install

::: code-group
<<< @/zh-TW/.examples/plugins/reset-install.sh [pnpm]
<<< @/zh-TW/.examples/plugins/reset-install-npm.sh [npm]
<<< @/zh-TW/.examples/plugins/reset-install-yarn.sh [yarn]
:::

## 最小設定

<<< @/zh-TW/.examples/plugins/reset-basic-usage.ts

這是大多數團隊都該採用的起點。先挑一個 preset、註冊 plugin，只有在重複遇到瀏覽器預設差異、而且已經開始拖慢實際工作時，再往上加規則。

## 可用 presets

<<< @/zh-TW/.examples/plugins/reset-all-presets.ts

這些 preset 名稱反映了不同的 reset 哲學。`modern-normalize` 通常是最安全的預設值，因為它會做正規化，但不會過度重塑每個元素。

## Reset 什麼時候有幫助，什麼時候反而有害

Reset 程式碼應該放在瀏覽器預設值和你自己系統預設值之間的邊界。當團隊一再遇到相同的 margin、list 或表單控制項差異時，它很有幫助。當不相干的品牌決策開始被塞進全域 baseline 時，它就會開始造成傷害。

::: warning 讓 reset 輸出保持單純
如果 reset 開始決定 typography 階層、component spacing，或 application layout 規則，那它就在做錯工作。請把這些決策移到 variables、shortcuts 或 component styles。
:::

## 自訂 preset 範例

<<< @/zh-TW/.examples/plugins/reset-custom-preset.ts

最常見的自訂模式是組合。保留官方 preset，再額外加上一小段專案專用的 preflight，補上產品真正需要的少數規則即可。

## 一個實用規則

讓 reset layer 保持精簡，精簡到你在 code review 裡能解釋每一條規則。某條規則如果只是為了讓單一 component 看起來正確，它多半就不該放在 reset layer。

## Next

- [Typography](/zh-TW/plugins/typography)
- [Configuration](/zh-TW/guide/configuration)
- [Create A Plugin](/zh-TW/plugin-system/create-plugin)
- [Common Problems](/zh-TW/troubleshooting/common-problems)
