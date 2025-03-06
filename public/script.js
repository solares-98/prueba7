$(".front").click(function() {
	if ( $(".library-card.envelope").hasClass("card-in") ) {
		$(".library-card.envelope").toggleClass("card-in");
	}
	$(".library-card.envelope").toggleClass("card-out");
});

$(".submit").click(function(e) {
	e.preventDefault();
	$(".library-card.envelope").toggleClass("card-in");
	if ( $(".library-card.envelope").hasClass("card-out") ) {
		$(".library-card.envelope").toggleClass("card-out");
	}
	$('.stamp').html("Thanks for RSVP-ing!");
	setTimeout(function(){ $('.stamp').html("Click here to RSVP"); }, 3000);
	setTimeout(function(){ document.location.href = document.location.href; }, 1500);
});