define(['jquery', 'underscore', 'power-assert', 'js/logging', 'js/system', 'js/luaw', 'js/runui', 'js/hiddenbar'], 
  function ($, _, assert, logging, system, Lua, mv, HiddenBar) {


  var Decoration = mv.Member.extend({
    typeName: 'Decoration',
    typeLable: '裝飾品',
    importants: ['name'],
    alias: {
      'v': '回流率',
    },
    defaults: {
      'v': 0,
    },
    getTitle: function() { return this.get('name') || this.get('id'); },
    getIcon: function() { return 'asset/愛麗絲妖精.png'; },
  });

  var RoomView = mv.GroupView.extend({
    cmds: {
      bt_remvoe: {
        label:'移除3',
        targets:'1',
        execute:function(id) {
          this.co.remove(id);
        }
      },
      bt_remvoe1: {label:'移除'},
      bt_remvoe2: {label:'移除'},
      bt_remvoe3: {label:'移除'}
    },
    initialize: function (name, view_lable) {
      this.name = name;
      this.viewLable = view_lable;
      this.modelClass = Decoration;
      mv.GroupView.prototype.initialize.apply(this);
    },
    
    //bt_remvoe: function(id) {
    //  this.co.remove(id);
    //},
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

  
  function setup() {

    HiddenBar({id:'basic'})
        .button({id:'help', label:'欄位說明'}).parent
        .button({id:'download', label:'下載'}).parent
        .button({id:'save', label:'存檔'}).parent
        .button({id:'delete', label:'刪除'}).parent
        .menu('abc')
            .button('a').parent
            .divider('b')
            .header('ccccccccccccccccccccccccccccccccc')
            .button('d').parent
        .parent
        .button('e');

    console.log(HiddenBar({id:'a', right:true}).menu('c').menu('r').button('b'));
    console.log(HiddenBar({id:'a2', right:false}).menu('c').menu('r').button('f'));

    
    var appview = new RoomView("Room1");
    $('#workspace').append(appview.$el);
    $('#workspace').append($(mv.GroupView.Breaker));
    var appview2 = new RoomView("Room2");
    $('#workspace').append(appview2.$el);
    var appview3 = new RoomView("Room3");
    $('#workspace').append(appview3.$el);
    $('#workspace').append($(mv.GroupView.Breaker));
    var appview4 = new RoomView("Room4");
    $('#workspace').append(appview4.$el);

    appview.co.add({v:'222'});
    appview.co.add({name:'abc', v:'222'});
    appview.co.add({name:'abc', v:'222'});
    appview.co.add({name:'abc', v:'222'});
    appview.co.add({name:'abc', v:'222'});
    appview.co.add({name:'abc', v:'222'});
    appview.co.add({name:'abc', v:'222'});
    appview2.co.add({name:'abc'});

    logging('error', 't1', 'abcccccccccccccccccccccccccccccccccccccccccc');
    logging('info', 't1', {what:10, is:'abc'});

    //system.requireLuaModule(['lua/main.lua']);
    Lua.lib({
      print: function(msg) { console.log(msg); },
      isarray: function() { return []; 'TODO'; },
      newarray: function() { return [];},
    });

  }
  
  function init() {
    console.log(system.LuaVM)
    console.log(Lua.get(system.LuaVM, "g"));
    Lua.set(system.LuaVM, "obj", {a:1, b:2});
    Lua.set(system.LuaVM, "arr2", [3,4,5]);
    console.log(Lua.call(system.LuaVM, "ElfDirector_decision", [null]));
  }
  
  function finalize() {
    Lua.lib('pkg', null);
    Hiddenbar.package('pkg').removeAll();
  }
  
  

  return {setup:setup, init:init, finalize:finalize};
});





















