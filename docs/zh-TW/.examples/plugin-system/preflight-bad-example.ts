import { defineEnginePlugin } from '@pikacss/core'

// ❌ wrong — component-level styles in a preflight
// Preflights run before any component styles and apply globally to every page.
// Placing component-specific or page-specific rules here will cause unexpected
// visual regressions in unrelated parts of the app.
export const wrongPlugin = defineEnginePlugin({
	name: 'wrong-preflight-example',
	configureEngine: async (engine) => {
		engine.addPreflight({
			// ❌ This applies globally — not scoped to any component or page
			'.button': {
				backgroundColor: 'blue',
				color: 'white',
				borderRadius: '4px',
			},
		})
	},
})

// ✅ correct — global resets and base rules belong in preflights
export const correctPlugin = defineEnginePlugin({
	name: 'correct-preflight-example',
	configureEngine: async (engine) => {
		engine.addPreflight({
			// ✅ Universal base rules with no component scope
			'*, *::before, *::after': {
				boxSizing: 'border-box',
			},
			'body': {
				margin: '0',
				fontFamily: 'system-ui, sans-serif',
			},
		})
	},
})
