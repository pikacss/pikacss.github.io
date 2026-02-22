import { defineEnginePlugin } from '@pikacss/core'

export const plugin = defineEnginePlugin({
	name: 'example',
	configureEngine: async (engine) => {
		// Wrap any preflight variant with { layer, preflight } to place it inside a CSS @layer

		// String preflight inside a layer
		engine.addPreflight({
			layer: 'base',
			preflight: 'body { margin: 0; box-sizing: border-box; }',
		})

		// PreflightDefinition inside a layer
		engine.addPreflight({
			layer: 'base',
			preflight: {
				':root': {
					'--color-primary': '#3b82f6',
				},
			},
		})

		// PreflightFn inside a layer
		engine.addPreflight({
			layer: 'base',
			preflight: (engine, isFormatted) => {
				return isFormatted
					? '* {\n  box-sizing: border-box;\n}'
					: '*{box-sizing:border-box}'
			},
		})
	},
})
