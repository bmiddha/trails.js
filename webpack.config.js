const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
	devtool: "inline-source-map",
	entry: __dirname + '/src/js/sketch.ts',
	output: {
		path: __dirname + '/dist/',
		publicPath: '/',
		filename: 'js/sketch.js'
	},
	devServer: {
		inline: true,
		hot: true,
		port: 3333
	},
	module: {
		rules: [{
			test: /\.(ts|js)x?$/i,
			exclude: /(node_modules)/,
			loader: 'babel-loader'
			},
			{
				test: /\.scss$/,
				loader: "style-loader!css-loader!sass-loader"
			}
		]
	},
	plugins: [
		new CopyWebpackPlugin({
			patterns: [{
					from: 'src/index.html',
					to: 'index.html'
				},
				{
					from: 'src/assets',
					to: 'assets'
				}
			],
		})
	]
}
