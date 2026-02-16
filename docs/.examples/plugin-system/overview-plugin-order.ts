import { defineEnginePlugin } from '@pikacss/core'

// Runs first (order: 'pre' → priority 0)
export const earlyPlugin = defineEnginePlugin({
	name: 'early-plugin',
	order: 'pre',
	configureRawConfig(config) {
		// Runs before default and post plugins
		return config
	},
})

// Runs second (order: undefined → priority 1)
export const normalPlugin = defineEnginePlugin({
	name: 'normal-plugin',
	// order is omitted — defaults to normal priority
	configureRawConfig(config) {
		return config
	},
})

// Runs last (order: 'post' → priority 2)
export const latePlugin = defineEnginePlugin({
	name: 'late-plugin',
	order: 'post',
	configureRawConfig(config) {
		// Runs after pre and default plugins
		return config
	},
})
