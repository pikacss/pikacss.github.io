import { defineEnginePlugin } from '@pikacss/core'

export const plugin = defineEnginePlugin({
	name: 'example',

	// 非同步 — 在 config 解析前修改原始 config
	configureRawConfig(config) {
		// 加入預設 preflights
		config.preflights ??= []
		config.preflights.push('/* injected by example plugin */')
		return config
	},

	// 同步 — 讀取最終原始 config（不可修改）
	rawConfigConfigured(config) {
		console.log('Final prefix:', config.prefix)
	},
})
