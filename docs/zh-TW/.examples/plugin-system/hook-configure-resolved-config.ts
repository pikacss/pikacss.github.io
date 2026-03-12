import { defineEnginePlugin } from '@pikacss/core'

export const plugin = defineEnginePlugin({
	name: 'example',

	// 非同步 — 在 engine 建立前修改已解析的 config
	configureResolvedConfig(resolvedConfig) {
		// 覆寫已解析 config 中的 prefix
		resolvedConfig.prefix = 'x-'
		return resolvedConfig
	},
})
