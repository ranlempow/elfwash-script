module.exports = function(grunt) {
    


    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        template: {
            options: {
                // Task-specific options go here
            },
            build: {
                options: {
                    data: {
                        'mainlua': grunt.file.read('src/main.lua'),
                    }
                },
                files: {
                    'dist/run.html': ['src/run.tpl.html']
                }
            }
        },
        watch: {
            files: ['src/main.lua', 'src/run.tpl.html'],
            tasks: ['template']
        },
        copy: {
            main: {
                files: [
                    {expand: true, src: ['bower_components/*/*.js', 'bower_components/*/dist/*.js'], dest: 'dist/'},
                    {expand: true, src: ['thirdparty/lua.js', 'src/main.js'], dest: 'dist/'},
                ],
            },
        },
        upload: {

        }

    });
    grunt.loadNpmTasks('grunt-template');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.registerTask('build', ['template', 'copy']);
    
    grunt.registerTask('upload', 'Upload to github gh-pages.', function() {
        grunt.task.run(['build']);
        
        var ghpages = require('gh-pages');
        var path = require('path');
        
        remote.origin.url
        // grunt.config(
        var done = this.async();
        grunt.log.writeln(__dirname);
        ghpages.publish(path.join(__dirname, 'dist'), done);
        grunt.log.writeln(this.target + ': ' + this.data);
    });
    
    grunt.registerTask('default', ['upload']);

};
