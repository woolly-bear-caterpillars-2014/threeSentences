var deleteExport = function (url) {
  $.ajax({
    method: "DELETE",
    url: url
  });
};

$(document).ready(function(){
  $('.help').click(function(e){
    e.preventDefault();
    $('.modal-bg-help').fadeToggle();
  });

$('.modal-bg-help').click(function(e){
    e.preventDefault();
    if (e.target !== this) {
      return;
    }
    $('.modal-bg-help').fadeToggle();
  });

  $('.close').click(function(e){
    e.preventDefault();

    $('.modal-bg-help').fadeToggle();
  });

});
