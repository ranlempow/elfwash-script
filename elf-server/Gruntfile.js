module.exports = function(grunt) {
  var _ = require('lodash');
  var ssh_secret = null;
  try {
    ssh_secret = grunt.file.readJSON('config/ssh-deploy/secret.json')
  } catch (e) {
    ssh_secret = grunt.file.readJSON('config/ssh-deploy/secret.template.json')
  }

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    
    // configure of build processing
    'template': {
      options: {
        // Task-specific options go here
      },
      build: {
        options: {
          data: function() {
            return {
              'mainlua': grunt.file.read('src/js/main.lua'),
              'changelog': grunt.file.read('CHANGELOG.md'),
            }
          }
        },
        files: {
          'dist/run.html': ['src/run.tpl.html'],
          'dist/index.html': ['src/index.tpl.html'],
        }
      }
    },
    watch: {
      files: ['src/**'],
      tasks: ['template', 'copy']
    },
    copy: {
      main: {
        files: [
          {expand: true, src: ['bower_components/*/*.js', 'bower_components/*/*.css',
                               'bower_components/*/dist/**/*.js', 'bower_components/*/dist/**/*.css', ], //, 'bower_components/*/dist/css/*.css'],
            dest: 'dist/'
          },
          {expand: true, src: ['thirdparty/lua.js'], dest: 'dist/'},
          {expand: true, cwd:"src/", src: ['js/*.js', '*.html', '!*.tpl.html'], dest: 'dist/'},
        ],
      },
    },
    
    // configure of grunt-ssh-deploy
    secret: ssh_secret,
    environments: {
      options: {
        local_path: 'dist',
        current_symlink: 'current',
        deploy_path: '<%= secret.production.deploy_path %>'
      },
      production: {
        options: {
          host: '<%= secret.production.host %>',
          username: '<%= secret.production.username %>',
          password: '<%= secret.production.password %>',
          port: '<%= secret.production.port %>',
          releases_to_keep: '5',
        }
      },
    },

  });


  grunt.loadNpmTasks('grunt-template');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-ssh-deploy');

  grunt.registerTask('build', ['template', 'copy']);

  grunt.registerTask('deploy-gamelab', ['build', 'ssh_deploy:production']);
  grunt.registerTask('default', ['build']);

};
