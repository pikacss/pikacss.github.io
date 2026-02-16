// Object form — equivalent to tuple forms but with named properties
const shortcuts = [
	// Object form — static
	{
		shortcut: 'flex-center',
		value: {
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'center',
		},
	},

	// Object form — dynamic
	{
		shortcut: /^p-(\d+)$/,
		value: (m: RegExpMatchArray) => ({
			padding: `${Number(m[1]) * 0.25}rem`,
		}),
		autocomplete: ['p-1', 'p-2', 'p-4'],
	},
]
