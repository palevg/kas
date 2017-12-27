$(document).ready(function() {
	var menu = $('.menu');

	$(menu).on('click', function() {
		if ($(window).width() <= 760 && !menu.is(':hidden')) {
			menu.hide();
		}
	});

	$('#touch-menu').on('click', function(e) {
		//e.preventDefault();
		menu.slideToggle();
	});
	
	$(window).resize(function() {
		if ($(window).width() > 760 && menu.is(':hidden')) {
			menu.removeAttr('style');
		}
	});
});