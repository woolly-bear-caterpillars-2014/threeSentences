var deleteExport = function (url) {
  $.ajax({
    method: "DELETE",
    url: url
  });
};

$(document).ready(function(){
  $('.export').click(function(e){
    e.preventDefault();
    $('.modal-bg').fadeToggle();
  });

  $('.absolute-center-export form').submit(function(e){
    e.preventDefault();
    var $url = ($(this).attr('action'));
    $.ajax({
      method: "POST",
      url: $url,
      data: $(this).serialize()
    }).done(function(data) {
      $.fileDownload(data['url'], {
          successCallback: function (url) {
	    $('.modal-bg').fadeToggle();
	    deleteExport(url);
          },
          failCallback: function (html, url) {
          }
      });
    });
  });

  $('.absolute-center-export').click(function(e){
    e.stopPropagation();
  });

  $('.modal-bg').click(function(e){
    e.preventDefault();
    $('.modal-bg').fadeToggle();
  });

  $('.close').click(function(e){
    e.preventDefault();
    $('.modal-bg').fadeToggle();
  });

});
