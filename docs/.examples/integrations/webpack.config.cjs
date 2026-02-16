// webpack.config.cjs
const PikaCSS = require('@pikacss/unplugin-pikacss/webpack').default

module.exports = {
	plugins: [
		PikaCSS(),
	],
}
