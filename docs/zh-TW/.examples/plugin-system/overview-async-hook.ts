import { defineEnginePlugin } from '@pikacss/core'

export const asyncHookPlugin = defineEnginePlugin({
	name: 'async-hook-example',

	// 非同步 hook：在 config 解析前修改原始 config。
	// 回傳修改後的 config 以傳給下一個 plugin，
	// 或回傳 void/undefined 以保留目前的值。
	configureRawConfig(config) {
		config.prefix = 'pk-'
		return config
	},

	// 非同步 hook：在樣式提取期間轉換 selectors。
	// 回傳的陣列會取代輸入，傳給下一個 plugin。
	transformSelectors(selectors) {
		return selectors.map(s => s.replace('$hover', '&:hover'))
	},
})
