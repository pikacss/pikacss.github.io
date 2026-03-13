import { defineEnginePlugin } from '@pikacss/core'

export const plugin = defineEnginePlugin({
	name: 'example',

	// Async — modify resolved config before engine creation
	configureResolvedConfig(resolvedConfig) {
		// Override the prefix in resolved config
		resolvedConfig.prefix = 'x-'
		return resolvedConfig
	},
})
