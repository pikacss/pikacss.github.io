// Object form for selectors
const selectorExamples = {
	selectors: [
		// Object form — static
		{
			selector: 'hover',
			value: '$:hover',
		},
		// Object form — dynamic
		{
			selector: /^@bp-(\d+)$/,
			value: (m: RegExpMatchArray) => `@media (min-width: ${m[1]}px)`,
			autocomplete: ['@bp-640', '@bp-768', '@bp-1024'],
		},
	],
}
