---
description: 了解 plugin hooks 的執行順序、payload 如何往後傳遞，以及如何選擇侵入性最低但仍足以解決問題的 hook。
---

# Hook Execution

如果你只保留一條 plugin authoring 規則，請保留這條：選擇仍然能提供所需控制力的最晚 hook。越晚的 hook 通常越能保留 engine 的保證、越少干擾其他 plugins，也更容易在長 plugin 鏈裡推理其行為。

## Hook 決策表

| 需求 | Hook |
| --- | --- |
| 在 defaults 套用前修改 user config | `configureRawConfig` |
| 在 config resolved 後做出反應 | `configureResolvedConfig` |
| 透過公開 API 註冊 engine 行為 | `configureEngine` |
| 直接改寫 selector chains | `transformSelectors` |
| 改寫抽出的 style items | `transformStyleItems` |
| 改寫巢狀 style definitions | `transformStyleDefinitions` |
| 只觀察 engine events | sync notification hooks |

## Payload chaining

Async hooks 可以回傳新的 payload，而回傳值會成為按順序執行的下一個 plugin 的輸入。

<<< @/zh-TW/.examples/plugin-system/overview-async-hook.ts

這個行為很有用，但也代表以 transforms 為主的 plugins 應該保持節制。後面的 plugins 看到的是你回傳後的形狀，而不是原始輸入。

## Error isolation

Hook 失敗會被攔截並記錄，避免單一壞掉的 plugin 自動拖垮整條 pipeline。這讓 engine 更有韌性，但也代表如果沒有人檢查 logs，plugin 可能會悄悄失敗。

當某個行為意外消失時，請先看 logs，不要先假設是 engine 忽略了你的 plugin。

## Notification hooks 是拿來觀察的

Notification hooks 的用途是副作用、儀表化，以及對 engine 更新做出反應。它們適合放 bookkeeping、診斷資訊，以及不該修改主要 payload 的整合膠水層。

<<< @/zh-TW/.examples/plugin-system/hook-notifications.ts

## Sync 與 async hooks 的差異

Transform hooks 是 async 的，因為它們修改共享的 payload，engine 必須等每個 plugin 完成後，下一個才能開始。回傳值就是下一個 plugin 接收到的輸入。

Notification hooks 是 sync 的，因為它們只做觀察。沒有 payload 需要往後傳遞。從 notification hook 回傳值不會對 engine 狀態產生任何效果。

實務上的影響：

- 如果你需要改變 engine 輸出的內容，使用 transform hook 並回傳修改後的 payload。
- 如果你只需要記錄、測量或對某個事件做出反應，使用 sync notification hook。
- 不要試圖在 notification hook 裡改變 engine 行為——回傳值會被靜默忽略。

## Payload chaining 與下游安全性

當 transform hook 回傳修改後的 payload，鏈中後續的 plugins 收到的是那個修改後的形狀，而非原始內容。如果某個 plugin 移除了 selectors、重新命名 style items 或過濾 definitions，在它之後執行的每個 plugin 都只能看到那個縮減後的集合。

<<< @/zh-TW/.examples/plugin-system/payload-chaining-example.ts

::: warning 永遠回傳完整的 payload
在 plugin 名稱或 README 中沒有記錄契約的情況下過濾 payload，可能會靜默破壞下游 plugins。如果你的 transform 移除了項目，請記錄移除的內容與原因。需要那些項目的下游 plugins 應該使用 `order: 'pre'` 在過濾 plugin 之前執行。
:::

## 給 plugin authors 的實用規則

先偏向使用 `configureEngine`，只有在公開 engine API 已經不夠時，才往更早或更深的 hooks 移動。光是維持這個習慣，就能讓很多 plugins 更小、更容易組合。

## 當你的 plugin 靜默失效時如何除錯

如果 plugin 已載入但似乎什麼都沒做，按照這些步驟依序排查：

1. **確認 plugin 在 `plugins` array 裡。** 安裝在 `package.json` 但沒有加進 `pika.config.ts` 的 `plugins` 裡的 plugin 永遠不會執行。打印完整 config 來確認。
2. **在每個 hook 的最頂端加上 `console.log`。** 如果 log 從未出現，表示 hook 沒有被呼叫。請確認排序——`post` plugin 在所有預設 plugins 之後執行，這對某些 transforms 來說可能已經太晚。
3. **檢查 build 輸出裡的錯誤訊息。** Hook 失敗會被攔截並記錄。錯誤訊息會指出 plugin 名稱和失敗的 hook。
4. **確認你使用的 hook 接收到你預期的輸入。** 在函式開頭記錄 hook 的第一個 argument。如果輸入是空的或已經被過濾，可能是鏈中更早的 plugin 移除了你的 plugin 需要的項目。
5. **使用 `configureEngine` 確認 engine 收到了 plugin。** `configureEngine` hook 在每次 engine 初始化時觸發一次。如果這個 hook 有 log 但你的 transform hooks 沒有，問題就出在 transform hooks 本身。

請參考 [Common Problems](/zh-TW/troubleshooting/common-problems) 了解更多 plugin 專屬場景。

## Next

- [Create A Plugin](/zh-TW/plugin-system/create-plugin)
- [Core Features Overview](/zh-TW/guide/core-features-overview)
- [FAQ](/zh-TW/community/faq)
