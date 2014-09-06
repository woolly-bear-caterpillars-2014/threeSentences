$(document).ready(function(){
    $("html, body").animate({scrollLeft: $(document).width() }, 300); 
    // $("html, body").animate({ scrollLeft: 500 }, "slow");
var screenRight
var screenLeft
var screenDown
var screenUp
var nightMode = false

    Mousetrap.bind('right', function() {
        screenRight = $(document).scrollLeft(); 
        $("html, body").animate({scrollLeft: (screenRight + $(".column").width())}, 300); 
        // currentPos = (currentPos + 200);
    });

    Mousetrap.bind(['shift+right', 'shift+4'], function() { 
        $("html, body").animate({scrollLeft: $(document).width() }, 300); 
        // currentPos = (currentPos + 200);
    });

    Mousetrap.bind('left', function() {
        screenLeft = $(document).scrollLeft(); 
        $("html, body").animate({scrollLeft: (screenLeft - $(".column").width())}, 300); 
        // currentPos = (currentPos + 200);
    });

    Mousetrap.bind(['shift+left','shift+1'], function() {
        $("html, body").animate({scrollLeft: 0}, 300); 
        // currentPos = (currentPos + 200);
    });

    Mousetrap.bind('down', function() {
        screenDown = $(".column").scrollTop(); 
        $(".column").animate({scrollTop: screenDown + 200}, 300); 
        // currentPos = (currentPos + 200);
    });

    Mousetrap.bind('up', function() {
        screenUp = $(".column").scrollTop();
        $(".column").animate({scrollTop: screenUp - 200}, 300);
        // currentPos = (currentPos + 200);
    });

    Mousetrap.bind('shift+2', function() {
        $("html, body").animate({scrollLeft: 860}, 300); 
        // currentPos = (currentPos + 200);
    });

    Mousetrap.bind('shift+3', function() {
        $("html, body").animate({scrollLeft: 1720}, 300); 
        // currentPos = (currentPos + 200);
    });

    Mousetrap.bind('shift+n', function() {
         if (nightMode === false){
         nightMode = true
         $("html, body, .column, #frame, .slidee, .slidee").css( "background", "#333333" );
         $("p, h1, h2, h3, h4, h5, h6, li").css( "color", "white" );
        }
        else {
         nightMode = false
         $("html, body, .column, #frame, .slidee").css( "background", "white" );
         $("p, h1, h2, h3, h4, h5, h6, li").css( "color", "#333333" );
        }
    });

});











// $(document).keydown(function(e) {
//     console.log(e.keyCode);
// });

// $(document).keyup(function(e){
//     switch (e.which) {
//     case 37:
//         $("html, body").animate({ scrollLeft: 100 }, "slow");
//         break;
//     case 39:
//         $("html, body").animate({ scrollLeft: -100 }, "slow");
//         break;
//     }
// })








// jQuery(function ($) {
  
//   $('#frame').sly({
//     horizontal: 1,
    
//     itemNav: 'forceCentered',
//     smart: 1,
//     activateOn: 'click',
    
//     scrollBy: 1,
    
//     mouseDragging: 1,
//     swingSpeed: 0.2,
    
//     scrollBar: $('.scrollbar'),
//     dragHandle: 1,
    
//     speed: 600,
//     startAt: 2
//   });
  
// });

// Mousetrap.bind('4', function() { highlight(2); });

// $("#column").on('click'){
//     console.log("Hi")
// }

//  $('#column').sly({
//     horizontal: 0
    
//     itemNav: 'forceCentered',
//     smart: 1,
//     activateOn: 'click',
    
//     scrollBy: 1,
    
//     mouseDragging: 1,
//     swingSpeed: 0.2,
    
//     scrollBar: $('.scrollbar'),
//     dragHandle: 1,
    
//     speed: 600,
//     startAt: 2
//   });
  
// });