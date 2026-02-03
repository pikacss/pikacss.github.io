import deviltea from '@deviltea/eslint-config'
import { pikaBuildTimeRule, pikaModuleAugmentationRule, pikaPackageBoundariesRule } from './.eslint/rules/index.ts'

export default await deviltea({
	stylistic: {
		overrides: {
			'style/no-mixed-spaces-and-tabs': 'warn',
		},
	},
	ignores: [
		'.planning/**',
	],
	plugins: {
		pikacss: {
			rules: {
				'pika-build-time': pikaBuildTimeRule,
				'pika-package-boundaries': pikaPackageBoundariesRule,
				'pika-module-augmentation': pikaModuleAugmentationRule,
			},
		},
	},
	rules: {
		'pikacss/pika-build-time': 'error',
		'pikacss/pika-package-boundaries': 'error',
		'pikacss/pika-module-augmentation': 'error',
	},
})
