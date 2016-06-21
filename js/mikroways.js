(function ($) {
  var isNavBarShown = false;

  $(document).ready(function () {

    // hide .navbar first
    $(".navbar").hide();

    // fade in .navbar
    $(window).scroll(function () {
      // set distance user needs to scroll before we fadeIn navbar
      if ($(this).scrollTop() > 180) {
        $('.navbar').fadeIn(900);
        isNavBarShown = true;

      } else {
        $('.navbar').fadeOut(900);
        isNavBarShown = false;
      }
    });

    /* Show navbar */
    $('#shownav').hover(function () {
      if (isNavBarShown) { return; }
      $('.navbar').fadeIn(900);
    });

    /* when navbar is hovered over it will override previous */
    $('.navbar').hover(function () {
      if (isNavBarShown) { return; }
      $('.navbar').show();
    }, function () {
      if (isNavBarShown) { return; }
      $('.navbar').fadeOut(900);
    });
  });
}(jQuery));

// Smooth scrolling.
$(function() {
  $('a[href*="#"]:not([href="#"])').click(function() {
    if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
      var target = $(this.hash);
    target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
    if (target.length) {
      $('html, body').animate({
        scrollTop: target.offset().top
      }, 1000);
      return false;
    }
  }
  });
});

/**
 * This part handles the menu highlighting functionality.
 */
$(document).ready(function(){
  var aChildren = $("nav div.main-menu li").children(); // find the a children of the list items
  var aArray = []; // create the empty aArray
  for (var i=0; i < aChildren.length; i++) {    
    var aChild = aChildren[i];
    var ahref = $(aChild).attr('href');
    if ($($(aChild).attr('id')).selector != "logo-mikroways-superior") {
      aArray.push(ahref);
    }
  } // this for loop fills the aArray with attribute href values

  $(window).scroll(function(){
    var windowPos = $(window).scrollTop(); // get the offset of the window from the top of page
    var windowHeight = $(window).height(); // get the height of the window
    var docHeight = $(document).height();

    for (var i=0; i < aArray.length; i++) {
      var theID = aArray[i];
      var divPos = $(theID).offset().top; // get the offset of the div from the top of page
      var divHeight = $(theID).height(); // get the height of the div in question
      if (windowPos >= divPos - 1 && windowPos + 1 < (divPos + divHeight)) {
        $("a[href='" + theID + "']").addClass("nav-active");
      } else {
        $("a[href='" + theID + "']").removeClass("nav-active");
      }
    }

    if(windowPos + windowHeight == docHeight) {
      if (!$("nav li:last-child a").hasClass("nav-active")) {
        var navActiveCurrent = $(".nav-active").attr("href");
        $("a[href='" + navActiveCurrent + "']").removeClass("nav-active");
        $("nav li:last-child a").addClass("nav-active");
      }
    }
  });
});
