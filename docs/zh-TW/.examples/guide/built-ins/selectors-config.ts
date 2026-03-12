import { defineEngineConfig } from '@pikacss/core'

export default defineEngineConfig({
	selectors: {
		selectors: [
			'my-selector',
			['hover', '$:hover'],
			['focus', '$:focus'],
			['first-child', '$:first-child'],
			['dark', '[data-theme="dark"] $'],
			['md', '@media (min-width: 768px)'],
			['lg', '@media (min-width: 1024px)'],
			[
				/^screen-(\d+)$/,
				m => `@media (min-width: ${m[1]}px)`,
				['screen-640', 'screen-768', 'screen-1024'],
			],
			{
				selector: 'active',
				value: '$:active',
			},
		],
	},
})
