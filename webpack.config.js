var webpack = require("webpack"),
    DedupePlugin = webpack.optimize.DedupePlugin,
    CommonsChunkPlugin = webpack.optimize.CommonsChunkPlugin,
    Clean = require('clean-webpack-plugin'),
    path = require('path'),
    fs = require('fs'),
    getPackageJson = function () {
        return JSON.parse(fs.readFileSync('./package.json', 'utf8'));
    },
    pkg = getPackageJson();

var config = {
    cache: true,
    debug: true,
    devtool: 'sourcemap',
    entry: {
        'examples/helloWorld/dist/helloWorld-bundle': './examples/helloWorld/src/helloWorld.js',
        'examples/extendedHelloWorld/dist/extendedHelloWorld-bundle': './examples/extendedHelloWorld/src/extendedHelloWorld.js',
        'examples/router/dist/router-bundle': './examples/router/src/router.js',
        'examples/todo/dist/todo-bundle': './examples/todo/src/todo.js',
        'examples/ajax/dist/ajax-bundle': './examples/ajax/src/ajax.js'
    },
    output: {
        path: './',
        filename: '[name].js',
        library: 'Kompo',
        libraryTarget: 'umd'
    },
    resolve: {
        extensions: ['', '.js', '.json'],
        modulesDirectories: ["node_modules"]
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                exclude: /(node_modules)/,
                loader: 'babel-loader'
            }
        ]
    },
    plugins: [
        new webpack.OldWatchingPlugin(),
        new DedupePlugin()
    ]
};

module.exports = config;

