// Tuple form — dynamic: [pattern, resolver, autocomplete?]
// The resolver receives RegExpMatchArray and returns ResolvedStyleItem(s)
const shortcuts = [
	// Dynamic margin shortcut
	[
		/^m-(\d+)$/,
		(m: RegExpMatchArray) => ({ margin: `${Number(m[1]) * 0.25}rem` }),
		['m-1', 'm-2', 'm-4', 'm-8'], // autocomplete hints
	],

	// Dynamic size shortcut returning a single definition
	[
		/^size-(\d+)$/,
		(m: RegExpMatchArray) => ({
			width: `${m[1]}px`,
			height: `${m[1]}px`,
		}),
		['size-16', 'size-24', 'size-32'],
	],

	// Dynamic shortcut returning multiple style items
	[
		/^card-(\w+)$/,
		(m: RegExpMatchArray) => [
			{ padding: '1rem', borderRadius: '0.5rem' },
			{ backgroundColor: m[1] },
		],
	],
]
