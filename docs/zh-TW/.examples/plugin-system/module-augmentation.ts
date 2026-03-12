import type { EnginePlugin } from '@pikacss/core'
import { defineEnginePlugin } from '@pikacss/core'

export interface SpacingConfig {
	base?: number
}

declare module '@pikacss/core' {
	interface EngineConfig {
		spacing?: SpacingConfig
	}
}

export function spacingPlugin(): EnginePlugin {
	let spacingConfig: SpacingConfig = {}

	return defineEnginePlugin({
		name: 'spacing',

		configureRawConfig(config) {
			if (config.spacing)
				spacingConfig = config.spacing
		},

		configureEngine: async (engine) => {
			const base = spacingConfig.base ?? 4

			for (let i = 0; i <= 12; i++) {
				engine.variables.add({
					[`--spacing-${i}`]: `${i * base}px`,
				})
			}

			for (let i = 0; i <= 12; i++) {
				engine.shortcuts.add([
					`p-${i}`,
					{ padding: `var(--spacing-${i})` },
				])
				engine.shortcuts.add([
					`m-${i}`,
					{ margin: `var(--spacing-${i})` },
				])
			}
		},
	})
}
