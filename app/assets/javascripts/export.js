$(document).ready(function(){
  $('.export').click(function(e){
    e.preventDefault();
    $('#exportform').show();
  });
  $('#exportform form').submit(function(e){
    e.preventDefault();
    var $url = ($(this).attr('action'));
    $.ajax({
      method: "POST",
      url: $url,
      data: $(this).serialize()
    }).done(function(data) {
      $.fileDownload(data['url'], {
          successCallback: function (url) {
            $('#exportform').hide();
          },
          failCallback: function (html, url) {
          }
      });
    });
  });
});
