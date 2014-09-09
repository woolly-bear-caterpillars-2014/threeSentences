
$(document).ready(function() {
        // $('.column').each(function(i) {
        // var position = $(this).position();
        // console.log($(this));
        // console.log($(this).width());

        // console.log('hi! min: ' + position.left + ' / max: ' + position.right + 'hi!' + parseInt(position.left + $(this).width()));

          $('#column-0').scrollspy({
            min: 63,
            max: 690,
            mode: 'horizontal',
            // container: 'div .slidee',
            onEnter: function(element, position) {
              if(console) console.log('entering ' +  element.id);
              $(element).css('background-color', "blue");
            },
            onLeave: function(element, position) {
              if(console) console.log('leaving ' +  element.id);
             $(element).css('background-color','red');
            }
          });

          $('#column-1').scrollspy({
            min: 693,
            max: 1440,
            mode: 'horizontal',
            // container: 'div .slidee',
            onEnter: function(element, position) {
              if(console) console.log('entering ' +  element.id);
              $(element).css('background-color', "blue");
            },
            onLeave: function(element, position) {
              if(console) console.log('leaving ' +  element.id);
              $(element).css('background-color', "red");
            }
          });

          $('#column-2').scrollspy({
            min: 1443,
            max: 2100,
            mode: 'horizontal',
            // container: 'div .slidee',
            onEnter: function(element, position) {
              if(console) console.log('entering ' +  element.id);
              $(element).css('background-color', "blue");
            },
            onLeave: function(element, position) {
              if(console) console.log('leaving ' +  element.id);
              $(element).css('background-color', "red");
            }
          });

          $('#column-3').scrollspy({
            min: 2103,
            max: 2900,
            mode: 'horizontal',
            // container: 'div .slidee',
            onEnter: function(element, position) {
              if(console) console.log('entering ' +  element.id);
              $(element).css('background-color', "blue");
            },
            onLeave: function(element, position) {
              if(console) console.log('leaving ' +  element.id);
              $(element).css('background-color', "red");
            }
          });

          $('#column-4').scrollspy({
            min: 2903,
            max: 3700,
            mode: 'horizontal',
            // container: 'div .slidee',
            onEnter: function(element, position) {
              if(console) console.log('entering ' +  element.id);
              $(element).css('background-color', "blue");
            },
            onLeave: function(element, position) {
              if(console) console.log('leaving ' +  element.id);
              $(element).css('background-color', "red");
            }
          });

          $('#the-end').scrollspy({
            min: 3703,
            max: 4600,
            mode: 'horizontal',
            // container: 'div .slidee',
            onEnter: function(element, position) {
              if(console) console.log('entering ' +  element.id);
              $(element).css('background-color', "blue");
            },
            onLeave: function(element, position) {
              if(console) console.log('leaving ' +  element.id);
              $(element).css('background-color', "red");
            }
          });




        });
