/* jshint node: true */
'use strict';

module.exports = function(grunt) { //exported function gets a grunt arg
  	// configure tasks
    grunt.initConfig({
      clean: {
        build: 'build/css'
      },
      jshint: {
        client: [
          'Gruntfile.js',
          'js/**/*.js',
          '!js/library/**/*'
        ]
      },
      less: {
        debug: {
	        files: { 
            'build/css/styles.css': 'css/**/*.less'
	        }
	      },
        release: {
          files: { //takes any less files in the dir
            'build/css/styles.css': 'css/**/*.less'
          }
        }
	    },
      concat: {
        js: {
          src: [
            'js/**/*.js',
            '!js/library/**/*'
          ],
          dest: 'build/js/Bundle.js'
        }
      },
      uglify: {
        release: {
          files: {
            'build/js/Bundle.min.js': 'build/js/Bundle.js'
          }
        }
      },
      cssmin: {
        release: {
          files: {
            'build/css/styles.min.css': 'build/css/styles.css'
          }
        }
      },
      watch: {
        less: {
          tasks: ['less:debug'],
          files: ['public/css/**/*.less']
        },
        lint_client: {
          tasks: ['jshint:client'],
          files: ['js/**/*.js']
        },
        rebuild: {
          tasks: ['build:debug'],
          files: ['js/**/*']
        },
        livereload: {
          options: {
            livereload: true
          },
          files: [
            'js/**/*.(js,json)',
            'css/**/*.css'
          ]
        }
      }
  	}); //end initConfig

  	// load modules
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    //default and aliases
    grunt.registerTask('default', ['jshint']);
    grunt.registerTask('js', 'Concatenate and minify js files', ['concat:js', 'uglify:release']);
    grunt.registerTask('css', 'Concatenate and minify css files', ['less:release', 'cssmin:release']);
    grunt.registerTask('build:debug', 'Lint, bundle, compile', ['clean', 'jshint', 'concat:js', 'less:debug']);
    grunt.registerTask('build:release', 'Lint, bundle, minify', ['clean', 'jshint','js', 'css']);
};

