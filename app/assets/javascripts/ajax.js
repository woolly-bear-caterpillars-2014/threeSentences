console.log("BANG!");

var sentenceTemplate,
    paneTemplate,
    sliceTemplate;

var findPane = function(sentence) {
  return $('.pane[data-depth=' + sentence.depth + ']');
}

var findSlice = function(sentence) {
  var pane = findPane(sentence);
  return pane.children('.slice[data-parent-id=' + sentence.parent_id + ']');
}

var renderSentence = function(sentence) {
  console.log(sentence);
  if (sentence.depth === 0){
    var slice = $('.slice[data-depth=0]');
  } else {
    var pane = setupPane(sentence);
    var slice = setupSlice(sentence);
  }
  sentence = sentenceTemplate( { sentence: sentence } )
  slice.append(sentence);
}

var renderPane = function(sentence) {
  var pane = paneTemplate({depth: sentence.depth});
  $('.content').append(pane);
}

var renderSlice = function(sentence) {
  var pane = findPane(sentence);
  var slice = sliceTemplate({parent_id: sentence.parent_id, depth: sentence.depth })
  pane.append(slice);
}

var setupSlice = function(sentence) {
  var slice;
  if (findSlice(sentence).length === 0) {
    renderSlice(sentence);
  }
  return findSlice(sentence);
}

var setupPane = function(sentence) {
  var pane;
  if (findPane(sentence).length === 0) {
    renderPane(sentence);
  }
  return findPane(sentence);
}

function fillInitialSentences(){
  if (sentences.length > 0) {
    sentences.forEach(renderSentence);
  }
}

function initializeTemplates(){
  paneTemplate = _.template($('#pane-template').html());
  sliceTemplate = _.template($('#slice-template').html());
  sentenceTemplate = _.template($('#sentence-template').html());
}

$(document).ready(function(){
  _.templateSettings = {
    interpolate: /\{\{(.+?)\}\}/g
  };
  initializeTemplates();

  fillInitialSentences();

  $('body').on('blur', 'p.sentence', function(e) {
    e.preventDefault();
    console.log(e);
    console.log(this);
    field = $(this);
    data = {
      sentence:
      {
        id: field.attr('data-id'),
        position: field.attr('data-position'),
        depth: field.attr('data-depth'),
        parent_id: field.attr('data-parent-id'),
        content: field.html()
      }
    };
    console.log(data);
    console.log(JSON.stringify(data));

    $.ajax({
      url: '/stories/' + story.id + '/sentences',
      method: 'POST',
      data: JSON.stringify(data),
      dataType: 'json',
      contentType: 'application/json'
    }).done(function(data){
      console.log(data);
    }).error(function(data){
      console.log(data)
    });
  });

  $('body').on('submit', 'form.new_sentence', function(e){
    e.preventDefault();
    var form = $(this);
    console.log(form.attr('action'))

    $.ajax({
      url: form.attr('action'),
      method: 'POST',
      data: form.serialize(),
      dataType: 'json'
    }).done(function(data){
      console.log(data);
    }).error(function(data){
      console.log(data)
    });
  });
});

