$(document).ready(function() {
  $.ajax({
    method: 'get',
    url: '/example_story.json',
    dataType: 'json'
  }).success(function(data) {
    console.log(data);
  });
});
