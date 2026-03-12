import type { Engine, EngineConfig } from '@pikacss/core'
import { defineEnginePlugin } from '@pikacss/core'

// 所有 hooks 均可選 — 只需實作 plugin 所需的部分。
// Hook 參數型別會從 EnginePlugin 介面自動推導。
export default defineEnginePlugin({
	name: 'example-plugin',
	order: 'pre',
	configureRawConfig(config: EngineConfig) { /* 在預設值確定前整形原始 config */ },
	configureResolvedConfig(resolvedConfig) { /* 回應最終已解析的 config */ },
	configureEngine(engine: Engine) { /* 呼叫公開的 engine API */ },
	transformSelectors(selectors) { /* 過濾或修改 selector 清單 */ },
	transformStyleItems(styleItems) { /* 映射或過濾提取的 style items */ },
	transformStyleDefinitions(styleDefinitions) { /* 映射或過濾 style definitions */ },
	rawConfigConfigured(config) { /* 讀取原始 config — 不可修改 */ },
	preflightUpdated() { /* 回應 preflight 變更 */ },
	atomicStyleAdded(atomicStyle) { /* 觀察已註冊的 atomic rules */ },
	autocompleteConfigUpdated() { /* 回應 autocomplete config 變更 */ },
})
