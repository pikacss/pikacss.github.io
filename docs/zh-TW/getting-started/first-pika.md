---
description: 建立一條最小可成功的 PikaCSS 流程、檢查產生的 CSS，並在擴大使用前把 build-time 模型具體化。
---

# First Pika

這一頁的目標很簡單：先讓一條 `pika()` 流程成功跑通、檢查輸出，並在擴大使用前把 build-time 模型具體化。

## 1. 匯入 virtual CSS module

先在應用程式的 entry 匯入 virtual CSS module：

<<< @/zh-TW/.examples/getting-started/first-pika-entry.ts

## 2. 寫一個靜態 style block

這是最小但已經有用的 `pika()` 呼叫：

<<< @/zh-TW/.examples/getting-started/first-pika-basic.pikainput.ts

如果你使用的是 Vue，同樣的概念可以寫成這樣：

<<< @/zh-TW/.examples/getting-started/first-pika-basic-vue.pikainput.vue

## 3. 看看產生的結果

PikaCSS 不會在 runtime 保留這個 object。integration 會把它轉成 atomic class names，並在 build 期間輸出 CSS。

<<< @/zh-TW/.examples/getting-started/first-pika-basic.pikaoutput.css

至少在一開始檢查一次 generated CSS。這會讓後面的文件讀起來像工程細節，而不是行銷用語。

## 4. 用多個 arguments 做 composition

你可以用多個 `pika()` arguments，把穩定的結構和局部意圖拆開。

<<< @/zh-TW/.examples/getting-started/first-pika-multiple-args.pikainput.vue

這種 composition 模式，比把所有關注點都塞進同一個巨大 object 更容易擴展。

## 5. 使用最適合呼叫位置的輸出形式

請使用最符合 framework 與實際消費 class names 位置的輸出形式。

<<< @/zh-TW/.examples/getting-started/first-pika-variants.pikainput.ts

## 6. 把狀態與 at-rules 留在靜態輸入內

當你要加入 pseudo states 或 at-rules 時，不需要離開 style object。

<<< @/zh-TW/.examples/getting-started/first-pika-nested.pikainput.vue

<<< @/zh-TW/.examples/getting-started/first-pika-nested.pikaoutput.css

## 繼續往下之前要確認的事

- app entry 已經匯入 `pika.css`。
- 至少有一個字面值 `pika()` 呼叫成功被轉換。
- 你已經至少檢查過一次 generated CSS。
- 你理解 selectors 和 composition 都應該留在靜態 style 輸入裡。

## 實務上的該做與不該做

| 該做 | 不該做 |
| --- | --- |
| 先從字面值 objects 和簡單組合開始。 | 一開始就塞進 dynamic expressions，之後再回頭 debug build 失敗。 |
| 至少檢查一次產生的 CSS，讓整個模型更具體。 | 把 `pika()` 當成會讀取目前 state 的 runtime helper。 |
| 用多個 arguments 分開 base styles 和 overrides。 | 把每個 variant 分支都塞進同一個超大的 style object。 |

## Next

- [Generated Files](/zh-TW/guide/generated-files)
- [靜態限制](/zh-TW/getting-started/static-arguments)
- [PikaCSS 如何運作](/zh-TW/concepts/how-pikacss-works)
- [Component Styling](/zh-TW/patterns/component-styling)
