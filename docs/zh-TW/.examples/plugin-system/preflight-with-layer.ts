import { defineEnginePlugin } from '@pikacss/core'

export const plugin = defineEnginePlugin({
	name: 'example',
	configureEngine: async (engine) => {
		// 將任何 preflight 包裝在 { layer, preflight } 中以放置於 CSS @layer

		// 放入 layer 的字串 preflight
		engine.addPreflight({
			layer: 'base',
			preflight: 'body { margin: 0; box-sizing: border-box; }',
		})

		// 放入 layer 的 PreflightDefinition
		engine.addPreflight({
			layer: 'base',
			preflight: {
				':root': {
					'--color-primary': '#3b82f6',
				},
			},
		})

		// 放入 layer 的 PreflightFn
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
