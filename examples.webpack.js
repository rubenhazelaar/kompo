var webpack = require("webpack"),
    DedupePlugin = webpack.optimize.DedupePlugin,
    Clean = require('clean-webpack-plugin'),
    path = require('path'),
    fs = require('fs'),
    getPackageJson = function () {
        return JSON.parse(fs.readFileSync('./package.json', 'utf8'));
    },
    pkg = getPackageJson();

var config = {
    cache: true,
    devtool: 'sourcemap',
    entry: {
        'examples/helloWorld/dist/helloWorld-bundle': './examples/helloWorld/src/helloWorld.js',
        'examples/extendedHelloWorld/dist/extendedHelloWorld-bundle': './examples/extendedHelloWorld/src/extendedHelloWorld.js',
        'examples/router/dist/router-bundle': './examples/router/src/router.js',
        'examples/todo/dist/todo-bundle': './examples/todo/src/todo.js',
        'examples/compose/dist/compose-bundle': './examples/compose/src/compose.js',
        'examples/classbased/dist/classbased-bundle': './examples/classbased/src/classbased.js'
    },
    output: {
        path: './',
        chunkFilename: '[name].js',
        filename: '[name].js',
        library: 'kompo',
        libraryTarget: 'umd'
    },
    resolve: {
        extensions: ['.js', '.json'],
        modules: [
            "node_modules",
            path.resolve(__dirname, "src")
        ]
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /(node_modules)/,
                loader: 'babel-loader'
            }
        ]
    },
    plugins: [
        new webpack.DefinePlugin({
            KOMPO_DEBUG: JSON.stringify(true)
        })
    ]
};

module.exports = config;

