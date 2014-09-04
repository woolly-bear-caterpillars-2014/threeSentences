var story;

var sentenceTemplate,
    paneTemplate,
    sliceTemplate;

_.templateSettings = {
  interpolate: /\{\{(.+?)\}\}/g
};

var getStory = function() {
  return $.ajax({
    method: 'get',
    url: '/example_story.json',
    dataType: 'json'
  })
}

// view

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

  slice.children('p[data-position=' + sentence.position + ']').html(sentence.content);
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

function recursiveRenderSentence(sentence) {
  renderSentence(sentence);

  if (sentence.children.length !== 0) {
    sentence.children.forEach(recursiveRenderSentence);
  } else {
    return;
  }
}

var renderStory = function(response) {
  response.success(function(data) {
    story = data;
    story.sentences.forEach(recursiveRenderSentence);
  });
}


// init
function initializeTemplates(){
  paneTemplate = _.template($('#pane-template').html());
  sliceTemplate = _.template($('#slice-template').html());
}
$(document).ready(function() {
  initializeTemplates();

  response = getStory();
  renderStory(response);
});
