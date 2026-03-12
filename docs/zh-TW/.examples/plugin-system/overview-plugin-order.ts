import { defineEnginePlugin } from '@pikacss/core'

export const earlyPlugin = defineEnginePlugin({
	name: 'early-plugin',
	order: 'pre',
	configureRawConfig(config) {
		return config
	},
})

export const normalPlugin = defineEnginePlugin({
	name: 'normal-plugin',
	configureRawConfig(config) {
		return config
	},
})

export const latePlugin = defineEnginePlugin({
	name: 'late-plugin',
	order: 'post',
	configureRawConfig(config) {
		return config
	},
})
