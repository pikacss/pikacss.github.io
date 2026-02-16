// pika.config.ts
import { defineEngineConfig } from '@pikacss/unplugin-pikacss'

export default defineEngineConfig({
	selectors: {
		selectors: [
			// Static selectors: [name, replacement]
			// Use $ as a placeholder for the atomic style's own selector
			['hover', '$:hover'],
			['focus', '$:focus'],
			['first-child', '$:first-child'],
			['@dark', '[data-theme="dark"] $'],
			['@md', '@media (min-width: 768px)'],
			['@lg', '@media (min-width: 1024px)'],

			// Dynamic selectors: [pattern, resolver, autocomplete?]
			[
				/^@screen-(\d+)$/,
				m => `@media (min-width: ${m[1]}px)`,
				['@screen-640', '@screen-768', '@screen-1024'], // autocomplete hints
			],
		],
	},
})
