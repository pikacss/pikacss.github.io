import { defineEngineConfig } from '@pikacss/core'

export default defineEngineConfig({
	autocomplete: {
		shortcuts: ['surface-card', 'eyebrow-label'],
		extraProperties: ['variant'],
		properties: {
			variant: ['"filled"', '"outline"'],
		},
		patterns: {
			selectors: ['screen-${number}'],
			shortcuts: ['icon-${string}', 'col-span-${number}'],
		},
	},
})
