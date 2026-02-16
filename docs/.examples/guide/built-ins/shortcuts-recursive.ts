// Shortcuts can reference other shortcuts — resolution is recursive
const shortcuts = [
	['flex-center', {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
	}],

	// 'btn' resolves to 'flex-center' (another shortcut) + inline styles
	['btn', [
		'flex-center', // references the shortcut above
		{ padding: '0.5rem 1rem', borderRadius: '0.25rem' },
	]],
]
