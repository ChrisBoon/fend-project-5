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
                tasks: ['jshint'],
                options: {
                    spawn: false
                },
            },
        },

        wiredep: {
          task: {
            src: ['app/**/*.html']
          }
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
              myFiles: ['app/scripts/custom/**/*.js']
        },


        browserSync: {
            dev: {
                bsFiles: {
                    src : [
                        'app/css/*.css',
                        'app/*.html'
                    ]
                },
                options: {
                    watchTask: true,
                    server: './app'
                }
            }
        }
    });

    // load npm tasks
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-postcss');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-imagemin');
    grunt.loadNpmTasks('grunt-newer');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-wiredep');
    grunt.loadNpmTasks('grunt-browser-sync');

    // define default task
    grunt.registerTask('default', ['browserSync', 'watch']);
};