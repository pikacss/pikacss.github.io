import { pikaBuildTime } from './rules/pika-build-time'

const plugin = {
	meta: {
		name: '@pikacss/eslint-config',
		version: '0.0.40',
	},
	rules: {
		'pika-build-time': pikaBuildTime,
	},
}

export default plugin
