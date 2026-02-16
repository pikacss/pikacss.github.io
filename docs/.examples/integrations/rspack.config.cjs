// rspack.config.cjs
const PikaCSS = require('@pikacss/unplugin-pikacss/rspack').default

module.exports = {
	plugins: [
		PikaCSS(),
	],
}
