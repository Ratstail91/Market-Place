const TerserPlugin = require('terser-webpack-plugin');
const path = require('path');

module.exports = env => {
	return {
		entry: `./src/index.jsx`,
		output: {
			path: path.resolve(__dirname, '../public/'),
			filename: 'app.bundle.js',
			sourceMapFilename: 'app.bundle.js.map'
		},
		devtool: 'source-map',
		module: {
			rules: [
				{
					test: /(\.js$|\.jsx$)/,
					exclude: /(node_modules)/,
					use: {
						loader: 'babel-loader',
						options: {
							presets: ['@babel/preset-env', '@babel/preset-react'],
							plugins: ['react-loadable/babel', '@babel/plugin-syntax-dynamic-import']
						}
					}
				}
			]
		},
		optimization: {
			minimize: env === 'production',
			minimizer: [
				new TerserPlugin({
					terserOptions: {
						output: {
							comments: false,
						},
					},
				})
			]
		}
	};
};