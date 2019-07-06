jQuery('body').addClass('hidden');

jQuery(document).ready(function ($) {
	$('body').removeClass('hidden');
	$('.carousel').carousel({
		interval: 4000
	})
});  
