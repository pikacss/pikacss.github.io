// pika() is available as a global function — no import needed

const btn = pika({
	'color': 'black',
	// Pseudo-class selector
	'&:hover': {
		color: 'blue',
	},
	// Media query
	'@media (max-width: 768px)': {
		fontSize: '14px',
	},
})
