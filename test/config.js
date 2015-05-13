// Test configuration for Karma
// Generated on Fri Dec 27 2013 15:11:09 GMT+0800 (CST)

module.exports = function(config) {
    config.set({

        // base path, that will be used to resolve files and exclude
        basePath: '../',

        // frameworks to use
        frameworks: [
            'jasmine',
            'requirejs',
            'http://s1.bdstatic.com/r/www/cache/static/jquery/jquery-1.10.2.min_f2fb5194.js'
        ],


        // list of files / patterns to load in the browser
        files: [
            'src/css/Button.less',
            {
                pattern: 'test/spec/ButtonSpec.js',
                included: false
            },
            'src/css/Dialog.less',
            {
                pattern: 'test/spec/DialogSpec.js',
                included: false
            },
            'src/css/Select.less',
            {
                pattern: 'test/spec/SelectSpec.js',
                included: false
            },
            {
                pattern: 'test/spec/logSpec.js',
                included: false
            },
            // {
            //     pattern: 'test/spec/CookieSpec.js',
            //     included: false
            // },
            {
                pattern: 'test/spec/TipSpec.js',
                included: false
            },
            {
                 pattern: 'test/spec/PagerSpec.js',
                 included: false
            },
            {
              pattern: 'test/spec/RatingSpec.js',
                included: false
            },
            {
                pattern: 'test/spec/TabSpec.js',
                included: false
            },
            // {
            //     pattern: 'test/spec/CalendarSpec.js',
            //     included: false
            // },
            // {
            //     pattern: 'test/spec/CitySpec.js',
            //     included: false
            // },
            {
                pattern: 'test/spec/PanelSpec.js',
                included: false
            },
            {
                pattern: 'test/spec/FormSpec.js',
                included: false
            },
            {
                pattern: 'test/spec/plugin/ValiditySpec.js',
                included: false
            },
            {
                pattern: 'test/spec/plugin/ValidateRuleSpec.js',
                included: false
            },
            {
                pattern: 'test/spec/plugin/ValidateTipSpec.js',
                included: false
            },
            {
                pattern: 'test/spec/plugin/ValidatorSpec.js',
                included: false
            },
            {
                pattern: 'test/spec/plugin/FormSubmitSpec.js',
                included: false
            },
            {
                pattern: 'test/spec/plugin/FormFieldWatcherSpec.js',
                included: false
            },
            {
                pattern: 'test/spec/plugin/FormRelationSpec.js',
                included: false
            },
            {
                pattern: 'test/spec/plugin/validator/PredefineRuleSpec.js',
                included: false
            },
            // {
            //     pattern: 'test/spec/LazyloadSpec.js',
            //     included: false
            // },
            {
                pattern: 'test/spec/lib/*.js',
                include: false
            },
            'src/css/Slider.less',
            {
                pattern: 'test/spec/SliderSpec.js',
                included: false
            },
            {
                pattern: 'test/spec/SliderAnimSpec.js',
                included: false
            }
    ],


    // list of files to exclude
    exclude: [

    ],


    // test results reporter to use
    // possible values: 'dots', 'progress', 'junit', 'growl', 'coverage'
    reporters: ['progress', 'coverage'],

    preprocessors: {
      // source files, that you wanna generate coverage for
      // do not include tests or libraries
      // (these files will be instrumented by Istanbul)
      'src/**/*.js': ['coverage'],
      'src/css/*.less': ['less']
    },

    lessPreprocessor: {
      options: {
        paths: ['src/css', 'dep']
      }
    },

    // optionally, configure the reporter
    coverageReporter: {
      // text-summary | text | html | json | teamcity | cobertura | lcov
      // lcovonly | none | teamcity
      type : 'html',
      dir : 'test/coverage/'
    },

    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // Start these browsers, currently available:
    // - Chrome
    // - ChromeCanary
    // - Firefox
    // - Opera (has to be installed with `npm install karma-opera-launcher`)
    // - Safari (only Mac; has to be installed with `npm install karma-safari-launcher`)
    // - PhantomJS
    // - IE (only Windows; has to be installed with `npm install karma-ie-launcher`)
    browsers: ['Chrome', /*'Firefox'*/],


    // If browser does not capture in given timeout [ms], kill it
    captureTimeout: 60000,


    // Continuous Integration mode
    // if true, it capture browsers, run tests and exit
    singleRun: false,

    plugins: [
        'karma-jasmine', 'karma-phantomjs-launcher', 'karma-chrome-launcher', 'karma-firefox-launcher', "karma-less-preprocessor", "karma-stylus-preprocessor", 'karma-requirejs', 'karma-coverage'
    ]
  });
};
