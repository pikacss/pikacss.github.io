// pika.config.ts
import { defineEngineConfig } from '@pikacss/core'

export default defineEngineConfig({
	selectors: {
		selectors: [
			// String form — autocomplete only
			'my-selector',

			// Static selectors
			['hover', '$:hover'],
			['focus', '$:focus'],
			['first-child', '$:first-child'],
			['dark', '[data-theme="dark"] $'],
			['md', '@media (min-width: 768px)'],
			['lg', '@media (min-width: 1024px)'],

			// Dynamic selectors
			[
				/^screen-(\d+)$/,
				m => `@media (min-width: ${m[1]}px)`,
				['screen-640', 'screen-768', 'screen-1024'],
			],

			// Object form
			{
				selector: 'active',
				value: '$:active',
			},
		],
	},
})
