$(document).ready(function(){
  $('.export').click(function(e){
    e.preventDefault();
    $('#exportform').show();
  });
  // $('body').on('focusout', '#exportform', function(e){
  //   $('#exportform').hide();
  // });
});
