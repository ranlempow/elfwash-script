$(function () {
  
  Decoration = Backbone.Model.extend({
    name: null
  });
  
  Room = Backbone.Collection.extend({
    model: Decoration,
  });
  
  
  window.MemberView = Backbone.View.extend({
    default_el: '<div class="obj-container">',
    initialize: function (collection, commands) {
      this.setElement($(this.default_el));

      _.bindAll(this, 'render', 'addItem', 'removeItem', 'clickCommand', 'toggleMember', 'selectMember', 'deselectAll');
      _.bindAll.apply(null, $.merge([this], Object.keys(commands)));
      
      this.co = collection;
      this.co.bind('add', this.addItem);
      this.co.bind('remove', this.removeItem);
      this.cmds = commands;
      this.select_id = null;
      this.render();
    },
    events: {
      "click .member": "selectMember",
      "click button.bt":  "clickCommand",
      "click body": "deselectAll"
    },
    render: function() {
      this.$el.append($('<div class="title">').html(this.name));
      for (command in this.cmds) {
        var text = this.cmds[command];
        var btn = $('<button class="bt">').attr('command', command).text(text)
        this.$el.append(btn);
      }
      this.$el.append("<ul></ul>");
      this.deselectAll()
    },
    toggleMember: function(ev) {
      $(ev.target).toggleClass('select');
      if ($(ev.target).hasClass('select')) {
        this.select_id = $(ev.target).attr('cid');
      } else {
        this.select_id = null;
      }
    },
    selectMember: function(ev) {
      if (ev.ctrlKey) {
        this.toggleMember(ev)
      } else {
        this.deselectAll()
        $(ev.target).addClass('select')
        this.select_id = $(ev.target).attr('cid');
      }
      
    },
    deselectAll: function() {
      $('ul li', this.el).removeClass('select');
      this.select_id = null;
    },
    addItem: function (model, collection, options)  {
      var name = model.get('name');
      $('ul', this.el).append($('<li class="member">').attr('cid', model.cid).text(name));
    },
    removeItem: function(model, collection, options)  {
      $("ul li[cid="+ model.cid +"]", this.el).remove();
    },
    
    clickCommand: function (ev) {
      var command = $(ev.target).attr('command');
      if (this.select_id) {
        this[command](this.select_id);
      }
    }
  });
  
  var _array_metatable = lua_newtable(false, '__newindex', function(table, key, value) {
    if (!Number.isInteger(key)) {
      throw new Error("array index needs integer");
    }
    if ( key < (table.arraymode ? 0: 0)) {
      throw new Error("array index needs great then zero");
    }
    lua_rawset(table, key, value);
    //table.uints[key] = value;
  });

  function lua_wrap(object) {
    if (object === undefined || object === null) {
      return object;
    }
    if (object.str && object.uints) {
      return object;
    }
    if (typeof object == 'object') {
      var luatable = lua_newtable();
      if (Array.isArray(object)) {
        luatable.metatable = _array_metatable;
        for (var key in object) {
          lua_tableset(luatable, parseInt(key) + 1, lua_wrap(object[key]));
        }
      } else {
        for (var key in object) {
          lua_tableset(luatable, key, lua_wrap(object[key]));
        }
      }
      
      return luatable;
    }
    if (typeof object == 'function' && !object._wrapped_origin) {
      function wrapper() {
        var ret = object.apply(this, arguments);
        return [lua_wrap(ret)];
      }
      wrapper._wrapped_origin = object;
      return wrapper
    }
    return object;
  }

  function lua_unwrap(object) {
    if (object === undefined || object === null) {
      return object;
    }
    if (Array.isArray(object)) {
      return object.map(lua_unwrap);
    }
    if (typeof object == 'object') {
      if (object.metatable && object.metatable ==  _array_metatable) {
        var arr = [];
        for (var key in object.uints) {
          var idx = key - 1;
          arr[idx] = lua_unwrap(object.uints[key]);
        }
        return arr;
      } else {
        if (object.str) {
          var obj = {}
          for (var key in object.str) {
            obj[key] = lua_unwrap(object.str[key]);
          }
          return obj
        }
      }
      return null;
    }
    return object;
  }
  
  function lua_tablesetw() {
    var args = Array.prototype.slice.call(arguments);
    args[2] = lua_wrap(args[2]);
    return lua_tableset.apply(this, args);
  }
  
  function lua_tablegetw() {
    return lua_unwrap(lua_tableget.apply(this, arguments));
  }

  function lua_tablegetcallw() {
    return lua_unwrap(lua_tablegetcall.apply(this, arguments));
  }
  


  window.RoomView = window.MemberView.extend({
    initialize: function (name) {
      this.name = name;
      var cmds = {
        'bt_remvoe': '移除', 
        'bt_alart': '顯示物件'
      };
      var co = new Room({ view: this });
      
      window.MemberView.prototype.initialize.apply(this, [co, cmds]);
    },
    
    bt_remvoe: function(id) {
      console.log("remove ", id);
      this.co.remove(id);
    },

    bt_alart: function(id) {
      // TODO parse info
      console.log(this.co.get(id));
    }
  });
  
  var appview = new RoomView("使用者資料");
  appview.co.add({name:'playingMinite', value:0})
  appview.co.add({name:'money', value:0})
  $('body').append(appview.$el);
  // $('body').append($('<div style="clear:left">'));
  
  var appview2 = new RoomView("妖精資料庫");
  appview2.co.add({name:'id'})
  $('body').append(appview2.$el);
  

  var code = $('#lua-main').text()

  var L = lua_load(code)();
  // lua_tablesetw(L, "obj", {a:1, b:2});
  // lua_tablesetw(L, "arr2", [3,4,5]);
  lua_tablesetw(L, "print", function(msg) { console.log(msg); });
  lua_tablesetw(L, "newarray", function() { return []; });
  lua_tablesetw(L, "isarray", function() { return []; 'TODO what?'; });
  console.log(lua_tablegetcallw(L, "ElfDirector_decision", [self]));
  console.log(lua_tablegetcallw(L, "xxx", [123]));

  // lua_tableset
  // lua_tablegetcall
  // lua_newtable(null, keyvalues...)
  
  
});
