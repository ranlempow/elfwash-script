
require(['jquery', 'underscore', 'backbone', 'js/luaw', 'jScrollPane', 'bootstrap', 'hiddenbar', 'require-css!css/basic', 'domReady!'], 
  function ($, _, Backbone, Lua) {

  function syntaxHighlight(json, changed, importants, alias) {
    if (typeof json != 'string') {
       json = JSON.stringify(json, null, 2);
    }
    json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/>/g, '&gt;');
    json = json.replace(/ /g, '&nbsp;')//.replace(/\n/g, '<br>');
    span_render = function(cls, value) { return '<span class="' + cls + '">' + value + '</span>'; }
    return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
      var cls = 'number';
      if (/^"/.test(match)) {
        if (/:$/.test(match)) {
          cls = 'key';
          var key = match.replace(/^"/, '').replace(/":$/, '');
          if (importants && importants.indexOf(key) != -1) {
            cls = cls + ' importants';
          }
          if (alias && key in alias) { key = alias[key]; }
          if (changed && key in changed) {
            cls = cls + ' changed';
          }
          return span_render(cls, key) + span_render('colon', ':')
        } else {
          cls = 'string';
          var str = match.replace(/^"/, '').replace(/"$/, '');
          if (alias && str in alias) { str = alias[str]; }
          return span_render('quota', '"') + span_render(cls, str) + span_render('quota', '"')
        }
      } else if (/true|false/.test(match)) {
        cls = 'boolean';
      } else if (/null/.test(match)) {
        cls = 'null';
      }
      return span_render(cls, match);
    });
  }
  
  function logging(level, title, message) {
    $('#event-logging pre').append($('<span class="record">').text(message));

  }

  function walksequence(next, idx, length) {
    if (next) {
      if (idx === null || idx + 1 > length) {
        idx = 0;
      } else if (idx + 1 == length) {
        idx = null;
      } else {
        idx++;
      }
    } else {
      if (idx === null || idx - 1 < -1) {
        idx = length - 1;
      } else if (idx - 1 == -1) {
        idx = null;
      } else {
        idx--;
      }
    }
    return idx;
  }
  function tabdown(next) {
    var self = window.MemberView;
    self.select_id = walksequence(next, self.select_id, self.instances.length);
    for (var i in self.instances) {
      var view = self.instances[i];
      view.$el[0].blur();
    }
    if (self.select_id !== null) {
      var view = self.instances[self.select_id];
      view.$el[0].focus();
    }
  }

  $('body').keydown(function(event) {
    if (event.which == KeyCodes.RIGHT) {
      event.preventDefault();
      tabdown(true);
    }
    if (event.which == KeyCodes.LEFT) {
      event.preventDefault();
      tabdown(false);
    }
  });

  window.MemberView = Backbone.View.extend({
    default_el: '<div class="obj-container" tabindex="0">',
    initialize: function () {
      this.setElement($(this.default_el));

      this.id = window.MemberView.instances.length;
      window.MemberView.instances.push(this);
      _.bindAll(this, 'render', 'addItem', 'removeItem', 'changedItem', 'clickCommand', 'keyContainer',
                      'selectNext', 'toggleMember', 'selectMember', 'previewMember', 'deselectAll');
      _.bindAll.apply(null, $.merge([this], Object.keys(this.cmds)));
      this.co = new (Backbone.Collection.extend({model: this.modelClass}))({ view: this });
      this.co.bind('add', this.addItem);
      this.co.bind('remove', this.removeItem);
      this.co.bind('changed', this.changedItem);
      this.select_id = null;
      this.render();
    },
    events: {
      "keydown": "keyContainer",
      "keyup": "keyContainer",
      "click .member": "selectMember",
      "click button.command":  "clickCommand",
      "click body": "deselectAll",
      "mouseover .member": "previewMember",
    },
    render: function() {
      this.$el.append($('<div class="title">').html(this.name));
      var $button_group = $('<div class="button-group">');
      this.$el.append($button_group);
      for (command in this.cmds) {
        var text = this.cmds[command];
        var btn = $('<button class="command" tabindex="-1">').attr('command', command).text(text);
        btn.click(function() { this.blur(); });
        $button_group.append(btn);
      }
      this.$el.append("<ul>");
      this.deselectAll();
    },
    selectNext: function(next) {
      var idx = null;
      var elements = $('.member', this.el).toArray();
      if (this.select_id !== null) {
        idx = $('.member', this.el).map(function() {
          return $(this).attr('cid');
        }).get().indexOf(this.select_id);
      }
      idx = walksequence(next, idx, elements.length);
      if (idx !== null) {
        var ev = {target: elements[idx]};
        this.selectMember(ev, true);
      } else {
        this.deselectAll();
      }
    },
    toggleMember: function(ev) {
      if ($(ev.target).hasClass('select')) {
        this.deselectAll()
        this.select_id = null;
      } else {
        this.selectMember(ev, true);
      }
    },
    keyContainer: function(ev) {
      if (ev.type == 'keydown') {
        if (KeyCodes.isNumber(ev.which)) {
          ev.preventDefault();
          this.pushCommand(parseInt(KeyCodes.keyCodeToString(ev.which)) - 1, true);
        } else if (ev.which == KeyCodes.UP) {
          ev.preventDefault();
          this.selectNext(false);
        } else if (ev.which == KeyCodes.DOWN) {
          ev.preventDefault();
          this.selectNext(true);
        }
      } else if (ev.type == 'keyup') {
        if (KeyCodes.isNumber(ev.which)) {
          ev.preventDefault();
          this.pushCommand(parseInt(KeyCodes.keyCodeToString(ev.which)) - 1);
        }
      }
    },
    selectMember: function(ev, not_detect_funckey) {
      if (!not_detect_funckey && ev.ctrlKey) {
        return this.toggleMember(ev);
      } else if (!not_detect_funckey && ev.altKey) {
        return this.previewMember(ev, '#json-fixed');
      } else {
        this.deselectAll()
        $(ev.target).addClass('select')
        $(ev.target).addClass('last-select')
        this.select_id = $(ev.target).attr('cid');
      }
      if (this.select_id !== null) {
        this.previewMember(ev, '#json-last-select');
      }
    },
    previewMember: function(ev, target_view) {
      var target_view = target_view || '#json-preview';
      var over_id = $(ev.target).attr('cid');
      var model = this.co.get(over_id);
      $(target_view + ' pre').html(syntaxHighlight(model.toJSON(), model.changed, model.importants, model.alias))
      $(target_view + ' .title').html(this.name + ' -> ' + model.getTitle());
    },
    deselectAll: function() {
      $('ul li', this.el).removeClass('select');
      $('.member').removeClass('last-select');
      this.select_id = null;
    },
    addItem: function (model, collection, options)  {
      var title = model.getTitle();
      var icon = model.getIcon();
      var $item = $('<li class="member">').attr('cid', model.cid).append($('<img>').attr('src', icon)).append(title)
      $('ul', this.el).append($item);
    },
    removeItem: function(model, collection, options)  {
      $('ul li[cid='+ model.cid +']', this.el).remove();
    },
    changedItem: function(model, options) {
      // TODO: 更新左側數據

    },
    pushCommand: function (who, pushdown) {
      var $cmd;
      if (Number.isInteger(who)) {
        $cmd = $('button.command', this.el).get(who);
      } else {
        $cmd = $('button.command[command='+ who +']', this.el).get(0);
      }
      if ($cmd) {
        $cmd = $($cmd);
        if (pushdown) {
          $cmd.addClass('active');
        } else {
          $cmd.removeClass('active');
          $cmd.trigger('click');
        }
      }
    },
    clickCommand: function (ev) {
      var command = $(ev.target).attr('command');
      if (this.select_id) {
        this[command](this.select_id);
      }
    }
  });
  window.MemberView.instances = [];
  window.MemberView.select_id = null;





  
  




  Decoration = Backbone.Model.extend({
    importants: ['name'],
    alias: {
      'v': '回流率',
    },
    getTitle: function() { return this.get('name'); },
    getIcon: function() { return 'asset/愛麗絲妖精.png'; },
  });

  window.RoomView = window.MemberView.extend({
    initialize: function (name) {
      this.name = name;
      this.modelClass = Decoration;
      this.cmds = {'bt_remvoe': '移除', 'bt_remvoe1': '移除', 'bt_remvoe2': '移除', 'bt_remvoe3': '移除'};
      
      window.MemberView.prototype.initialize.apply(this);
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
  $('#workspace').append($('<div class="breaker">'));
  var appview2 = new RoomView("Room2");
  $('#workspace').append(appview2.$el);
  $('#workspace').append($('<div class="obj-container breaker">'));
  var appview3 = new RoomView("Room3");
  $('#workspace').append(appview3.$el);
  $('#workspace').append($('<div class="obj-container breaker">'));
  var appview4 = new RoomView("Room4");
  $('#workspace').append(appview4.$el);

  appview.co.add({name:'abc', v:'222'})
  appview.co.add({name:'abc', v:'222'})
  appview.co.add({name:'abc', v:'222'})
  appview.co.add({name:'abc', v:'222'})
  appview.co.add({name:'abc', v:'222'})
  appview.co.add({name:'abc', v:'222'})
  appview.co.add({name:'abc', v:'222'})
  appview2.co.add({name:'abc'})
  
  logging('abccccccccccccccccccccccccccccccccccccc');
  logging('abccccccccccccccccccccccccccccccccccccc');
  

  

  function reload_lua() {
    require(['lua/main.lua'], function(LC) {
      Lua.lua_preload_from_code('main', LC.code);

      Lua.lua_core['print'] = function(msg) { console.log(msg); }
      Lua.lua_core['isarray'] = function() { return []; 'TODO'; }
      Lua.lua_core['newarray'] = Lua.lua_wrap(function() { return [];});
      //Lua.lua_libs['']

      var L = Lua.lua_module('main');

      console.log(Lua.lua_tableget(L, "g"))
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
  $('.dropdown-toggle').dropdown();
  $('.hidden-bar').hiddenbar();
  $('.scroll-pane').jScrollPane();
  $('.scroll-pane').removeAttr('tabindex');
  $('#btn-enter').css('visibility', 'initial').click(function () {
    $('#loading-screen').css('display', 'none');  
  });
  
});
