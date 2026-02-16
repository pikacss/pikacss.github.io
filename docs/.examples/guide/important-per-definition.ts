// When important.default is true, override per definition:
const noImportant = pika({
	__important: false, // disable !important for this definition
	color: 'red',
	fontSize: '1rem',
})

// When important.default is false (the default), opt-in per definition:
const withImportant = pika({
	__important: true, // enable !important for this definition
	color: 'blue',
	fontSize: '2rem',
})
