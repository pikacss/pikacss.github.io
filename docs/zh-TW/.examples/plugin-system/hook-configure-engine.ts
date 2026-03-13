import { defineEnginePlugin } from '@pikacss/core'

export const plugin = defineEnginePlugin({
	name: 'example',

	// Async — called after engine is created
	configureEngine: async (engine) => {
		// Add CSS variables
		engine.variables.add({
			'--brand-color': '#0ea5e9',
		})

		// Add shortcuts
		engine.shortcuts.add([
			'flex-center',
			{
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
			},
		])

		// Add custom selectors
		engine.selectors.add(['hover', '$:hover'])

		// Add keyframe animations
		engine.keyframes.add([
			'fade-in',
			{ from: { opacity: '0' }, to: { opacity: '1' } },
			['fade-in 0.3s ease'],
		])

		// Add preflight CSS
		engine.addPreflight('*, *::before, *::after { box-sizing: border-box; }')
	},
})
