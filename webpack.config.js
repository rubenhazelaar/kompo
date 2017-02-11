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
    },
    output: {
        path: './',
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
    plugins: []
};

module.exports = config;

