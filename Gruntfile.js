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
    secret: grunt.file.readJSON('secret.json'),
    environments: {
      options: {
        local_path: 'dist',
        current_symlink: 'current',
        deploy_path: '/home/ran-http/domain/gamelab/elfwash-script'
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
      
    bump: {
      options: {
        files: ['package.json'],
        updateConfigs: ['pkg'],
        commit: true,
        commitMessage: 'Release v%VERSION%',
        commitFiles: ['package.json', 'CHANGELOG'],
        createTag: false,
        tagName: 'v%VERSION%',
        tagMessage: 'Version %VERSION%',
        push: false,
        pushTo: 'upstream',
        gitDescribeOptions: '--tags --always --abbrev=1 --dirty=-d',
        globalReplace: false,
        prereleaseName: false,
        metadata: '',
        regExp: false
      }
    },
  });


  grunt.loadNpmTasks('grunt-template');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-ssh-deploy');
  grunt.loadNpmTasks('grunt-bump');
  
  grunt.registerTask('build', ['template', 'copy']);
  
  grunt.registerTask('changelog', 'update changelog (most combine with bump, and after bump).', function() {
    var fs = require('fs');
    
    String.prototype.trim = function() 
    {
        return String(this).replace(/\s*(\r\n|\r|\n)$/g, '');
    };
    
    function getFormattedDate(date) {
      var year = date.getFullYear();
      var month = (1 + date.getMonth()).toString();
      month = month.length > 1 ? month : '0' + month;
      var day = date.getDate().toString();
      day = day.length > 1 ? day : '0' + day;
      return year + '-' + month + '-' + day;
    }
    
    var cfg = grunt.config('pkg')
    var version = cfg['version'] ;
    var bumpdate = getFormattedDate(new Date());

    
    var data = fs.readFileSync('./CHANGELOG', {encoding: 'utf-8'});
    var arrayOfLines = data.match(/[^\r\n]*(\r\n|\r|\n)/g);
    arrayOfLines = arrayOfLines.map( function(line) {
      return line.trim();
    });
    
    var unreleased_title = '## [Unreleased]';
    var changelog_title = '## [v' + version + '] - ' + bumpdate;
    
    var unreleased_idx = arrayOfLines.indexOf(unreleased_title);
    
    
    arrayOfLines[unreleased_idx] = changelog_title
    arrayOfLines.splice(unreleased_idx, 0, unreleased_title, '', '');
    
    fs.writeFileSync('./CHANGELOG', arrayOfLines.join('\r\n'), {encoding: 'utf-8'});
    grunt.log.ok('changelog: update CHANGELOG');
    grunt.log.ok('changelog: replace "' + unreleased_title + '" with "' + changelog_title + '"');
  });
  
  
  var DESC = 'Increment the version, commit, tag and push.';
  grunt.registerTask('bumplog', DESC, function(versionType) {
      grunt.task.run('bump-only:' + (versionType || ''));
      grunt.task.run('changelog');
      grunt.task.run('bump-commit');
  });
  
  grunt.registerTask('upload-github', 'Upload to github gh-pages.', function() {
    this.requires(['build']);
    
    var ghpages = require('gh-pages');
    var path = require('path');

    var done = this.async();
    ghpages.publish(path.join(__dirname, 'dist'), done);
  });

  grunt.registerTask('upload', ['build', 'upload-github']);
  grunt.registerTask('deploy', ['build', 'ssh_deploy:production']);
  grunt.registerTask('default', ['build']);

};
