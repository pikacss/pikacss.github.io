import { defineEnginePlugin } from '@pikacss/core'

// Plugin A：轉換 selectors——篩掉所有名為 'internal' 的 selector
export const pluginA = defineEnginePlugin({
	name: 'plugin-a',
	transformSelectors(selectors) {
		// ❌ 有風險——靜默刪除 selectors 卻沒有記錄契約
		return selectors.filter(s => s !== 'internal')
	},
})

// Plugin B：依賴完整的 selector 清單——當 Plugin A 篩掉項目後會靜默失效
export const pluginB = defineEnginePlugin({
	name: 'plugin-b',
	order: 'post', // 在 Plugin A 之後執行
	transformSelectors(selectors) {
		// Plugin B 預期 'internal' 仍然存在。
		// 因為 Plugin A 移除了它，這段邏輯會靜默地什麼都不做。
		const internal = selectors.find(s => s === 'internal')
		if (!internal) {
			// 沒有錯誤，沒有警告——Plugin B 就這樣跳過它的工作。
			return selectors
		}
		return selectors.map(s => (s === 'internal' ? 'scoped-internal' : s))
	},
})

// ✅ 較安全的 Plugin A：在 plugin 名稱中記錄篩選契約，並回傳完整 payload
export const saferPluginA = defineEnginePlugin({
	name: 'plugin-a-no-internal-selectors',
	transformSelectors(selectors) {
		// 記錄契約：這個 plugin 刻意移除 'internal'。
		// 需要 'internal' 的下游 plugins 必須先行執行（使用 order: 'pre'）。
		return selectors.filter(s => s !== 'internal')
	},
})
