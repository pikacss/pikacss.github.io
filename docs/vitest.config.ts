import { defineProject } from 'vitest/config'

export default defineProject({
	test: {
		name: 'docs-examples',
		include: ['.examples/**/*.test.ts'],
	},
})
