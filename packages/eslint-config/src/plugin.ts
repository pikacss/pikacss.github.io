import { pikaBuildTime } from './rules/pika-build-time'

export const plugin = {
	meta: {
		name: '@pikacss/eslint-plugin',
		version: '0.0.40',
	},
	rules: {
		'pika-build-time': pikaBuildTime,
	},
}
