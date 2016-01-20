// Karma configuration
// Generated on Fri Jan 08 2016 21:45:44 GMT-0300 (SA Eastern Standard Time)

module.exports = function (config) {
    var cfg = {

        // base path that will be used to resolve all patterns (eg. files, exclude)
        basePath: '',


        // frameworks to use
        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        frameworks: ['mocha', 'sinon'],


        // list of files / patterns to load in the browser
        files: [
            'test.webpack.js'
        ],


        // list of files to exclude
        exclude: [],


        // preprocess matching files before serving them to the browser
        // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
        preprocessors: {
            // add webpack as preprocessor
            'test.webpack.js': [ 'webpack', 'sourcemap' ]
        },

        // test results reporter to use
        // possible values: 'dots', 'progress'
        // available reporters: https://npmjs.org/browse/keyword/karma-reporter
        reporters: ['progress'],


        // web server port
        port: 9876,


        // enable / disable colors in the output (reporters and logs)
        colors: true,


        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_INFO,


        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: false,


        // start these browsers
        // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
        //browsers: ['ChromeCanary', 'Firefox', 'Safari', 'IE'],
        browsers: ['ChromeCanary', 'Chrome'],

        customLaunchers: {
            Chrome_travis_ci: {
                base: 'Chrome',
                flags: ['--no-sandbox']
            }
        },

        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        singleRun: true,

        // Concurrency level
        // how many browser should be started simultaneous
        concurrency: Infinity,

        // Set plugins
        plugins: [
            require("karma-webpack"),
            require("karma-mocha"),
            require("karma-sinon"),
            require("karma-chrome-launcher"),
            require("karma-firefox-launcher"),
            require("karma-ie-launcher"),
            require("karma-safari-launcher"),
            require("karma-sourcemap-loader")
        ],

        // Webpack configuration
        webpack: {
            devtool: 'inline-source-map',
            resolve: {
                extensions: ['', '.js', '.json'],
                modulesDirectories: ["node_modules"]
            },
            module: {
                loaders: [
                    //{
                    //    test: /sinon\/pkg\/sinon\.js/,
                    //    loader: 'imports?define=>false,require=>false'
                    //},
                    {
                        test: /\.js$/,
                        exclude: /(node_modules)/,
                        loader: 'babel-loader'
                    }
                ]
            }
        },

        webpackMiddleware:  {
            //progress: false,
            //stats: false,
            //debug: true,
            noInfo: true
            //silent: true
        }
    }

    if (process.env.TRAVIS) {
        cfg.browsers = ['Chrome_travis_ci'];
    }

    config.set(cfg);
};
