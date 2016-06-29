module.exports = function(grunt) {
  var assert = require('assert')
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
    template: {
      options: {
        // Task-specific options go here
      },
      build: {
        options: {
          data: function() {
            return {
              'mainlua': grunt.file.read('src/lua/main.lua'),
              'changelog': grunt.file.read('CHANGELOG.md'),
            }
          }
        },
        files: {
          'dist/index.html': ['src/index.tpl.html'],
        }
      }
    },
    watch: {
      files: ['src/**'],
      tasks: ['build']
    },
    copy: {
      main: {
        files: [
          {expand: true, src: ['bower_components/*/*.js', 'bower_components/*/*.css',
                               'bower_components/*/dist/**/*.js', 'bower_components/*/dist/**/*.css',
                               'bower_components/*/build/*.js',
                               'bower_components/*/script/*.js', 'bower_components/*/style/*.css', 'bower_components/*/css/*.css'], //, 'bower_components/*/dist/css/*.css'],
            dest: 'dist/'
          },
          {expand: true, src: ['bower_components/*/dist/fonts/*', 'bower_components/*/fonts/*'], dest: 'dist/'},
          {expand: true, src: ['node_modules/keycode/index.js'], dest: 'dist/'},
          {expand: true, src: ['thirdparty/lua.js'], dest: 'dist/'},
          {expand: true, cwd:"src/", src: ['js/**/*.js', 'lua/**/*.lua', 'css/**/*.css', 'coffee/**/*.coffee', '*.html', '!*.tpl.html'], dest: 'dist/'},
        ],
      },
    },
    luamodulize:{
      main: {
        options: {
          basedir: 'dist/',
          configdir: 'dist/lua/',
        },
        files: [
          {expand: true, cwd:"src/", src: ['lua/**/*.lua'], dest: 'dist/', ext: '.lua.js', extDot: 'last'},
        ]
      }
    },
    espower: {
      main: {
        files: [
          {
            expand: true,        // Enable dynamic expansion.
            cwd: 'src/',        // Src matches are relative to this path.
            src: ['**/*.js'],    // Actual pattern(s) to match.
            dest: 'dist/',  // Destination path prefix.
            ext: '.js'           // Dest filepaths will have this extension.
          }
        ]
      }
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

    // coffee
    coffee: {
      glob_to_multiple: {
        expand: true,
        flatten: true,
        cwd: 'src/',
        src: ['coffee/**/*.coffee'],
        dest: 'dist/js',
        ext: '.js'
      }
    },


    // less
    less: {
      development: {
        options: {
          paths: ['src/css/', 'bower_components/']
        },
        files: [
          {expand: true, cwd:"src/", src: ['css/**/*.less'], dest: 'dist/', ext: '.css', extDot: 'last'},
        ]
      }
    }

  });


  grunt.loadNpmTasks('grunt-template');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-ssh-deploy');
  grunt.loadNpmTasks('grunt-bump');
  grunt.loadNpmTasks('grunt-contrib-coffee');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-espower');
  
  grunt.registerMultiTask('luamodulize', function (){
    var options = this.options();
    var lua_modules = {};
    this.files.forEach(function(file) {
      var contents = file.src.filter(function(path) {
        // Remove nonexistent files (it's up to you to filter or warn here).
        if (!grunt.file.exists(path)) {
          grunt.log.warn('Source file "' + path + '" not found.');
          return false;
        } else {
          return true;
        }
      }).map(function(path) {
        // Read and return the file's source.
        return grunt.file.read(path);
      }).join('\n').replace(/\\/g, '\\\\').replace(/"/g, '\\"').split('\n').map(function(line) {
        return '    "'+ line.slice(0, -1) + '\\n" +'
      });
      contents.splice(0, 0, 'define(function() {');
      contents.splice(1, 0, 'var code = "" +');
      contents.push('    "";');
      contents.push('  return {code:code};');
      contents.push('});');
      contents = contents.join('\n');

      grunt.file.write(file.dest, contents);
      grunt.log.writeln('File "' + file.dest + '" created.');

      var path = file.dest.replace(new RegExp('^' + options.basedir), '').replace(/\.js$/, '');
      var comps = file.dest.replace(new RegExp('^' + options.configdir), '').split('/');

      var basename = comps[comps.length - 1]; 
      var words = basename.split('.');
      assert(words[words.length - 1] == 'js')
      assert(words[words.length - 2] == 'lua')
      assert(words.length == 3 || words.length == 4)
      var parent = comps.slice(0, comps.length - 1);
      var module_name = parent.concat([words[0]]).join('.');
      if (words.length == 3) {
        implement_name = module_name;
      } else {
        implement_name = parent.concat([words[1]]).join('.');
      }
      if (lua_modules[module_name] === undefined) lua_modules[module_name] = [];
      lua_modules[module_name].push({
        name: module_name,
        implement: implement_name,
        path: path,
      });
    });
    var contents = [
      'define(function() {',
      '  var modules = ' + JSON.stringify(lua_modules, null, 2).replace(/\n/g, '\n  ') + ';',
      '  return modules;',
      '});'
    ]
    contents = contents.join('\n')
    grunt.file.write(options.configdir + 'lua_modules.js', contents);
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


  grunt.registerTask('build', ['template', 'copy', 'coffee', 'less', 'luamodulize']);

  grunt.registerTask('deploy-github', ['build', 'upload-github']);
  grunt.registerTask('deploy-gamelab', ['build', 'ssh_deploy:production']);
  grunt.registerTask('default', ['build']);

};
