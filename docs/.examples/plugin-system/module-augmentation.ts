import type { EnginePlugin } from '@pikacss/core'
import { defineEnginePlugin } from '@pikacss/core'

// Step 1: Define your config type
export interface SpacingConfig {
	/** Base spacing unit in px. @default 4 */
	base?: number
}

// Step 2: Augment EngineConfig so users get autocomplete
declare module '@pikacss/core' {
	interface EngineConfig {
		spacing?: SpacingConfig
	}
}

// Step 3: Read the config in your plugin
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

			// Generate spacing variables
			for (let i = 0; i <= 12; i++) {
				engine.variables.add({
					[`--spacing-${i}`]: `${i * base}px`,
				})
			}

			// Add spacing shortcuts
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
