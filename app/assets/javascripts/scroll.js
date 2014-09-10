var col1 = { name: "#column-0", min: 63, max: 690 };
var col2 = { name: "#column-1", min: 693, max: 1440 };
var col3 = { name: "#column-2", min: 1443, max: 2100 };
var col4 = { name: "#column-3", min: 2103, max: 2900 };
var col5 = { name: "#column-4", min: 2903, max: 3700 };
var col6 = { name: "#the-end", min: 3703, max: 4500 };
var columns = [col1, col2, col3, col4, col5, col6];

var recordHistory = function(value){
  history.pushState(null, null, "#" + value);
};

var goBack = function(location){
  console.log($('#column-2').offset().left);
  $('body').scrollLeft($('#column-2').offset().left);
  // console.log('hi');
};

var setSpies = function(columns){
  $.each(columns, (function(i, col) {
    $(col.name).scrollspy({
      min: col.min,
      max: col.max,
      mode: 'horizontal',
      onEnter: function(element, position) {
        recordHistory(element.id);
      },
      onLeave: function(element, position) {
        if(console) console.log('leaving ' +  element.id);
      }
    });
  })
)}



$(document).ready(function() {

  setSpies(columns)

  window.addEventListener("popstate", function(e) {
    e.preventDefault();
    goBack(location.hash)
       });

});
