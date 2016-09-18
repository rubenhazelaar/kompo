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
    debug: true,
    devtool: 'sourcemap',
    entry: {
    },
    output: {
        path: './',
        filename: '[name].js',
        library: 'kompo',
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
    plugins: []
};

module.exports = config;

