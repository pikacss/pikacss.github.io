// Traditional CSS-in-JS (runtime cost)
// ❌ Ships a style engine to the browser
// ❌ Generates CSS at runtime via JavaScript
// ❌ Blocks rendering while computing styles
import { css } from 'some-runtime-css-in-js'

const className = css({
	color: 'red', // Evaluated at runtime
	fontSize: '16px', // Hashed at runtime
}) // Injected into DOM at runtime

// PikaCSS (zero runtime cost)
// ✅ No style engine in the bundle
// ✅ CSS is pre-generated at build time
// ✅ No rendering delay from style computation
const className = 'a b' // Just a string literal — nothing to compute
