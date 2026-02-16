/// <reference path="./pika.gen.ts" />
import { defineEngineConfig } from '@pikacss/unplugin-pikacss'

export default defineEngineConfig({
	// Add a prefix to all generated class names
	prefix: 'pk-',

	// Custom selectors for responsive design
	selectors: {
		selectors: [
			['hover', '$:hover'],
			[/^screen-(\d+)$/, m => `@media (min-width: ${m[1]}px)`, ['screen-768', 'screen-1024']],
		],
	},

	// Reusable style shortcuts
	shortcuts: {
		shortcuts: [
			['flex-center', {
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
			}],
		],
	},

	// CSS custom properties
	variables: {
		variables: {
			'--color-primary': '#3b82f6',
			'--color-bg': '#ffffff',
		},
	},
})
