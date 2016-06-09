require.config({
  baseUrl: '.',
  paths: {
    'jquery': 'bower_components/jquery/dist/jquery',
    'underscore': 'bower_components/underscore/underscore',
    'backbone': 'bower_components/backbone/backbone',
    'luajs': 'thirdparty/lua',
    'keycodes': 'bower_components/js-keycodes/keycodes',
    'bootstrap': 'bower_components/bootstrap/dist/js/bootstrap',

    // sensei-grid
    'sensei-grid': 'bower_components/sensei-grid/dist/sensei-grid',
    'lodash': 'bower_components/lodash/lodash',

    // jScrollPane
    'jScrollPane': 'bower_components/jScrollPane/script/jquery.jscrollpane',
    'mousewheel': 'bower_components/jScrollPane/script/jquery.mousewheel',
    'mwheelIntent': 'bower_components/jScrollPane/script/mwheelIntent',

    // requirejs plugins
    'require-css': 'bower_components/require-css/css',
    'domReady': 'bower_components/domReady/domReady',
    'text': 'bower_components/text/text',
    
    'hiddenbar': 'js/hiddenbar',
  },
  shim: {
    'underscore':{
      exports: '_'
    },
    'backbone': {
      deps: ['underscore', 'jquery'],
      exports: 'Backbone'
    },
    'keycodes': {
      deps: ['jquery'],
      exports: 'KeyCodes'
    },
    'bootstrap': {
      deps: ['jquery', 'require-css!bower_components/bootstrap/dist/css/bootstrap'],
    },
    'sensei-grid': {
      deps: ['jquery', 'lodash', 'require-css!bower_components/sensei-grid/dist/sensei-grid'],
    },

    'mousewheel': {
      deps: ['jquery']
    },
    'mwheelIntent': {
      deps: ['jquery']
    },
    'jScrollPane' : {
      deps: ['jquery', 'mousewheel', 'mwheelIntent', 'require-css!bower_components/jScrollPane/style/jquery.jscrollpane']
    },
    

    // project
    'luajs': {
      exports: 'luajs',
      init: function () {
          return this;
      }
    },
    'hiddenbar': {
      deps: ['jquery', 'require-css!css/hiddenbar'],
    },
    'require-css!css/hiddenbar': {
      deps: ['bootstrap'],
    },
    'require-css!css/basic': {
      deps: ['bootstrap'],
    },
  },
});

"\
\
"