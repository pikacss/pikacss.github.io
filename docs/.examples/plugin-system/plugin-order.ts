import { defineEnginePlugin } from '@pikacss/core'

// Runs before default-order plugins
export const earlyPlugin = defineEnginePlugin({
	name: 'early',
	order: 'pre',
})

// Runs in default order (no `order` specified)
export const normalPlugin = defineEnginePlugin({
	name: 'normal',
})

// Runs after default-order plugins
export const latePlugin = defineEnginePlugin({
	name: 'late',
	order: 'post',
})
