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
      var theID = aArray[i].replace('/','');
      var divPos = $(theID).offset().top; // get the offset of the div from the top of page
      var divHeight = $(theID).height(); // get the height of the div in question
      if (windowPos >= divPos - 1 && windowPos + 1 < (divPos + divHeight)) {
        $("a[href='/" + theID + "']").addClass("nav-active");
      } else {
        $("a[href='/" + theID + "']").removeClass("nav-active");
      }
    }

    if(windowPos + windowHeight == docHeight) {
      if (!$("nav li:last-child a").hasClass("nav-active")) {
        var navActiveCurrent = $(".nav-active").attr("href");
        $("a[href='/" + navActiveCurrent + "']").removeClass("nav-active");
        $("nav li:last-child a").addClass("nav-active");
      }
    }
  });
});

// Typing effect.
$(function(){
  var slogan;
//  if (document.documentElement.lang == "es") {
//    slogan = "soluciones que revolucionan";
//  } else {
//    slogan = "revolutioning solutions";
//  }

  $(".element").typed({
    strings: ["soluciones que revolucionan"],
    // Optionally use an HTML element to grab strings from (must wrap each string in a <p>)
    stringsElement: null,
    // typing speed
    typeSpeed: 50,
    // time before typing starts
    startDelay: 0,
    // backspacing speed
    backSpeed: 30,
    // time before backspacing
    backDelay: 1300,
    // loop
    loop: false,
    // false = infinite
    loopCount: false,
    // show cursor
    showCursor: true,
    // character for cursor
    cursorChar: "_",
    // attribute to type (null == text)
    attr: null,
    // either html or text
    contentType: 'html',
    // call when done callback function
    callback: function() {},
    // starting callback function before each string
    preStringTyped: function() {},
    //callback for every typed string
    onStringTyped: function() {},
    // callback for reset
    resetCallback: function() {}
  });
});
