module.exports = function (grunt) {
    
    var buildPrefix = grunt.option('prefix') || 'ui';
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
            afterdoc: ['example/css'],
            //真实上线后。lib已经和Control合并，并且paths已经配置lib->Control，所以
            //编译完成后，直接删除lib.js
            'after-online': ['asset/online/ui/lib.js']
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
            },
            online: {
                options: {
                    compress: true
                },
                files: [{
                    expand: true,
                    cwd: 'src/css',
                    src: '*.less',
                    dest: 'asset/online/ui',
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
                dest: '<%=meta.src.main%>/moye/' + buildPrefix,
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
                        {name: 'Calendar'},
                        {name: 'City'}
                    ]*/
                }
            },

            online: {
                options: {
                    baseUrl: '<%=meta.src.main%>/moye',
                    dir: 'asset/online/',
                    skipDirOptimize: false,
                    preserveLicenseComments: false,
                    generateSourceMaps: false,
                    optimize: 'uglify2',
                    modules: [
                        {name: buildPrefix + '/Control'},
                    ]
                }
            }
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
            online: {
                src: './asset/online/ui/*.js',
                options: {
                    outfile: 'SpecRunner.html',
                    keepRunner: true,
                    specs: 'test/spec/*Spec.js',
                    vendor: [],
                    host: 'http://localhost:<%= connect.test.options.port %>',
                    template: 'test/templates/OnlineRunner.tmpl'
                }
            },
            istanbul: {
                src: './<%=meta.src.main%>/*/*.js',
                options: {
                    specs: '<%= jasmine.requirejs.options.specs %>',
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

        'gh-pages': {
            options: {
                base: './',
                message: 'Auto-generated commit by grunt'
            },
            src: ['doc/api/*', 'example/**', 'src/*/*']
        },

        'join-css-js': {
            online: {
                files: [{
                    expand: true,
                    cwd: 'asset/online/ui',
                    src: '*.js'
                }]
            }
        }

    });

    Object.keys(pkg.devDependencies).forEach(
        function (name) {
            if (
                name.indexOf('grunt-') === 0
                && name.indexOf('grunt-template') < 0
            ) {
                grunt.loadNpmTasks(name);
            }
        }
    );

    //合并组件的js、css文件，这样模板开发者就不用再关心css的引入问题
    grunt.registerMultiTask('join-css-js', 'join ui css and js', function(){
        this.files.forEach(function(file){
            var files = file.src.filter(function(filePath) {
                var cssPath = filePath.replace(/\.js$/, '.css');
                if (!grunt.file.exists(filePath) || !grunt.file.exists(cssPath)) {
                    return false;
                } else {
                    return true;
                }
            }).map(function(filePath) {
                var cssPath = filePath.replace(/\.js$/, '.css');
                var js = grunt.file.read(filePath),
                    css = grunt.file.read(cssPath);
                var content = "A.insertCss(" + JSON.stringify(css) + ");";
                content += js;
                grunt.file.write(filePath, content);
                grunt.file.delete(cssPath);
                grunt.log.writeln(filePath + ' join css and js completed.');
                return filePath;
            });
        });
        debugger;
    });


    grunt.registerTask('base', ['clean:before', 'jshint', 'lesslint', 'less:compile', 'csslint']);
    grunt.registerTask('base-online', ['clean:before', 'jshint', 'lesslint', 'csslint']);

    grunt.registerTask('build', ['base', 'copy:build', 'requirejs:build', 'clean:after']);
    grunt.registerTask('test', ['base', 'connect', 'jasmine:requirejs']);
    grunt.registerTask('cover', ['base', 'connect', 'jasmine:istanbul']);
    grunt.registerTask('default', ['base']);
    grunt.registerTask('example', ['less', 'copy:doc']);
    grunt.registerTask('page', ['example', 'jsdoc', 'gh-pages', 'clean:afterdoc']);

    grunt.registerTask('build-online', ['base-online', 'copy:build', 'requirejs:online', 'less:online',
                       'join-css-js:online', 'clean:after', 'clean:after-online']);
    grunt.registerTask('test-online', ['build-online', 'connect', 'jasmine:online']);
}
