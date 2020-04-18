module.exports = {
    mode: 'development',
    entry: {
        'examples/helloWorld/dist/helloWorld': './examples/helloWorld/src/helloWorld.ts',
        'examples/extendedHelloWorld/dist/extendedHelloWorld': './examples/extendedHelloWorld/src/extendedHelloWorld.ts',
        'examples/router/dist/router': './examples/router/src/router.ts',
        'examples/store/dist/store': './examples/store/src/store.ts',
        'examples/todo/dist/todo': './examples/todo/src/todo.ts',
        'examples/compose/dist/compose': './examples/compose/src/compose.ts',
    },
    devtool: 'inline-source-map',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: [ '.tsx', '.ts', '.js' ],
    },
    output: {
        path: __dirname,
        chunkFilename: '[name].js',
        filename: '[name].js',
    },
};