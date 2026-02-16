import type { EnginePlugin } from '@pikacss/core'
import { defineEnginePlugin } from '@pikacss/core'

export interface GreetingPluginOptions {
	/** The greeting prefix. @default 'Hello' */
	prefix?: string
}

export function greetingPlugin(
	options: GreetingPluginOptions = {},
): EnginePlugin {
	const { prefix = 'Hello' } = options

	return defineEnginePlugin({
		name: 'greeting',
		configureEngine: async (engine) => {
			// Use options to customize plugin behavior
			engine.addPreflight(
				`/* ${prefix} from greeting plugin */`,
			)
		},
	})
}
