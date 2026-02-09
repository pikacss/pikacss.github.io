import deviltea from '@deviltea/eslint-config'
import pikaConfig from '@pikacss/eslint-config'
import { pikaModuleAugmentationRule, pikaPackageBoundariesRule } from './.eslint/rules/index.ts'

const baseConfig = await deviltea({
	stylistic: {
		overrides: {
			'style/no-mixed-spaces-and-tabs': 'warn',
		},
	},
	ignores: [
		'.planning/**',
		'.github/skills/**', // Skill documentation with many TypeScript examples

		'docs/llm/**', // LLM-optimized documentation with many code examples
		'docs/advanced/**', // Advanced docs with complex TypeScript examples
		'docs/examples/**', // Example code snippets
		'docs/community/**', // Community documentation
		'docs/getting-started/**', // Getting started guides with examples
		'docs/guide/**', // User guides with code examples
		'docs/integrations/**', // Integration guides with examples
		'AGENTS.md', // Comprehensive guide with many examples
		'skills/**', // Skill documentation
		'.eslint/tests/**', // ESLint rule tests and fixtures
	],
	plugins: {
		pikacss: {
			rules: {
				'pika-package-boundaries': pikaPackageBoundariesRule,
				'pika-module-augmentation': pikaModuleAugmentationRule,
			},
		},
	},
	rules: {
		'pikacss/pika-package-boundaries': 'error',
		'pikacss/pika-module-augmentation': 'error',
	},
})

export default [
	...baseConfig,
	...pikaConfig.configs.recommended,
]
