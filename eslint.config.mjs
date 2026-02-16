import deviltea from '@deviltea/eslint-config'

export default await deviltea({
	markdown: {
		overrides: {
			'style/indent': ['error', 2],
		},
	},
	ignores: [
		'./docs/.examples/**/*',
	],
})
