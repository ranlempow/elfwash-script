$(function () {
    
    Decoration = Backbone.Model.extend({
        name: null
    });
    
    Room = Backbone.Collection.extend({
        model: Decoration,
    });
    
    
    window.MemberView = Backbone.View.extend({
        default_el: '<div class="container">',
        initialize: function (collection, commands) {
            this.setElement($(this.default_el));

            _.bindAll(this, 'render', 'addItem', 'removeItem', 'clickCommand', 'selectMember', 'deselectAll');
            
            this.co = collection;
            this.co.bind('add', this.addItem);
            this.co.bind('remove', this.removeItem);
            this.cmds = commands;
            this.render();
        },
        events: {
            "click .member": "selectMember",
            "click button.bt":  "clickCommand",
            "click body": "deselectAll"
        },
        render: function() {
            for (command in this.cmds) {
                var text = this.cmds[command];
                var btn = $('<button class="bt">').attr('command', command).text(text)
                this.$el.append(btn);
            }
            this.$el.append("<ul></ul>");
            this.deselectAll()
        },
        selectMember: function(ev) {
            this.deselectAll()
            $(ev.target).addClass('select')
            this.select_id = $(ev.target).attr('cid');
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
    
    window.RoomView = window.MemberView.extend({
        initialize: function () {
            var cmds = {'bt_remvoe': '移除'};
            var co = new Room({ view: this });
            _.bindAll.apply(null, $.merge([this], Object.keys(cmds)));
            window.MemberView.prototype.initialize.apply(this, [co, cmds]);
        },
        
        bt_remvoe: function(id) {
            this.co.remove(id);
        }
    });
    
    var appview = new RoomView();
    appview.co.add({name:'abc'})
    $('body').append(appview.$el);
    console.log(appview.$el)

    var appview2 = new RoomView();
    appview2.co.add({name:'abc'})
    $('body').append(appview2.$el);
    console.log(appview2.$el)


    var code = $('#lua-main').text()
    var L = lua_load(code)();
    //console.log(L.str.my_func(3));
    console.log(lua_tableget(L, "g"))
    // lua_tableset
    // lua_tablegetcall
    // lua_newtable(null, keyvalues...)

    //捲到最下面
    //$("#mydiv").scrollTop($("#mydiv")[0].scrollHeight);
    
    var data = [
        {id: 1, title: "test"},
        {id: 2, title: "foo bar"}
    ];
    var columns = [
        {name: "id", type: "string"},
        {name: "title", type: "string"}
    ];
    
    var grid = $(".example").grid(data, columns);

    grid.registerEditor(BasicEditor);

    grid.events.on("editor:save", function(data, $cell) {
      console.info("save cell:", data, $cell);
    });
    grid.events.on("editor:load", function(data, $cell) {
		//console.info("set value in editor:", data, $cell);
	});
	grid.events.on("cell:select", function($cell) {
		console.info("active cell:", $cell);
	});
	grid.events.on("cell:clear", function(oldValue, $cell) {
		console.info("clear cell:", oldValue, $cell);
	});
	grid.events.on("cell:deactivate", function($cell) {
		console.info("cell deactivate:", $cell);
	});
	grid.events.on("row:select", function($row) {
		console.info("row select:", $row);
	});
	grid.events.on("row:remove", function(data, row, $row) {
		console.info("row remove:", data, row, $row);
	});
  grid.events.on("row:mark", function($row) {
    console.info("row mark:", $row);
  });
  grid.events.on("row:unmark", function($row) {
    console.info("row unmark:", $row);
  });
	grid.events.on("row:save", function(data, $row, source) {
		console.info("row save:", source, data);
		// save row via ajax or any other way
		// simulate delay caused by ajax and set row as saved
		setTimeout(function() {
			grid.setRowSaved($row);
		}, 1000);
	});
  
    grid.render();
    console.info(grid);
    
});
