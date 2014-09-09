var deleteExport = function (url) {
  $.ajax({
    method: "DELETE",
    url: url
  });
};

$(document).ready(function(){
  $('.export').click(function(e){
    e.preventDefault();
    $('.absolute-center-export').fadeToggle();
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
            $('.absolute-center-export').fadeToggle();
	    deleteExport(url);
          },
          failCallback: function (html, url) {
          }
      });
    });
  });

  $('.close').click(function(e){
    e.preventDefault();
    $('.absolute-center-export').fadeToggle();
  });


});
