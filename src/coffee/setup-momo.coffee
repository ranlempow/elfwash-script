define(['jquery', 'underscore', 'power-assert', 'js/logging', 'js/system', 'js/luaw', 'js/runui', 'js/hiddenbar'], \
  ($, _, assert, logging, system, Lua, mv, HiddenBar) ->

    Decoration = mv.Member.extend
      typeName: 'Decoration'
      typeLable: '裝飾品'
      importants: ['name']
      alias: {'v': '回流率'}
      defaults: {'v': 0 }
      
      getTitle: ()-> this.get('name') || this.get('id'); 
      getIcon: ()-> 'asset/愛麗絲妖精.png'
    

    BaseInfo = mv.Member.extend
      typeName: 'Info'
      typeLable: '基本資訊'
      importants: ['gameTime']
      alias: 
        'realTime': "現實時間"
        'gameTime': "遊戲時間"
      defaults: 
        'realTime': new Date().getTime()
        'gameTime': 0
      
      getTitle: ()-> new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')
      getIcon: ()-> 'asset/icon_clock.png'
    

    TimeView = mv.GroupView.extend
      cmds: 
        bt_speed1: 
          label:'x1'
          execute: ()->_setSpeedRatio(1)
        bt_speed2: 
          label:'x2'
          execute: ()->_setSpeedRatio(2)
        bt_speed3: 
          label:'x3'
          execute: ()->_setSpeedRatio(3)
        bt_speed4: 
          label:'x4'
          execute: ()->_this.setSpeedRatio(4)
        bt_speed10: 
          label:'x10'
          execute: ()->_this.setSpeedRatio(10)
        bt_speed100: 
          label:'x100'
          execute: ()->_this.setSpeedRatio(100)

      initialize: (name, view_lable) ->
        this.name = name if name 
        this.viewLable = view_lable if view_lable
        this.modelClass = BaseInfo
        mv.GroupView.prototype.initialize.apply(this)
      
      _setSpeedRatio = (ratio) -> logging.info "time", "set time speed to x#{ratio}"


    RoomView = mv.GroupView.extend
      cmds:
        bt_remvoe: 
          label:'移除'
          targets:'1'
          execute: (id)-> this.co.remove(id)
        bt_add: 
          label:'新增'
          execute: ()-> this.co.add({})

      initialize: (name, view_lable) ->
        this.name = name;
        this.viewLable = view_lable;
        this.modelClass = Decoration;
        mv.GroupView.prototype.initialize.apply(this);
      
    setup = () ->
      HiddenBar({id:'basic'})
          .button({id:'help', label:'欄位說明'}).parent
          .button({id:'download', label:'下載'}).parent
          .button({id:'save', label:'存檔'}).parent
          .button({id:'delete', label:'刪除'}).parent
          # .menu('abc')
          #     .button('a').parent
          #     .divider('b')
          #     .header('ccccccccccccccccccccccccccccccccc')
          #     .button('d').parent
          # .parent
          # .button('e');

      ## add room
      timeView = new TimeView("Time")
      $('#workspace').append(timeView.$el)
      $('#workspace').append($(mv.GroupView.Breaker))
      roomView = new RoomView("Room")
      $('#workspace').append(roomView.$el)
      $('#workspace').append($(mv.GroupView.Breaker))

      # appview3 = new RoomView("Room3");
      # $('#workspace').append(appview3.$el);
      # $('#workspace').append($(mv.GroupView.Breaker));
      # appview4 = new RoomView("Room4");
      # $('#workspace').append(appview4.$el);

      ## add room cell
      timeView.co.add({name: "Timer"});
      # appview.co.add({name:'abc', v:'222'});
      # appview.co.add({name:'abc', v:'222'});
      # appview.co.add({name:'abc', v:'222'});
      # appview.co.add({name:'abc', v:'222'});
      # appview.co.add({name:'abc', v:'222'});
      # appview.co.add({name:'abc', v:'222'});
      roomView.co.add({name:'abc'});

      # logging('info', 't1', {what:10, is:'abc'});

      #system.requireLuaModule(['lua/main.lua']);
      Lua.lib(
        print: (msg)->  console.log(msg)
        isarray: ()-> [] #'TODO';
        newarray: ()-> []
      )

    
    init = () ->
      # console.log(system.LuaVM)
      # console.log(Lua.get(system.LuaVM, "g"));
      Lua.set(system.LuaVM, "obj", {a:1, b:2});
      Lua.set(system.LuaVM, "arr2", [3,4,5]);
      console.log(Lua.call(system.LuaVM, "ElfDirector_decision", [null]));
    
    finalize = () -> 
      Lua.lib('pkg', null);
      Hiddenbar.package('pkg').removeAll();


    return {setup:setup, init:init, finalize:finalize}
)



















