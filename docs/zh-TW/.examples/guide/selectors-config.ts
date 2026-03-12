import { defineEngineConfig } from '@pikacss/core'

export default defineEngineConfig({
	selectors: {
		selectors: [
			['hover', '$:hover'],
			['focus-visible', '$:focus-visible'],
			['theme-dark', '[data-theme="dark"] $'],
			['screen-md', '@media (min-width: 768px)'],
			['screen-lg', '@media (min-width: 1024px)'],
			[
				/^screen-(\d+)$/,
				m => `@media (min-width: ${m[1]}px)`,
				['screen-640', 'screen-768', 'screen-1200'],
			],
		],
	},
})
