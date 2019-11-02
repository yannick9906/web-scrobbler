const fs = require('fs');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const popups = getPopupNames();
const htmlPages = ['options', 'startup'];

const popupDeps = ['ui/i18n'];

module.exports = {
	mode: 'development',
	devtool: false,
	entry: {
		'core/background/main': resolve('src/core/background/main.js'),

		'ui/i18n': resolve('src/ui/i18n.js'),
		'ui/popups/info': resolve('src/ui/popups/info.js'),
		'ui/popups/go_play_music': resolve('src/ui/popups/go_play_music.js'),

		'ui/options/index': resolve('src/ui/options/index.js'),
		'ui/startup/index': resolve('src/ui/startup/index.js'),
	},
	output: {
		path: `${__dirname}/build/`,
		filename: '[name].js',
		chunkFilename: '[name].[chunkhash].js',
	},
	resolve: {
		alias: {
			connectors: resolve('src/core/connectors'),
		},
		modules: [
			resolve('src/core/background'),
			resolve('src/ui/options'),
			resolve('src/ui'),
			'node_modules'
		],
	},
	plugins: [
		...popups.map(makePopupPlugin),
		...htmlPages.map(makePagePlugin)
	],
};

function makePopupPlugin(popup) {
	return makeGenericPlugin(`ui/popups/${popup}`, popupDeps);
}

function makePagePlugin(page) {
	return makeGenericPlugin(`ui/${page}/index`, popupDeps);
}

function makeGenericPlugin(chunk, deps) {
	const chunks = [...deps];
	applyChunkIfExists(chunk, chunks);

	return new HtmlWebpackPlugin({
		chunks,
		template: resolve(`src/${chunk}.html`),
		filename: `${chunk}.html`,
	});
}

function applyChunkIfExists(chunk, chunks) {
	const srcPopupJsFile = resolve(`src/${chunk}.js`);
	if (fs.existsSync(srcPopupJsFile)) {
		chunks.push(chunk);
	}
}

function resolve(p) {
	return path.resolve(__dirname, p);
}

function getPopupNames() {
	const popupsDir = resolve('src/ui/popups/');

	return fs.readdirSync(popupsDir).filter((file) => {
		return file.endsWith('.html');
	}).map((file) => {
		return path.basename(file, '.html');
	});
}
