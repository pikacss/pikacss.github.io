import type { EnginePlugin } from '@pikacss/core'
import { defineEnginePlugin } from '@pikacss/core'

export interface TypographyPluginOptions {
	/** Custom variable overrides */
	variables?: Record<string, string>
}

// Module augmentation
declare module '@pikacss/core' {
	interface EngineConfig {
		typography?: TypographyPluginOptions
	}
}

// Simplified version of @pikacss/plugin-typography
export function typography(): EnginePlugin {
	let typographyConfig: TypographyPluginOptions = {}

	return defineEnginePlugin({
		name: 'typography',

		configureRawConfig: (config) => {
			if (config.typography)
				typographyConfig = config.typography
		},

		configureEngine: async (engine) => {
			// 1. Add CSS variables
			engine.variables.add({
				'--prose-font-size': '1rem',
				'--prose-line-height': '1.75',
				...typographyConfig.variables,
			})

			// 2. Add base prose shortcut
			engine.shortcuts.add([
				'prose',
				{
					fontSize: 'var(--prose-font-size)',
					lineHeight: 'var(--prose-line-height)',
					maxWidth: '65ch',
				},
			])

			// 3. Add size variant shortcuts
			const sizes = {
				sm: { fontSize: '0.875rem', lineHeight: '1.71' },
				lg: { fontSize: '1.125rem', lineHeight: '1.77' },
			}
			for (const [size, overrides] of Object.entries(sizes)) {
				engine.shortcuts.add([
					`prose-${size}`,
					['prose', overrides],
				])
			}
		},
	})
}
