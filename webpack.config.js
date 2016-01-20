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
        'dist/kompo': './src/index.js',
        'examples/helloWorld/dist/helloWorld': './examples/helloWorld/src/helloWorld.js',
        'examples/extendedHelloWorld/dist/extendedHelloWorld': './examples/extendedHelloWorld/src/extendedHelloWorld.js',
        'examples/router/dist/router': './examples/router/src/router.js',
        'examples/todo/dist/todo': './examples/todo/src/todo.js',
        'examples/ajax/dist/ajax': './examples/ajax/src/ajax.js'
    },
    output: {
        path: './',
        filename: '[name].js',
        chunkFilename: ".chunk.js"
    },
    resolve: {
        extensions: ['', '.js', '.json'],
        modulesDirectories: ["node_modules"]
    },
    module: {
        loaders: [
            {
                test: /\.jsx?$/,
                exclude: /(node_modules)/,
                loader: 'babel-loader'
            }
            //,{
            //    test: /\.js$/,
            //    exclude: /node_modules/,
            //    loader: "eslint-loader"
            //}
        ]
    },
    plugins: [
        new webpack.OldWatchingPlugin()
        //,new Clean([
        //    './examples/helloWorld/dist/'
        //])
        ,new DedupePlugin()
        //,new CommonsChunkPlugin({
        //    name: "common",
        //    // (the commons chunk name)
        //
        //    filename: "common.js",
        //    // (the filename of the commons chunk)
        //
        //    minChunks: 2
        //    // (Modules must be shared between 3 entries)
        //})
    ]
};

module.exports = config;

