import PikaCSS from '@pikacss/unplugin-pikacss/webpack'

export default {
	entry: './src/index.ts',
	module: {
		rules: [
			{
				test: /\.ts$/,
				use: 'ts-loader',
				exclude: /node_modules/,
			},
		],
	},
	plugins: [PikaCSS()],
	resolve: {
		extensions: ['.ts', '.js'],
	},
}
