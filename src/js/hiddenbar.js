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
  $.fn.hiddenbar = function() {
    $('.toggler', this).each(function() {
      toggle_button.apply(this, [null, true]);
    });
    $('.toggler', this).click(toggle_button);
    $('button', this).click(function() { this.blur(); });
  }
  