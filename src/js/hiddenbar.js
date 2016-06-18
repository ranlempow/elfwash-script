define(['jquery', 'underscore', 'power-assert', 'keycodes', 'js/logging', 'require-css!css/hiddenbar'], 
  function ($, _, assert, KeyCodes, logging) {

  function toggle_button(ev, dont_toggle) {
    var $this = $(this);
    if (!dont_toggle) { $this.parent().toggleClass('toggled') };
    var menu_right = $this.parent().hasClass('hidden-right')
    var isToggled = $this.parent().hasClass('toggled');
    var arrow = 'left';
    if (!menu_right && !isToggled) { arrow = 'right'; }
    if (menu_right && isToggled) { arrow = 'right'; }

    if (arrow == 'left') {
      $this.html('<span class="glyphicon glyphicon-menu-left" aria-hidden="true"></span>')
    } else {
      $this.html('<span class="glyphicon glyphicon-menu-right" aria-hidden="true"></span>')
    }
  }
  /*
  <div class="dropdown btn-group btn-group-sm">
      <button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown">
        讀檔 <span class="caret"></span>
      </button>
      <ul class="dropdown-menu" role="menu">
        <li><a href="#">Action2</a></li>
        <li><a href="#">Another action</a></li>
        <li><a href="#">Something else here</a></li>
        <li><a href="#">Separated link</a></li>
        <li class="divider"></li>
        <li class="dropdown-submenu">
          <a href="#">Hover me for more options</a>
          <ul class="dropdown-menu">
            <li><a href="#">Second level</a></li>
            <li class="dropdown-submenu">
              <a href="#">Even More..</a>
              <ul class="dropdown-menu">
                  <li><a href="#">3rd level</a></li>
                  <li><a href="#">3rd level</a></li>
              </ul>
            </li>
            <li><a href="#">Second level</a></li>
            <li><a href="#">Second level</a></li>
          </ul>
        </li>
      </ul>
  </div>
  */

  function _icon(css_class) {
    return $('<span aria-hidden="true">').addClass(css_class);
  }

  function _createbar($bar, bar) {
    if (!$bar || $bar.length == 0) {
      $bar = $('<div class="btn-group btn-group-sm hidden-bar">')
          .addClass(bar.id)
          .append(
            $('<button type="button" class="btn btn-default toggler">')
                .append('<span class="glyphicon glyphicon-menu-left" aria-hidden="true">'),
            $('<button type="button" class="btn btn-default toggler">')
                .append('<span class="glyphicon glyphicon-menu-right" aria-hidden="true">')
          );

      $bar.find('.toggler')
          .click(function() {
            $(this).parent().toggleClass('toggled')
          });
    }
    $bar.addClass(bar.right === true ? 'hidden-right' : 'hidden-left');
    $bar.removeClass(bar.right === true ? 'hidden-left' : 'hidden-right');

    return $bar;
  }

  


  function HiddenBar(bar, package) {
    if (this == window) return new HiddenBar(bar);
    if (typeof bar === 'string') bar = {id: bar};
    if (package) bar.package = package;

    var $bar = $('div.hidden-bar.' + bar.id);
    $bar = _createbar($bar, bar);
    var selector = '.hidden-bar-overlay.' + (bar.right === true ? 'hidden-right' : 'hidden-left');
    if ($(selector).children().index($bar) == -1) {
      $bar.detach();
      $(selector).append($bar);
    }
    
    this.$bar = $bar;
    this.package = package;
    return this;
  }
  HiddenBar.prototype._add = function($item, item) {
    if (item.position == 'first') {
      this.$bar.children('button.toggler:first-child').after($item);
    } else if (item.position == 'last') {
      this.$bar.children('button.toggler:last-child').before($item);
    } else if (item.position.after) {
      this.$bar.children('.' + item.position.after).after($item);
    } else if (item.position.before) {
      this.$bar.children('.' + item.position.before).before($item);
    }
  }
  HiddenBar.prototype._create_button = function($btn, button) {
    if (!$btn || $btn.length == 0) {
      $btn = $('<button type="button" class="btn btn-default">')
          .addClass(button.id)
          .click(function() { this.blur(); });
    }
    $btn.$body = $btn;
    HiddenButton._set_body($btn, button);
    return $btn;
  }
  HiddenBar.prototype._create_menu = function($menu, menu) {
    var $expend_button;
    var $menu_list;
    var $menu;
    if (!$menu || $menu.length == 0) {
      $expend_button = $('<button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown">')
      $menu_list = $('<ul class="dropdown-menu" role="menu">');
      $menu = $('<div class="dropdown btn-group btn-group-sm menu-root">')
          .addClass(menu.id)
          .append($expend_button)
          .append($menu_list);

    } else {
      $expend_button = $menu.children('button');
      $menu_list = $menu.children('ul');
    }
    $menu.$expend_button = $expend_button;
    $menu.$menu_list = $menu_list;
      
    HiddenMenu._set_body($menu, menu)
    $expend_button.append($('<span class="caret">'));   
    return $menu;
  }
  HiddenBar.prototype._find_button = function(button) {
    return this.$bar.children('button.' + button.id);
  }
  HiddenBar.prototype._find_menu = function(menu) {
    return this.$bar.children('div.dropdown.' + menu.id);
  }
  HiddenBar.prototype.button = function(button) {
    return new HiddenButton(button, this.$bar, this);
  }
  HiddenBar.prototype.menu = function(menu) {
    return new HiddenMenu(menu, this.$bar, this);
  }
  HiddenBar.prototype.remove = function() {
    this.$bar.remove();
    return this.parent;
  }

  function HiddenButton(button, $parent, parent) {
    if (typeof button === 'string') button = {id: button};
    button.position || (button.position = 'last');
    this.package = parent.package;
    if (!button.package) button.package = this.package;

    var $btn = parent._find_button(button);
    $btn = parent._create_button($btn, button);
    $btn.detach();
    parent._add($btn, button);

    this.parent = parent;
    this.$btn = $btn;

    if (button.click) this.click(button.click);
    return this;
  }
  HiddenButton.prototype.remove = function() {
    this.$btn.remove();
    return this.parent;
  }
  HiddenButton.prototype.click = function(handler) {
    this.$btn.$body.click(handler);
    return this;
  }
  
  HiddenButton._set_body = function($btn, button) {
    $btn.$body.attr('value', button.value || button.id)
        .html('');
    if (button.icon && typeof button.icon == 'string') {
        button.icon = $('<span>').addClass(button.icon);
    }
    if (button.icon) $btn.$body.append(button.icon);
    $btn.$body.append(button.label || button.id);
    if (button.package) $btn.attr('package', button.package);
  }

  function HiddenMenu(menu, $parent, parent) {
    if (typeof menu === 'string') menu = {id: menu};
    menu.position || (menu.position = 'last');
    this.package = parent.package;
    if (!menu.package) menu.package = this.package;

    $menu = parent._find_menu(menu);
    $menu = parent._create_menu($menu, menu);
    
    $menu.detach();
    parent._add($menu, menu);
    
    this.parent = parent;
    this.$menu = $menu;

    if (menu.click) this.click(menu.click);
    if (menu.lazy) this.lazy(menu.lazy);
    return this;
  }
  HiddenMenu.prototype._add = function($item, item) {
    if (item.position == 'first') {
      this.$menu.children('ul').prepend($item);
    } else if (item.position == 'last') {
      this.$menu.children('ul').append($item);
    } else if (item.position.after) {
      this.$menu.children('ul').children().children('a.' + item.position.after).parent().after($item);
    } else if (item.position.before) {
      this.$menu.children('ul').children().children('a.' + item.position.before).parent().before($item);
    }
  }
  HiddenMenu.prototype._create_button = function($btn, button) {
    var $a;
    if (!$btn || $btn.length == 0) {
      $a = $('<a href="#">').addClass(button.id);
      $btn = $('<li>').append($a);
    } else {
      $a = $btn.children('a');
    }
    $btn.$body = $a;
    HiddenButton._set_body($btn, button);
    return $btn;
  }
  HiddenMenu.prototype._create_menu = function($menu, menu) {
    var $expend_button;
    var $menu_list;
    var $menu;
    if (!$menu || $menu.length == 0) {
      $expend_button = $('<a href="#"></a>');
      $menu_list = $('<ul class="dropdown-menu" role="menu">');
      $menu = $('<li class="dropdown-submenu">')
          .addClass(menu.id)
          .append($expend_button)
          .append($menu_list);
    } else {
      $expend_button = $menu.children('a');
      $menu_list = $menu.children('ul');
    }
    $menu.$expend_button = $expend_button;
    $menu.$menu_list = $menu_list;
      
    HiddenMenu._set_body($menu, menu)
    return $menu;
  }
  HiddenMenu.prototype._create_divider = function($btn, button) {
    if (!$btn || $btn.length == 0) {
      $btn = $('<li class="divider">')
          .addClass(button.id);
    }
    return $btn;
  }
  HiddenMenu.prototype._create_header = function($btn, button) {
    if (!$btn || $btn.length == 0) {
      $btn = $('<li class="dropdown-header">')
          .addClass(button.id);
    }
    $btn.html('');
    $btn.append(button.label || button.id);
    return $btn;
  }
  HiddenMenu.prototype._find_button = function(button) {
    return this.$menu.children('ul').children().children('a.' + button.id).parent();
  }
  HiddenMenu.prototype._find_menu = function(menu) {
    return this.$menu.children('ul').children('li.dropdown-submenu.' + menu.id);
  }
  HiddenMenu.prototype.button = function(button) {
    return new HiddenButton(button, this.$menu, this);
  }
  HiddenMenu.prototype.menu = function(menu) {
    return new HiddenMenu(menu, this.$menu, this);
  }
  HiddenMenu.prototype.divider = function(button) {
    if (typeof button === 'string') button = {id: button};
    button.position || (button.position = 'last');
    
    var $btn = this.$menu.children('ul').children('li.divider.' + button.id);
    $btn = this._create_divider($btn, button);
    $btn.detach();
    this._add($btn, button);


    if (button.package) {
      $btn.attr('package', button.package);
    } else {
      if (this.package) $btn.attr('package', this.package);
    }
    return this;
  }
  HiddenMenu.prototype.header = function(button) {
    if (typeof button === 'string') button = {id: button};
    button.position || (button.position = 'last');

    var $btn = this.$menu.children('ul').children('dropdown-header.' + button.id);
    $btn = this._create_header($btn, button);
    $btn.detach();
    this._add($btn, button);
    
    if (button.package) {
      $btn.attr('package', button.package);
    } else {
      if (this.package) $btn.attr('package', this.package);
    }
    return this;
  }
  
  HiddenMenu.prototype.remove = function() {
    this.$menu.remove();
    return this.parent;
  }
  HiddenMenu.prototype.click = function(handler) {
    this.$menu.$expend_button.click(handler);
    return this;
  }
  HiddenMenu.prototype.lazy = function(handler) {
    //this.$menu.$expend_button.click(handler);
    return this;
  }
  HiddenMenu._set_body = function($menu, menu) {
    $menu.attr('value', menu.value || menu.id)
    if (menu.package) $menu.attr('package', menu.package);

    $menu.$expend_button
        .attr('value', menu.value || menu.id)
        .html('');

    if (menu.icon && typeof menu.icon == 'string') {
        menu.icon = $('<span>').addClass(menu.icon);
    }
    if (menu.icon) $menu.$expend_button.append(menu.icon);
    $menu.$expend_button.append(menu.label || menu.id);

  }


  HiddenBar.package = function(package) {
    return new HiddenPackage(package);
  }
  HiddenBar.removeAll = function() {
    $('.hidden-bar-overlay').html('');
  }

  function HiddenPackage(package) {
    this.package = package
  }
  HiddenPackage.prototype.HiddenBar = function(bar) {
    return new HiddenBar(bar, this.package);
  }
  HiddenPackage.prototype.removeAll = function() {
    $('.hidden-bar-overlay').find('*[package=' + this.package + ']').remove();
  }



  // $.fn.hiddenbar = function() {
  //   $('.toggler', this).each(function() {
  //     toggle_button.apply(this, [null, true]);
  //   });
  //   $('.toggler', this).click(toggle_button);
  //   $('button', this).click(function() { this.blur(); });
  // }

  return HiddenBar;
});