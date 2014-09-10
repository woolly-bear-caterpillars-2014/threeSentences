var recordHistory = function(value){
  history.pushState(null, null, "#" + value)
};

var goBack = function(location){
  console.log('hi hi  hi')
  // window.scrollTo(800,0)

}



$(document).ready(function() {



  // $('#column-0').scrollspy({
  //   min: 63,
  //   max: 690,
  //   mode: 'horizontal',
  //   onEnter: function(element, position) {
  //     recordHistory(element.id);
  //   },
  //   onLeave: function(element, position) {
  //    //  if(console) console.log('leaving ' +  element.id);
  //    // $(element).css('background-color','red');
  //   }
  // });

  // $('#column-1').scrollspy({
  //   min: 693,
  //   max: 1440,
  //   mode: 'horizontal',
  //   onEnter: function(element, position) {
  //     recordHistory(element.id);
  //   },
  //   onLeave: function(element, position) {
  //     // if(console) console.log('leaving ' +  element.id);
  //     // $(element).css('background-color', "red");
  //   }
  // });

  // $('#column-2').scrollspy({
  //   min: 1443,
  //   max: 2100,
  //   mode: 'horizontal',
  //   onEnter: function(element, position) {
  //     recordHistory(element.id);
  //   },
  //   onLeave: function(element, position) {
  //     // if(console) console.log('leaving ' +  element.id);
  //     // $(element).css('background-color', "red");
  //   }
  // });

  // $('#column-3').scrollspy({
  //   min: 2103,
  //   max: 2900,
  //   mode: 'horizontal',
  //   onEnter: function(element, position) {
  //     recordHistory(element.id);
  //   },
  //   onLeave: function(element, position) {
  //     // if(console) console.log('leaving ' +  element.id);
  //     // $(element).css('background-color', "red");
  //   }
  // });

  // $('#column-4').scrollspy({
  //   min: 2903,
  //   max: 3700,
  //   mode: 'horizontal',
  //   onEnter: function(element, position) {
  //     recordHistory(element.id);
  //  },
  //   onLeave: function(element, position) {
  //     // if(console) console.log('leaving ' +  element.id);
  //     // $(element).css('background-color', "red");
  //   }
  // });

  // $('#the-end').scrollspy({
  //   min: 3703,
  //   max: 4500,
  //   mode: 'horizontal',
  //   onEnter: function(element, position) {
  //     recordHistory(element.id);
  //  },
  //   onLeave: function(element, position) {
  //     // if(console) console.log('leaving ' +  element.id);
  //     // $(element).css('background-color', "red");
  //   }
  // });

  window.addEventListener("popstate", function(e) {
    e.preventDefault();
    console.log('hi')
    goBack(location.hash)
       });




});
