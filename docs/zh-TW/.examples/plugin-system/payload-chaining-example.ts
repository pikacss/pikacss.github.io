import { defineEnginePlugin } from '@pikacss/core'

// Plugin A: transforms selectors — filters out any selector named 'internal'
export const pluginA = defineEnginePlugin({
	name: 'plugin-a',
	transformSelectors(selectors) {
		// ❌ risky — silently drops selectors without documenting the contract
		return selectors.filter(s => s !== 'internal')
	},
})

// Plugin B: depends on the full selector list — breaks silently when Plugin A filters it
export const pluginB = defineEnginePlugin({
	name: 'plugin-b',
	order: 'post', // runs after Plugin A
	transformSelectors(selectors) {
		// Plugin B expects 'internal' to still be present.
		// Because Plugin A removed it, this logic silently does nothing.
		const internal = selectors.find(s => s === 'internal')
		if (!internal) {
			// No error, no warning — Plugin B just skips its work.
			return selectors
		}
		return selectors.map(s => (s === 'internal' ? 'scoped-internal' : s))
	},
})

// ✅ safer Plugin A: documents the filtering contract in the plugin name and returns complete payload
export const saferPluginA = defineEnginePlugin({
	name: 'plugin-a-no-internal-selectors',
	transformSelectors(selectors) {
		// Document the contract: this plugin deliberately removes 'internal'.
		// Downstream plugins that need 'internal' must run before this plugin (use order: 'pre').
		return selectors.filter(s => s !== 'internal')
	},
})
