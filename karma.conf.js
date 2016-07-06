// Karma configuration
// Generated on Thu May 12 2016 13:41:25 GMT-0700 (Pacific Daylight Time)

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine'],


    // list of files / patterns to load in the browser
    files: [ 
        'node_modules/angular/angular.js' 
      , 'node_modules/angular-mocks/angular-mocks.js'
      , 'node_modules/angular-ui-router/release/angular-ui-router.js'
      , 'src/js/**/*.js'
      , 'spec/js/**/*.js'
      // , 'spec/fixtures/**/*.html'
      // , 'spec/fixtures/**/*.js'
      // , 'spec/fixtures/**/*.json'
    ],


    // list of files to exclude
    exclude: [
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
          'src/js/**/*.js': ['coverage']
//      , '**/*.html': ['html2js']
//      , '**/*.json': ['json_fixtures']
    },

    // setup for the karma-json-fixtures-preprocessor plugin
    jsonFixturesPreprocessor: {
      variableName: '__json__'
    },

    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress', 'coverage'],


//    plugins: [
//      'karma-fixture',
//      'karma-html2js-preprocessor',
//      'karma-json-fixtures-preprocessor',
//      'karma-jasmine',
//      'karma-coverage',
//      'karma-phantomjs-launcher'
//    ],

    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['PhantomJS'], // ['Chrome'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity
  })
}
