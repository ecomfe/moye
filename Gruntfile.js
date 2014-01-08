module.exports = function (grunt) {
    
    var build_prefix = grunt.option('prefix') || 'ecomui';
    var pkg = grunt.file.readJSON('package.json');

    grunt.initConfig({

        meta: {
            pkg: pkg,
            src: {
                main: 'src',
                test: 'test/spec'
            }
        },

        clean: {
            before: ['asset', 'bin'],
            after: ['src/moye'],
            afterdoc: ['example/css']
        },
        
        jshint: {
            options: grunt.file.readJSON('.jshintrc'),
            files: ['<%=meta.src.main%>/ui/*.js', '<%=meta.src.test%>/*.js']
        },

        less: {
            compile: {
                files: [{
                    expand: true,
                    cwd: 'src/css',
                    src: '*.less',
                    dest: 'asset/css',
                    ext: '.css'
                }]
            }
        },

        csslint: {
            options: {
                csslintrc: '.csslintrc'
            },
            src: 'asset/**/*.css'
        },

        lesslint: {
            src: ['src/**/*.less']
        },

        jsdoc : {
            files: ['src/**/*.js'], 
            options: {
                configure: '.jsdocrc',
                destination: 'doc/api'
            }
        },

        watch: {
            less: {
                options: {
                  debounceDelay: 250
                },
                files: 'src/**/*.less',
                tasks: ['clean', 'csslint']
            }
        },

        copy: {
            build: {
                expand: true,
                cwd: '<%=meta.src.main%>/ui',
                src: '**',
                dest: '<%=meta.src.main%>/moye/' + build_prefix,
                flatten: false,
                filter: 'isFile',
            },
            doc: {
                expand: true,
                cwd: 'asset/css',
                src: '**',
                dest: 'example/css',
                flatten: false,
                filter: 'isFile',               
            }
        },

        requirejs: {
            compile: {
                options: {
                    baseUrl: '<%=meta.src.main%>/ui',
                    dir: 'asset/ui',
                    skipDirOptimize: false,
                    preserveLicenseComments: false,
                    generateSourceMaps: true,
                    optimize: 'uglify2'/*,
                    modules: [
                        {name: 'Calendar'},
                        {name: 'City'}
                    ]*/
                }
            },
            build: {
                options: {
                    baseUrl: '<%=meta.src.main%>/moye',
                    dir: 'asset/moye/',
                    skipDirOptimize: false,
                    preserveLicenseComments: false,
                    generateSourceMaps: false,
                    optimize: 'uglify2'/*,
                    modules: [
                        {name: build_prefix + '/Calendar'},
                        {name: build_prefix + '/City'}
                    ]*/
                }
            },

        },

        connect: {
            test: {
                options: {
                    port: 8888
                }
            }
        },

        jasmine: {
            requirejs: {
                src: './<%=meta.src.main%>/*/*.js',
                options: {
                    outfile: 'SpecRunner.html',
                    keepRunner: true,
                    styles: '<%= csslint.src %>',
                    specs: 'test/spec/*Spec.js',
                    // helpers: 'test/spec/*Helper.js',
                    vendor: [],
                    host: 'http://localhost:<%= connect.test.options.port %>',
                    template: require('grunt-template-jasmine-requirejs'),
                    templateOptions: {
                        requireConfig: {
                            baseUrl: './<%=meta.src.main%>/',
                            urlArgs: '?' + (+new Date).toString(36)
                        }
                    }
                }
            },
            istanbul: {
                src: './<%=meta.src.main%>/*/*.js',
                options: {
                    specs: ['test/spec/*Spec.js'],
                    vendor: [],
                    outfile: 'SpecRunner.html',
                    keepRunner: true,
                    styles: '<%= csslint.src %>',
                    template: require('grunt-template-jasmine-istanbul'),
                    templateOptions: {
                        coverage: 'test/coverage/coverage.json',
                        report: 'test/coverage',
                        // helpers: 'test/spec/*Helper.js',
                        host: 'http://localhost:<%= connect.test.options.port %>',
                        template: require('grunt-template-jasmine-requirejs'),
                        templateOptions: {
                            requireConfig: {
                                baseUrl: '.grunt/grunt-contrib-jasmine/<%= meta.src.main %>/',
                                urlArgs: '?' + (+new Date).toString(36)
                            }
                        }
                    }
                }
            }
        },

        karma: {
            options: {
                configFile: 'test/config.js',
                reporters: 'dots',
                singleRun: true
            },
            dev: {
                browsers: ['PhantomJS']
            }
        },

        'gh-pages': {
            options: {
                base: './',
                message: 'Auto-generated commit by grunt'
            },
            src: ['doc/api/*', 'example/**', 'src/*/*']
        }

    });

    Object.keys(pkg.devDependencies).forEach(
        function (name) {
            if (name.indexOf('grunt-') === 0) {
                grunt.loadNpmTasks(name);
            }
        }
    );


    grunt.registerTask('base', ['clean:before', 'jshint', 'lesslint', 'less', 'csslint']);
    grunt.registerTask('build', ['base', 'copy:build', 'requirejs:build', 'clean:after']);
    grunt.registerTask('test', ['base', 'connect', 'jasmine:requirejs']);
    grunt.registerTask('cover', ['base', 'connect', 'jasmine:istanbul']);
    grunt.registerTask('default', ['base']);
    grunt.registerTask('page', ['less', 'copy:doc', 'jsdoc', 'gh-pages', 'clean:afterdoc']);

}
