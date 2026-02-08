import type { Linter } from 'eslint'
import { plugin } from '../plugin'

const recommended: Linter.Config[] = [
	{
		name: 'pika/recommended',
		plugins: {
			pika: plugin,
		},
		rules: {
			'pika/pika-build-time': 'error',
		},
	},
]

export default recommended
