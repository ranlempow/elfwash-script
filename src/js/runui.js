
define(['jquery', 'underscore', 'backbone', 'js/luaw', 'power-assert', 'keycodes', 'jScrollPane', 'bootstrap', 'hiddenbar', 'require-css!css/basic'], 
  function ($, _, Backbone, Lua, assert, KeyCodes) {
  function syntaxHighlightJson(json, changed, importants, alias, spaces) {
    if (typeof json != 'string') {
       json = JSON.stringify(json, null, spaces);
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
  
  function logging(level, tag, message, time) {
    function padChar(string, length, char) {
      char = char || '0';
      string = string.toString();
      var zeros = length - string.length
      while (zeros > 0) {
        string = char  + string;
        zeros--;
      }
      return string;
    }
    function formatDate(date, datePart, timePart, millisecondsPart) {
      var dateString = '';
      if (datePart) dateString += date.getFullYear() + '-' + padChar(date.getMonth() + 1, 2) + '-' + padChar(date.getDate(), 2);
      if (datePart && timePart) dateString += ' ';
      if (timePart) dateString += padChar(date.getHours(), 2) + ":" + padChar(date.getMinutes(), 2) + ":" +padChar(date.getSeconds(), 2);
      if (timePart && millisecondsPart) dateString += ":" + padChar(date.getMilliseconds(), 4);
      return dateString;
    }

    if (level in logging.level) {
      level = logging.level[level];
    }
    var level_string = Object.keys(logging.level).filter(function(key) {
      return logging.level[key] == level;
    })


    if (!time) time = new Date(0);
    if (message instanceof Error) {
      message = message.message;
    } else if(message instanceof Object) {
      message = syntaxHighlightJson(message);
    } else if(! (message instanceof String)) {
      message = message.toString();
    }
    assert(logging.levels.indexOf(level) != -1);
    logging.$view.append(
      $('<span class="'+ level_string +' record">').append(
        $('<span class="timestamp">').text('[' + formatDate(new Date(), false, true, true) + ']'),
        $('<span class="time">').text('[' + formatDate(time, true, true, false) + ']'),
        $('<span class="level">').text('[' + padChar(level_string, 5, ' ') + ']'),
        $('<span class="tag">').text(tag + ':'),
        $('<span class="message">').html(message)
      )
    );
  }

  logging.level = {};
  logging.level.trace = 0;
  logging.level.debug = 10;
  logging.level.info = 30;
  logging.level.warn = 40;
  logging.level.error = 50;
  logging.level.fatal = 60;
  logging.levels = [];
  for (var k in logging.level) {
    logging[k.toUpperCase()] = logging.level[k];
    logging[k] = (function(level) {
      return function(tag, message, time) {
        logging(level, tag, message, time);
      }
    })(logging.level[k]);
    logging[k].level = logging.level[k];
    logging[k].getLogger = (function(level) {
      return function(tag) {
        return function(message, time) {
          logging(level, tag, message, time);
        }
      }
    })(logging.level[k]);
    logging.levels.push(logging.level[k]);
  }
  logging.getLogger = function(tag) {
    return function(level, message, time) {
      logging(level, tag, message, time);
    }
  }
  logging.$view = $('#event-logging pre')
  




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


  var GroupView = Backbone.View.extend({
    default_el: '<div class="obj-container" tabindex="0">',
    initialize: function () {
      this.setElement($(this.default_el));

      this.id = GroupView.instances.length;
      GroupView.instances.push(this);
      _.bindAll(this, 'render', 'addItem', 'removeItem', 'changedItem', 'clickCommand', 'focusContainer', 'keyContainer',
                      'selectNext', 'toggleMember', 'selectMember', 'previewMember', 'deselectAll');
      //_.bindAll.apply(null, $.merge([this], Object.keys(this.cmds)));


      this.co = new (Backbone.Collection.extend({model: this.modelClass}))(); //({ view: this });
      this.co.bind('add', this.addItem);
      this.co.bind('remove', this.removeItem);
      this.co.bind('changed', this.changedItem);
      this.select_id = null;
      this.render();
    },
    events: {
      "keydown": "keyContainer",
      "keyup": "keyContainer",
      "focus": "focusContainer",
      "click .member": "selectMember",
      "click button.command":  "clickCommand",
      //"click body": "deselectAll",
      "mouseover .member": "previewMember",
    },
    render: function() {
      this.$el.append($('<div class="title">').html(this.name));
      var $button_group = $('<div class="button-group">');
      this.$el.append($button_group);
      for (command in this.cmds) {
        var label = this.cmds[command].label;
        var btn = $('<button class="command" tabindex="-1">').attr('command', command).text(label);
        btn.click(function() { this.blur(); });
        $button_group.append(btn);
      }
      this.$el.append("<ul>");
      this.deselectAll();
    },
    focusContainer: function(ev) {
      GroupView.select_id = this.id;
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
      var $target = $(ev.target);
      if (! $target.hasClass('member')) {
        $target = $target.parents('.member').last()
      }
      var target_id = $target.attr('cid');
      assert(target_id !== undefined);
      var model = this.co.get(target_id);
      $(target_view).attr('group_id', this.id).attr('member_id', target_id);
      $(target_view + ' pre').html(syntaxHighlightJson(model.toJSON(), model.changed, model.importants, model.alias, 2))
      $(target_view + ' .title').html(this.name + ' -> ' + model.getTitle());
    },
    deselectAll: function() {
      $('ul li', this.el).removeClass('select');
      $('.member').removeClass('last-select');
      this.select_id = null;
    },
    _renderMember: function($item, model) {
      var title = model.getTitle();
      var icon = model.getIcon();
      var $icon = null;
      if (icon.startsWith('glyphicon')) {
        $icon = $('<span class="glyphicon '+ icon + '" aria-hidden="true">');
      } else if (icon === null) {
        $icon = $('<span class="glyphicon glyphicon-knight" aria-hidden="true">');
      } else {
        $icon = $('<img>').attr('src', icon);
      }
      $item.html('').append($icon).append(title)
    },
    addItem: function (model, collection, options) {
      var $item = $('<li class="member">').attr('cid', model.cid);
      this._renderMember($item, model);
      $('ul', this.el).append($item);
    },
    removeItem: function(model, collection, options) {
      var $item = $('ul li[cid='+ model.cid +']', this.el);
      $item.remove();
      // TODO: 更新左側數據

    },
    changedItem: function(model, options) {
      var $item = $('ul li[cid='+ model.cid +']', this.el);
      this._renderMember($item, model);
      // TODO: 更新左側數據

    },
    pushCommand: function (who, is_pushdown) {
      /** when user push command alt-key
       *  who: index or name of command.
       *  is_pushdown: push down or release up
       */
      var $cmd;
      if (Number.isInteger(who)) {
        var index = who;
        $cmd = $('button.command', this.el).get(index);
      } else {
        var name = who;
        $cmd = $('button.command[command='+ name +']', this.el).get(0);
      }
      if ($cmd) {
        $cmd = $($cmd);
        if (is_pushdown) {
          $cmd.addClass('active');
        } else {
          $cmd.removeClass('active');
          $cmd.trigger('click');
        }
      }
    },
    clickCommand: function (ev) {
      // execute command
      var command = $(ev.target).attr('command');
      assert(command in this.cmds);
      assert(this[command] instanceof Function);
      requirement = this.cmds[command]
      var require_targets = requirement.targets || '?';
      var require_prompt = requirement.prompt || false;
      var prompt_value = null;
      if (require_prompt) {
        prompt_value = prompt(requirement.label + ' <- ' + requirement.prompt);
      }
      if (Array.isArray(require_targets)) {
        var contain_null = false;
        var other_target = []
        for (var j in require_targets) {
          other_target[j] = null;
          for (var i in GroupView.instances) {
            var view = GroupView.instances[i];
            if (requirement.targets[j] == view.name) {
              other_target[j] = view.select_id;
            }
          }
          if (other_target[j] === null) {
            contain_null = true;
            break;
          }
        }
        if (!contain_null) {
          this[command].apply(this, [this.select_id, other_target, prompt_value]);
        }
      } else {
        switch(require_targets) {
          case '0':
            this[command](null, null, prompt_value);
            break;
          case '1':
            if (this.select_id !== null) {
              this[command](this.select_id, null, prompt_value);
            }
            break;
          case '?':
            this[command](this.select_id, null, prompt_value);
            break;
          case 'A':
            var other_target = {}
            for (var i in GroupView.instances) {
              var view = GroupView.instances[i];
              other_target[view.name] = view.select_id;
            }
            this[command](this.select_id, other_target, prompt_value);
            break;
          default:
            // equelment to '?'
            this[command](this.select_id, null, prompt_value);
            break;
        }
      }
    }
  });
  GroupView.is_setup = false;
  GroupView.instances = [];
  GroupView.select_id = null;
  GroupView.tabdown = function(next) {
    this.select_id = walksequence(next, this.select_id, this.instances.length);
    for (var i in this.instances) {
      var view = this.instances[i];
      view.$el[0].blur();
    }
    if (this.select_id !== null) {
      var view = this.instances[this.select_id];
      view.$el[0].focus();
    }
  }
  GroupView.setup = function() {
    if (! GroupView.is_setup ) {
      $('body').keydown(function(ev) {
        if (ev.which == KeyCodes.RIGHT) {
          ev.preventDefault();
          GroupView.tabdown(true);
        }
        if (ev.which == KeyCodes.LEFT) {
          ev.preventDefault();
          GroupView.tabdown(false);
        }
      });
      GroupView.is_setup = true;
    } 
  }
  GroupView.Breaker = '<div class="breaker">';

  var Member = Backbone.Model.extend({
     initialize: function() {

      if (!this.has('id')) {
        var id = Member.createRandomId(this.type);
        this.set('id', id);
      }
      if (!this.has('type')) {
        // ...  
      }
    },
    importants: [],
    alias: {},
    getTitle: function() { return this.get('name'); },
    getIcon: function() { return 'asset/愛麗絲妖精.png'; },
  });
  Member.createRandomId = function() {
    return (Math.random() * 100000 | 0).toString();
  }

  function init() {
    GroupView.setup();
    $('.dropdown-toggle').dropdown();
    $('.hidden-bar').hiddenbar();
    //$('.scroll-pane').jScrollPane();
    $('.scroll-pane').removeAttr('tabindex');
    $('#btn-enter').css('visibility', 'initial').click(function () {
      $('#loading-screen').css('display', 'none');  
    });
  }
  return { GroupView:GroupView, Member:Member, logging:logging, init:init };
});
