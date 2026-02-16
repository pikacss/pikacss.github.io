import { defineEnginePlugin } from '@pikacss/core'

export const plugin = defineEnginePlugin({
	name: 'example',
	configureEngine: async (engine) => {
		// PreflightFn — dynamic preflight that reads engine state
		engine.addPreflight((engine, isFormatted) => {
			const vars = Array.from(engine.variables.store.entries())
			const css = vars
				.map(([name, list]) =>
					list.map(v => `${name}: ${v.value};`)
						.join(
							isFormatted ? '\n  ' : '',
						),
				)
				.join(isFormatted ? '\n  ' : '')

			return isFormatted
				? `:root {\n  ${css}\n}`
				: `:root{${css}}`
		})
	},
})
