// Tuple form — static: [name, value]
// value can be a StyleDefinition, a string (another shortcut), or an array of both
const shortcuts = [
	// Single style definition
	['flex-center', {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
	}],

	// Multiple style items (array of StyleDefinitions)
	['btn-base', [
		{ padding: '0.5rem 1rem', borderRadius: '0.25rem', cursor: 'pointer' },
		{ border: 'none', fontSize: '1rem' },
	]],

	// Reference another shortcut by name (string value)
	['centered', 'flex-center'],
]
