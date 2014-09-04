var story;
var sentenceTemplate;

var getStory = function() {
  return $.ajax({
    method: 'get',
    url: '/example_story.json',
    dataType: 'json'
  })
}


// view

var renderSentence = function(sentence) {
  console.log(sentence);
  $('.content').append(sentenceTemplate({sentence: sentence}));
}

function recursiveRenderSentence (sentence) {
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
    // story.sentences.forEach(renderSentence);
    // renderSentence(story.sentences[0]);
  });
}


// init

$(document).ready(function() {
  sentenceTemplate = _.template($('#sentence-template').html());

  response = getStory();
  renderStory(response);
});



