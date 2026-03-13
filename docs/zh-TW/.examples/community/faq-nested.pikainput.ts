// pika() is available as a global function — no import needed

const btn = pika({
	'color': 'black',
	// Wrapper at-rules can stay inline
	'@media (max-width: 768px)': {
		fontSize: '14px',
	},
})
