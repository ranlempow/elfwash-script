
define(['jquery', 'underscore', 'backbone', 'power-assert', 'keycodes', 'js/logging', 'bootstrap', 'require-css!css/basic'], 
function ($, _, Backbone, assert, KeyCodes, logging) {
  

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

  var Collection = Backbone.Collection.extend({
    add: function(models) {
      Backbone.Collection.prototype.add.apply(this, [models, {merge: true}]);
    },
  })

  var GroupView = Backbone.View.extend({
    default_el: '<div class="group" tabindex="0">',
    cmds: {},
    initialize: function () {
      this.setElement($(this.default_el));
      this.viewLabel || (this.viewLabel = this.name);

      this.id = GroupView.instances.length;
      GroupView.instances.push(this);
      _.bindAll(this, 'addItem', 'removeItem', 'changedItem',
                      'clickCommand', 'focusContainer', 'keyContainer',
                      'toggleMember', 'selectMember', 'previewMember', 'deselectAll');

      var prototype = Object.getPrototypeOf(this);
      for (var cmd_name in this.cmds) {
        var cmd = this.cmds[cmd_name];
        if (cmd.execute) {
          if (prototype[cmd_name] === undefined) {
            prototype[cmd_name] = cmd.execute;
          }
        }
      }

      this.co = new (Collection.extend({model: this.modelClass}))();
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
    hide: function() {
      this.$el.css('display', 'none');
    },
    show: function() {
      this.$el.css('display', '');
    },
    removeThis: function() {
      // TODO:
      GroupView.tabdown(true);
    },
    getView: function(name) {
      // TODO:
    },
    render: function() {
      this.$el.html();
      this.$el.append($('<div class="title">').html(this.viewLabel));
      var $button_group = $('<div class="button-group">');
      this.$el.append($button_group);
      for (command in this.cmds) {
        var label = this.cmds[command].label;
        var btn = $('<button class="command" tabindex="-1">').attr('command', command).text(label);
        btn.click(function() { this.blur(); });
        $button_group.append(btn);
      }
      this.$el.append("<ul>");
      this.co.each( function(model) {
        this.addItem(model, this.co);
      });
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
          return $(this).attr('id');
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
        this.select_id = $(ev.target).attr('id');
      }
      if (this.select_id !== null) {
        this.previewMember(ev, '#json-last-select');
      }
    },
    _renderJsonViewer: function(model, target_viewer) {
      if (model !== null) {
        $(target_viewer).attr('group_id', this.id).attr('member_id', model.id);
        $(target_viewer + ' pre').html(syntaxHighlightJson(model.toJSON(), model.changed, model.importants, model.alias, 2))
        $(target_viewer + ' .title').html(this.name + ' -> ' + model.getTitle());
      } else {
        $(target_viewer).removeAttr('group_id').removeAttr('member_id');
        $(target_viewer + ' pre').html('');
        $(target_viewer + ' .title').html('');
      }
    },
    _updateJsonViewer: function(model, options) {
      var deletion = options.deletion || false;
      for (var i in GroupView.json_viewer_ids) {
        var target_view = '#' + GroupView.json_viewer_ids[i];
        var $json_viewer = $(target_view);
        var group_id = $json_viewer.attr('group_id');
        var member_id = $json_viewer.attr('member_id');
        if (group_id == this.id && member_id == model.id) {
          if (deletion) {
            this._renderJsonViewer(null, target_view);
          } else {
            this._renderJsonViewer(model, target_view);
          }
        }
      }
    },
    previewMember: function(ev, target_view) {
      var target_view = target_view || '#json-preview';
      var $target = $(ev.target);
      if (! $target.hasClass('member')) {
        $target = $target.parents('.member').last()
      }
      var target_id = $target.attr('id');
      assert(target_id !== undefined);
      var model = this.co.get(target_id);
      this._renderJsonViewer(model, target_view);
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
      $item.html('').append($icon).append($('<span class="title">').text(title));
    },
    addItem: function (model, collection, options) {
      var $item = $('<li class="member">').attr('id', model.id);
      this._renderMember($item, model);
      $('ul', this.el).append($item);
    },
    removeItem: function(model, collection, options) {
      var $item = $('ul li[id='+ model.id +']', this.el);
      $item.remove();
      // 更新左側數據
      this._updateJsonViewer(model, {deletion:true})
    },
    changedItem: function(model, options) {
      var $item = $('ul li[id='+ model.id +']', this.el);
      this._renderMember($item, model);
      // 更新左側數據
      this._updateJsonViewer(model);
    },
    callCommand: function (command) {
      // execute command
      var error = null;
      try {
        if(!(command in this.cmds)) throw new Error('command "' + command + '" not in cmds');
        if(!(this[command] instanceof Function)) throw new Error('command "' + command + '" function is undefined');

        var requirement = this.cmds[command];
        var require_targets = requirement.targets || '?';
        var require_prompt = requirement.prompt || false;
        var select_id = this.select_id;
        var value = null;
        var other_target = null;
        if (require_prompt) {
          value = prompt(requirement.label + ' <- ' + requirement.prompt);
        }

        if (Array.isArray(require_targets)) {
          var contain_null = false;
          other_target = []
          for (var j in require_targets) {
            other_target[j] = null;
            for (var i in GroupView.instances) {
              var view = GroupView.instances[i];
              if (requirement.targets[j] == view.name) {
                other_target[j] = view.select_id;
              }
            }
            if (other_target[j] === null) {
              contain_null = requirement.targets[j];
              break;
            }
          }
          if (contain_null) {
            throw new Error('group "' + contain_null + '" need selection');
          }
        } else {
          switch(require_targets) {
            case '0':
              select_id = null;
              break;
            case '1':
              if (this.select_id === null) {
                throw new Error('group "' + this.name + '" need selection');
              }
              break;
            case '?':
              break;
            case 'A':
              other_target = {}
              for (var i in GroupView.instances) {
                var view = GroupView.instances[i];
                other_target[view.name] = view.select_id;
              }
              break;
            default:
              // equelment to '?'
              break;
          }
        }
      } catch (e) {
        error = e;
        logging('error', 'command', e);
      }
      if (error === null) { 
        this[command].apply(this, [this.select_id, other_target, value]);
      }
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
      var command = $(ev.target).attr('command');
      this.callCommand(command);
      this.$el[0].focus();
    }
  }, 
  // static
  {
    is_setup: false,
    instances: [],
    select_id: null,
    json_viewer_ids: ['json-fixed', 'json-last-select', 'json-preview'],
    Breaker: '<div class="breaker">',
    tabdown: function(next) {
      this.select_id = walksequence(next, this.select_id, this.instances.length);
      for (var i in this.instances) {
        var view = this.instances[i];
        view.$el[0].blur();
      }
      if (this.select_id !== null) {
        var view = this.instances[this.select_id];
        view.$el[0].focus();
      }
    },
    setup: function() {
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
    },
  });

  var Member = Backbone.Model.extend({
     initialize: function() {
      if (!this.typeName) {
        logging('error', 'member', 'member.typeName should be set, but member.typeName is null');
      }
      if (!this.has('id')) {
        var id = Member.createRandomId(this.typeName);
        this.set('id', id);
        logging.warn('member', 'member[' + this.typeName + '] had no id, create random id "'+ id +'" automatically')
      }
    },
    importants: [],
    alias: {},
    getTitle: function() {
      return this.get('label') || this.get('name') || this.id;
    },
    getIcon: function() { return 'glyphicon-knight'; },
  }, {
    createRandomId: function () {
      return (Math.random() * 100000 | 0).toString();
    }
  });


  $(function() {
    logging.$el = $('#event-logging pre');
  });
  

  function init() {
    GroupView.setup();
    $('.dropdown-toggle').dropdown();
    //$('.hidden-bar').hiddenbar();
    //$('.scroll-pane').jScrollPane();
    $('.scroll-pane').removeAttr('tabindex');
    $('#btn-enter').css('visibility', 'initial').click(function () {
      $('#loading-screen').css('display', 'none');  
    });
  }
  return { GroupView:GroupView, Member:Member, logging:logging, init:init };
});
