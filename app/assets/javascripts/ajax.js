// PERFORMANCE
// Don't do multiple appends, concat string first.

// OO REFACTOR TODO
// MODELS:
// ------
// Sentence, Pane (depth), Slice

var sentenceTemplate,
    paneTemplate,
    sliceTemplate,
    newSliceTemplate,
    currentSentence;

var findPane = function(depth) {
  return $('.pane[data-depth=' + depth + ']');
}

var findSlice = function(depth, parent_id) {
  var pane = findPane(depth);
  return pane.children('.slice[data-parent-id=' + parent_id + ']');
}

var renderSentence = function(sentence) {
  if (sentence.depth === 0){
    var $slice = $('.slice[data-depth=0]');
  } else {
    var $pane = setupPane(sentence);
    var $slice = setupSlice(sentence);
  }
  // sentence = sentenceTemplate( { sentence: sentence } );
  // slice.append(sentence);
  $sentence = $slice.children('[data-position=' + sentence.position + ']').eq(0);
  $sentence.val(sentence.content);
  $sentence.attr('data-id', sentence.id)
  // does child slice exist? if not, renderSlice
  console.log($sentence.val());
  renderChildren(sentence.depth, sentence.id);
}

var renderPane = function(depth) {
  var pane = paneTemplate({depth: depth});
  $('.content').append(pane);
}

var renderSlice = function(depth, parent_id) {
  var pane = findPane(depth);
  var slice = newSliceTemplate({
    parent_id: parent_id,
    depth: depth,
    cue: $('.sentence[data-id=' + parent_id + ']').val()
  })
  pane.append(slice);
}

var renderChildren = function(parentDepth, parentId) {
  if (findPane(parentDepth + 1).length === 0) {
    renderPane(parentDepth + 1);
  }
  if (findSlice(parentDepth + 1, parentId).length === 0) {
    renderSlice(parentDepth + 1, parentId)
  }
}

var setupSlice = function(sentence) {
  var slice;
  if (findSlice(sentence.depth, sentence.parent_id).length === 0) {
    renderSlice(sentence.depth, sentence.parent_id);
  }
  return findSlice(sentence.depth, sentence.parent_id);
}

var setupPane = function(sentence) {
  var pane;
  if (findPane(sentence.depth).length === 0) {
    renderPane(sentence.depth);
  }
  return findPane(sentence.depth);
}

function fillInitialSentences(){
  if (sentences.length > 0) {
    sentences.forEach(renderSentence);
  }
}

function initializeTemplates(){
  paneTemplate = _.template($('#pane-template').html());
  sliceTemplate = _.template($('#slice-template').html());
  newSliceTemplate = _.template($('#new-slice-template').html());
  sentenceTemplate = _.template($('#sentence-template').html());
}

function updateCue($sentence) {
  var cue = $('.cue[data-parent-id=' + $sentence.attr('data-id') + ']');
  cue.html($sentence.val());
}

function update(sentence) {
  var data = {
    sentence: {
      id: sentence.attr('data-id'),
      position: sentence.attr('data-position'),
      depth: sentence.attr('data-depth'),
      parent_id: sentence.attr('data-parent-id'),
      content: sentence.val()
    }
  }
  $.ajax({
    url: '/stories/' + story.id + '/sentences/' + sentence.attr('data-id'),
    method: 'PUT',
    data: JSON.stringify(data),
    dataType: 'json',
    contentType: 'application/json'
  }).done(function(data){
    console.log(data);
    updateCue(sentence);
  }).error(function(data){
    console.log(data)
  });
}

function create($sentence) {
  var depth = parseInt($sentence.attr('data-depth'));
  data = {
    sentence: {
      id: $sentence.attr('data-id'),
      position: $sentence.attr('data-position'),
      depth: depth,
      parent_id: $sentence.attr('data-parent-id'),
      content: $sentence.val()
    }
  }

  $.ajax({
    url: '/stories/' + story.id + '/sentences',
    method: 'POST',
    data: JSON.stringify(data),
    dataType: 'json',
    contentType: 'application/json'
  }).done(function(data){
    console.log(data);
    $sentence.attr('data-id', data.id);
    newPane(depth + 1, $sentence);
  }).error(function(data){
    console.log(data)
  });
}

function depthFull(depth) {
  var pane = findPane(depth);
  var slices = pane.children('.slice');
  var full = true;

  slices.each(function(index, slice){
    var sentences = $(slice).children('input');
    sentences.each(function(index, sentence){
      if ($(sentence).val() === '') {
        full = false;
      }
    });
  });
  return full;
}

function addSlice(pane, depth, $sentence) {
  console.log($sentence);
  console.log($sentence.attr('data-id'));
  var slice = newSliceTemplate({
    depth: depth,
    parent_id: $sentence.attr('data-id'),
    cue: $sentence.val()
  });
  console.log(slice);
  pane.append(slice);
}

function paneDoesNotExist(depth) {
  return (findPane(depth).length === 0);
}

function newPane(depth, $sentence) {
  if (paneDoesNotExist(depth)) {
    renderPane(depth);
  }
  var pane = findPane(depth);
  addSlice(pane, depth, $sentence);
}

$(document).ready(function(){
  console.log("BANG!");
  _.templateSettings = {
    interpolate: /\{\{(.+?)\}\}/g
  };
  initializeTemplates();

  fillInitialSentences();

  $('body').on('focus', 'input.sentence', function(e){
    e.preventDefault();
    currentSentence = $(this).val();
  })

  $('body').on('blur', 'input.sentence', function(e) {
    e.preventDefault();
    console.log(e);
    console.log(this);
    if ($(this).val() !== currentSentence) {
      var $sentence = $(this);
      var depth = $sentence.attr('data-depth');
      if ($sentence.attr('data-id')) {
        console.log("UPDATE!");
        update($sentence);
      } else {
        console.log("CREATE!");
        create($sentence);
      }
    }
  });
});

