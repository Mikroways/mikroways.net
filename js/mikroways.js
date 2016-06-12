(function ($) {
var isNavBarShown = false;

    $(document).ready(function () {

        // hide .navbar first
        $(".navbar").hide();

        // fade in .navbar
            $(window).scroll(function () {
                // set distance user needs to scroll before we fadeIn navbar
                if ($(this).scrollTop() > 100) {
                    $('.navbar').fadeIn();
                    isNavBarShown = true;

                } else {
                $('.navbar').fadeOut();
                isNavBarShown = false;
            }
        });

        /* Show navbar */


        $('#shownav').hover(function () {
            if (isNavBarShown) { return; }
            $('.navbar').fadeIn();
        });

        /* when navbar is hovered over it will override previous */

        $('.navbar').hover(function () {
            if (isNavBarShown) { return; }
            $('.navbar').show();
        }, function () {
            if (isNavBarShown) { return; }
            $('.navbar').fadeOut();
        });
    });
}(jQuery));

$(function() {
  $('a[href*="#"]:not([href="#"])').click(function() {
    if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
      var target = $(this.hash);
    target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
    if (target.length) {
      $('html, body').animate({
        scrollTop: target.offset().top
      }, 400);
      return false;
    }
  }
  });
});
