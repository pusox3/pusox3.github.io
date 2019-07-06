jQuery('html').addClass('hidden');

jQuery(document).ready(function ($) {
	$('html').removeClass('hidden');
	$('.carousel').carousel({
		interval: 4000
	})

	var $vid = $('.video-container');
	$(window).resize(function(){
		if(window.innerWidth <= 1175) $vid.addClass('embed-responsive');
		else $vid.removeClass('embed-responsive');
	});

	// $('.navbar-collapse').toggle(function(){
	// });

	$('.navbar-collapse').click(function(){
		$('.navbar-collapse').toggle("slide")
	});
});  
