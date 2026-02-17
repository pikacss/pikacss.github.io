import { plugin } from '@pikacss/eslint-config'

export default [
	{
		plugins: { pikacss: plugin },
		rules: {
			'pikacss/no-dynamic-args': 'error',
		},
	},
]
