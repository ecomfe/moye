// Test configuration for edp-test

module.exports = {

    // base path, that will be used to resolve files and exclude
    basePath: '../',

    qrcode: false,

    // frameworks to use
    frameworks: [
        'jasmine2',
        'esl',
        'http://s1.bdstatic.com/r/www/cache/static/jquery/jquery-1.10.2.min_f2fb5194.js'
    ],

    // list of files / patterns to load in the browser
    files: [
        'test/spec/*Spec.js'
    ],

    // list of files to exclude
    exclude: [

    ],


    coverageFiles: [
    ],

    // optionally, configure the reporter
    coverageReporter: {
        // text-summary | text | html | json | teamcity | cobertura | lcov
        // lcovonly | none | teamcity
        type : 'html|text',
        dir : 'test/coverage/'
    },

    // web server port
    port: 8120,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // Start these browsers, currently available:
    // - Chrome
    // - ChromeCanary
    // - Firefox
    // - Opera
    // - Safari
    // - PhantomJS
    // - IE (only Windows;)
    browsers: [
        // 'Firefox',
        // 'Safari',
        // 'Chrome',
        'PhantomJS'
    ],


    // Continuous Integration mode
    // if true, it capture browsers, run tests and exit
    singleRun: false
};
