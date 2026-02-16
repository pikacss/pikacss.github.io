// Nested selectors let you scope styles to pseudo-classes,
// media queries, or custom selectors defined in your config.
const className = pika({
	'color': 'black',
	// Pseudo-class nesting (requires selector config)
	':hover': {
		color: 'blue',
	},
	// Custom selector (defined in pika.config)
	'@dark': {
		color: 'white',
	},
	// Media query nesting (defined in pika.config)
	'@screen-md': {
		fontSize: '1.25rem',
	},
})
