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

		if (w >= 980) {
			$('#contacts iframe').css('src', 'https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d2541.6750081862233!2d30.47393241929627!3d50.42852646343829!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x638e8cfbdbe5fddc!2z0JTQtdGA0LbQsNCy0L3QuNC5INGD0L3RltCy0LXRgNGB0LjRgtC10YIg0YLQtdC70LXQutC-0LzRg9C90ZbQutCw0YbRltC5!5e0!3m2!1suk!2sua!4v1514663352076');
		}

		if (w > 760 && w < 980) {
			$('#contacts iframe').css('src', 'https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d2541.674641319027!2d30.474254284378056!3d50.428533298138596!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x638e8cfbdbe5fddc!2z0JTQtdGA0LbQsNCy0L3QuNC5INGD0L3RltCy0LXRgNGB0LjRgtC10YIg0YLQtdC70LXQutC-0LzRg9C90ZbQutCw0YbRltC5!5e0!3m2!1suk!2sua!4v1514663307096');
		}
		if (w > 480 && w <= 760) {
			$('#contacts iframe').css('src', 'https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d2541.6816117986273!2d30.474511776443478!3d50.42840343866395!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x638e8cfbdbe5fddc!2z0JTQtdGA0LbQsNCy0L3QuNC5INGD0L3RltCy0LXRgNGB0LjRgtC10YIg0YLQtdC70LXQutC-0LzRg9C90ZbQutCw0YbRltC5!5e0!3m2!1suk!2sua!4v1514663254438');
		}
		if (w <= 480) {
			$('#contacts iframe').css('width', w - 40 + 'px');
		}
	});
});