// In a Vue component template or any supported file:
// The `pika()` function accepts style definition objects
// and returns atomic CSS class names at build time.

// Single style object
const className = pika({
	color: 'red',
	fontSize: '16px',
})
// At build time, this becomes something like: "a b"
// where `a` → `.a { color: red }` and `b` → `.b { font-size: 16px }`
