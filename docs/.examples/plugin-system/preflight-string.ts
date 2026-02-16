import { defineEnginePlugin } from '@pikacss/core'

export const plugin = defineEnginePlugin({
	name: 'example',
	configureEngine: async (engine) => {
		// String preflight — raw CSS injected as-is
		engine.addPreflight(`
      *, *::before, *::after {
        box-sizing: border-box;
      }
      body {
        margin: 0;
        line-height: 1.5;
      }
    `)
	},
})
