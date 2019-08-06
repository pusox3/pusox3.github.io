jQuery('body').addClass('hidden');
const mq = window.matchMedia("(max-device-width : 1024px)");

jQuery(document).ready(function ($) {
	$('body').removeClass('hidden');
	$('#myCarousel1, #myCarousel2').carousel({
		interval: 3000
	});


	new WOW().init();

	if (mq.matches) {
		$('.wow').each(function () {
			$(this).attr('data-wow-delay', '0s');
		});
	}
});

