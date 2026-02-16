// Two different components using the same CSS property-value pairs

// Button component
const btnClass = pika({
	color: 'white', // → class 'a'
	padding: '1rem', // → class 'b'
	cursor: 'pointer', // → class 'c'
})

// Link component — shares `color: white` and `cursor: pointer`
const linkClass = pika({
	color: 'white', // → reuses class 'a' (same property-value!)
	fontSize: '14px', // → class 'd' (new)
	cursor: 'pointer', // → reuses class 'c' (same property-value!)
})
