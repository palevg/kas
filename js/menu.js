$(document).ready(function() {
	var menu = $('.menu');

	menu.on('click', function() {
		if ($(window).width() <= 760 && !menu.is(':hidden')) {
			menu.hide();
		}
	});

	$('#touch-menu').on('click', function(e) {
		//e.preventDefault();
		menu.slideToggle();
	});
	
	$(window).resize(function() {
		var w = $(window).width();
		if (w > 760 && menu.is(':hidden')) {
			menu.removeAttr('style');
		}
		/*if (w <= 480) {
			$('#map_canvas').css('width', w - 40 + 'px');
		}*/
	});
});