module.exports = function (grunt) {
    grunt.initConfig({

        watch: {

            css: {
                files: ['app/sass/**/*.scss'],
                tasks: ['sass', 'postcss'],
                options: {
                    spawn: false,
                }
            },

            images: {
                files: ['images-src/**/*.*'],
                tasks: ['newer:imagemin']
            },

            scripts: {
                files: ['app/scripts/custom/**/*.js'],
                tasks: ['jshint','concat'],
                options: {
                    spawn: false
                },
            },
        },

        sass: {
            dev: {
                files: {
                    'app/css/main.css': 'app/sass/main.scss'
                }
            }
        },

        postcss:{
            options: {
                map: true,
                processors: [
                    require('autoprefixer')({browsers: ['last 3 versions']}),
                    require('cssnano')()
                ]
            },
            dist: {
                src: 'app/css/main.css'
            }
        },

        imagemin: {
            dynamic: {
                files: [{
                    expand: true, // Enable dynamic expansion
                    cwd: 'images-src/', // Src matches are relative to this path
                    src: ['**/*.{png,jpg,gif,svg}'], // Actual patterns to match
                    dest: 'app/images/' // Destination path prefix
                }]
            }
        },

        jshint: {
            options: {
                debug: true
            },
            myFiles: ['app/scripts/custom/**/*.js']
        },

        concat: {
            dist: {
                src: ['app/scripts/vendor/*.js','app/scripts/custom/*.js'],
                dest: 'app/scripts/build/app.js'
            }
        },

        uglify: {
            dist: {
                src: 'app/scripts/build/app.js',
                dest: 'app/scripts/build/app.min.js'
            }
        },

        browserSync: {
            dev: {
                bsFiles: {
                    src : [
                        'app/scripts/build/app.min.js',
                        'app/css/*.css',
                        'app/*.html'
                    ]
                },
                options: {
                    watchTask: true,
                    server: {
                        baseDir: "./app",
                        routes: {
                            "/bower_components": "bower_components"
                        }
                    }
                }
            }
        },
        copy: {
            js: {
                expand: true,
                cwd: 'app/scripts/build/',
                src: '*.min.js',
                dest: 'dist/scripts/'
            },
            css: {
                expand: true,
                cwd: 'app/',
                src: 'css/main.css',
                dest: 'dist/'
            }
        },
        clean: ['dist/'],
        replace: {
            dist: {
                options: {
                    patterns: [
                        {
                            match: /build\/app.js/g,
                                replacement: function () {
                                return 'app.min.js';
                            }
                        }
                    ]
                },
                files: [
                    {expand: true, cwd: 'app/', src: '*.html', dest: 'dist/'}
                ]
            }
        }

    });

    // load npm tasks
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-postcss');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-imagemin');
    grunt.loadNpmTasks('grunt-newer');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-browser-sync');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-replace');

    // define default task
    grunt.registerTask('default', ['sass', 'postcss', 'concat', 'browserSync', 'watch']);

    grunt.registerTask('dist', ['uglify', 'clean', 'copy', 'replace']);
};