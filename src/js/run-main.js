
require(['jquery', 'underscore', 'power-assert', 'js/luaw', 'js/runui', 'domReady!'], 
  function ($, _, assert, Lua, runui) {
  var Member = runui.Member;
  var GroupView = runui.GroupView;
  var logging = runui.logging;

  runui.init();
  logging('info', 'init', 'init');
  


  Decoration = Member.extend({
    type: 'Decoration',
    importants: ['name'],
    alias: {
      'v': '回流率',
    },
    getTitle: function() { return this.get('name'); },
    getIcon: function() { return 'glyphicon-knight'; },
  });

  RoomView = GroupView.extend({
    cmds: {
      bt_remvoe: {label:'移除'},
      bt_remvoe1: {label:'移除'},
      bt_remvoe2: {label:'移除'},
      bt_remvoe3: {label:'移除'}
    },
    initialize: function (name) {
      this.name = name;
      this.modelClass = Decoration;
      GroupView.prototype.initialize.apply(this);
    },
    
    bt_remvoe: function(id) {
      this.co.remove(id);
    },
    bt_remvoe1: function(id) {
      this.co.remove(id);
    },
    bt_remvoe2: function(id) {
      this.co.remove(id);
    },
    bt_remvoe3: function(id) {
      this.co.remove(id);
    }
  });

  

  var appview = new RoomView("Room1");
  $('#workspace').append(appview.$el);
  $('#workspace').append($(GroupView.Breaker));
  var appview2 = new RoomView("Room2");
  $('#workspace').append(appview2.$el);
  var appview3 = new RoomView("Room3");
  $('#workspace').append(appview3.$el);
  $('#workspace').append($(GroupView.Breaker));
  var appview4 = new RoomView("Room4");
  $('#workspace').append(appview4.$el);

  appview.co.add({name:'abc', v:'222'});
  appview.co.add({name:'abc', v:'222'});
  appview.co.add({name:'abc', v:'222'});
  appview.co.add({name:'abc', v:'222'});
  appview.co.add({name:'abc', v:'222'});
  appview.co.add({name:'abc', v:'222'});
  appview.co.add({name:'abc', v:'222'});
  appview2.co.add({name:'abc'});

  logging('error', 't1', 'abcccccccccccccccccccccccccccccccccccccccccc');
  logging('info', 't1', {what:10, is:'abc'});
  




  function reload_lua() {
    require(['lua/main.lua'], function(LC) {
      Lua.lua_preload_from_code('main', LC.code);

      Lua.lua_core['print'] = function(msg) { console.log(msg); }
      Lua.lua_core['isarray'] = function() { return []; 'TODO'; }
      Lua.lua_core['newarray'] = Lua.lua_wrap(function() { return [];});
      //Lua.lua_libs['']

      var L = Lua.lua_module('main');

      console.log(Lua.lua_tableget(L, "g"));
      Lua.lua_tablesetw(L.metatable.str['__index'], "obj", {a:1, b:2});
      Lua.lua_tablesetw(L.metatable.str['__index'], "arr2", [3,4,5]);
      //Lua.lua_tablesetw(L.metatable.str['__index'], "print", function(msg) { console.log(msg); });
      //Lua.lua_tablesetw(L.metatable.str['__index'], "newarray", function() { return []; });
      //Lua.lua_tablesetw(L.metatable.str['__index'], "isarray", function() { return []; 'TODO'; });
      console.log(L)
      console.log(Lua.lua_tablegetcallw(L, "ElfDirector_decision", [null]));
    });
    // lua_tableset
    // lua_tablegetcall
    // lua_newtable(null, keyvalues...)

  }
  
  reload_lua();

  
});
