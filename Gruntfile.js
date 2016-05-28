module.exports = function(grunt) {
  var _ = require('lodash');
  var ssh_secret = null;
  try {
    ssh_secret = grunt.file.readJSON('secret.json')
  } catch (e) {
    ssh_secret = grunt.file.readJSON('secret.template.json')
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
      
    // configure of grunt-bump
    bump: {
      options: {
        files: ['package.json'],
        updateConfigs: ['pkg'],
        commit: true,
        commitMessage: 'Release v%VERSION%',
        commitFiles: ['package.json', 'CHANGELOG.md'],
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
  

  grunt.registerMultiTask('template-no-escape', 'Interpolate template files with any data you provide', function() {
    // Merge task-specific and/or target-specific options with these defaults:
    var options = this.options({
      'data': {},
    });

    // Iterate over all specified file groups.
    this.files.forEach(function(file) {
      // Concat specified files.
      var src = file.src.filter(function(filePath) {
        // Warn on and remove invalid source files.
        if (!grunt.file.exists(filePath)) {
          grunt.log.warn('Source file `' + filePath + '` not found.');
          return false;
        } else {
          return true;
        }
      });
      if (!src.length) {
        grunt.log.warn(
          'Destination `' + file.dest +
          '` not written because `src` files were empty.'
        );
        return;
      }
      var template = src.map(function(filePath) {
        // Read file source.
        return grunt.file.read(filePath);
      }).join('\n');

      var data =  typeof options.data == 'function' ?
        options.data() :
        options.data
      
      var compiled = _.template(template, {escape:''});

      var result = compiled(data); 
      grunt.log.writeln(data.mainlua)
      //var result = grunt.template.process(template, templateOptions);

      // Write the destination file
      grunt.file.write(file.dest, result);

      // Print a success message
      grunt.log.writeln('File `' + file.dest + '` created.');
    });
  });


  
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

    
    var data = fs.readFileSync('./CHANGELOG.md', {encoding: 'utf-8'});
    var arrayOfLines = data.match(/[^\r\n]*(\r\n|\r|\n)/g);
    arrayOfLines = arrayOfLines.map( function(line) {
      return line.trim();
    });
    
    var unreleased_title = '## [Unreleased]';
    var changelog_title = '## [v' + version + '] - ' + bumpdate;
    
    var unreleased_idx = arrayOfLines.indexOf(unreleased_title);
    
    
    arrayOfLines[unreleased_idx] = changelog_title
    arrayOfLines.splice(unreleased_idx, 0, unreleased_title, '', '');
    
    fs.writeFileSync('./CHANGELOG.md', arrayOfLines.join('\r\n'), {encoding: 'utf-8'});
    grunt.log.ok('changelog: update CHANGELOG.md');
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


  grunt.registerTask('build', ['template', 'copy']);

  grunt.registerTask('deploy-github', ['build', 'upload-github']);
  grunt.registerTask('deploy-gamelab', ['build', 'ssh_deploy:production']);
  grunt.registerTask('default', ['build']);

};
