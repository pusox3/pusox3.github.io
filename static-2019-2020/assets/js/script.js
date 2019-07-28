jQuery('body').addClass('hidden');
const mq = window.matchMedia("(max-device-width : 1024px)");

jQuery(document).ready(function ($) {
	$('body').removeClass('hidden');
	$('.carousel').carousel({
		interval: 4000
	})

	new WOW().init();

	if (mq.matches) {
		$('.wow').each(function () {
			$(this).attr('data-wow-delay', '0s');
		});
	}
});

