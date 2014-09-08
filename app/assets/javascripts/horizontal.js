$(document).ready(function(){
var screenRight,
    screenLeft,
    screenDown,
    screenUp,
    nightMode = false;

   $(".column").mCustomScrollbar({
     theme: 'rounded-dots-dark'
   });

    Mousetrap.bind('right', function() {
        screenRight = $(document).scrollLeft();
        $("html, body").animate({scrollLeft: (screenRight + $(".column").width())}, 300);
    });

    Mousetrap.bind(['shift+right', 'shift+4'], function() {
        $("html, body").animate({scrollLeft: $(document).width() }, 300);
    });

    Mousetrap.bind('left', function() {
        screenLeft = $(document).scrollLeft();
        $("html, body").animate({scrollLeft: (screenLeft - $(".column").width())}, 300);
    });

    Mousetrap.bind(['shift+left','shift+1'], function() {
        $("html, body").animate({scrollLeft: 0}, 300);
    });

    Mousetrap.bind('down', function() {
        screenDown = $(".column").scrollTop();
        $(".column").animate({scrollTop: screenDown + 200}, 300);
    });

    Mousetrap.bind('up', function() {
        screenUp = $(".column").scrollTop();
        $(".column").animate({scrollTop: screenUp - 200}, 300);
    });

    Mousetrap.bind('shift+2', function() {
        $("html, body").animate({scrollLeft: 860}, 300);
    });

    Mousetrap.bind('shift+3', function() {
        $("html, body").animate({scrollLeft: 1720}, 300);
    });

    Mousetrap.bind('shift+n', function() {
         if (nightMode === false){
         nightMode = true
         $("html, body, .column, #frame, .slidee, .slidee").css( "background", "#333333" );
         $("p, h1, h2, h3, h4, h5, h6, li").css( "color", "#F5FEFF" );
        }
        else {
         nightMode = false
         $("html, body, .column, #frame, .slidee").css( "background", "#F5FEFF" );
         $("p, h1, h2, h3, h4, h5, h6, li").css( "color", "#333333" );
        }
    });

});