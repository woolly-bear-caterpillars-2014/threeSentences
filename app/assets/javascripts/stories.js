// ------------- VIEW MODULE -------------

var storyView = (function() {
  var columnTemplate,
      cueTemplate,
      sentenceTemplate,
      currentSentenceContent;

  var initializeTemplates = function() {
    _.templateSettings = { interpolate: /\{\{(.+?)\}\}/g };

    columnTemplate = _.template($('#column-template').html());
    cueTemplate = _.template($('#cue-template').html());
    sentenceTemplate = _.template($('#sentence-template').html());
  };

  var setupFirstThree = function(firstThree) {
    var sentence;
    firstThree.forEach(function(sentenceJson) {
      sentence = storyView.initializeSentence(sentenceJson);
      sentence.initialRender();
    });
    story.sentences.forEach(function(sentence) {
      sentence.render();
    });
  };

  var initializeSentences = function() {
    if (sentencesJson.length > 0) {
      var firstThree = sentencesJson.splice(0,3);
      setupFirstThree(firstThree);
      sentencesJson.forEach(storyView.buildSentence);
    }
  };

  var bindEventListeners = function() {
    $('body').on('focus', 'input.sentence', function(e){
      e.preventDefault();
      currentSentenceContent = $(this).val();
    });

    $('body').on('blur', 'input.sentence', function(e) {
      e.preventDefault();

      if ($(this).val() !== currentSentenceContent) {
        var sentence;
        var $sentence = $(this);
        var position = $sentence.attr('data-position');
        if ($sentence.attr('data-id')) {
          sentence = _.findWhere(story.sentences, {position: parseInt(position)});
          sentence.update($sentence.val());
        } else {
          var sentenceJson = sentenceElToJson($sentence);
          sentence = storyView.initializeSentence(sentenceJson);
          sentence.save();
        }
      }
    });
  };

  var calculateStartPosition = function(depth) {
    var position = 0;
    while (depth > 0) {
      position += Math.pow(3, depth);
      depth--;
    }
    return position + 1;
  };

  var calculateEndPosition = function(depth) {
    var start = calculateStartPosition(depth);
    return start + Math.pow(3, depth + 1) - 1;
  };

  var parentPosition = function(position) {
    return Math.ceil(position / 3) - 1;
  };

  var parentId = function(position) {
    var parentEl = $('.sentence[data-position=' + parentPosition(position) + ']');
    return parentEl.attr('data-id');
  };

  var sentenceElToJson = function($sentence) {
    return {
      parent_id: parseInt($sentence.attr('data-parent-id')),
      depth: parseInt($sentence.attr('data-depth')),
      content: $sentence.val(),
      position: parseInt($sentence.attr('data-position')),
      id: parseInt($sentence.attr('data-id')) || ''
    };
  };

  return {
   buildColumn: function(depth) {
     var column = columnTemplate({depth: depth});
     var startPos = calculateStartPosition(depth);
     var endPos = calculateEndPosition(depth);
     var range = _.range(startPos, endPos + 1);
     var spacing = Math.pow(3, (depth - 1));
     var iterator = 0;
     _.each(range, function(element, index, list) {
        if (index !== 0 && index % 3 === 0) {
          column += '</div>';
        }
        if (index % 3 === 0) {
          iterator++;
          if (iterator % spacing === 0){
            column += '<div class="cluster bottomborder">';
          }
          else {
            column += '<div class="cluster">';
          }
          column += cueTemplate({cue: '', parent_position: parentPosition(element)});
        }
        column += sentenceTemplate({
          sentence_id: '',
          position: element,
          depth: depth,
          parent_id: parentId(element)
        });

      });
      column += "</div>";

      $('#frame').append(column);
    },

    findOrInitializeColumn: function(depth) {
      if ($('.column[data-depth=' + depth + ']').length === 0) {
        this.buildColumn(depth);
      }
      return $('.column[data-depth=' + depth + ']');
    },

    initializeSentence: function(sentenceJson){
      var sentence = new Sentence(sentenceJson);
      story.sentences.push(sentence);
      return sentence;
    },

    buildSentence: function(sentenceJson) {
      var sentence = storyView.initializeSentence(sentenceJson);
      sentence.render();
    },

    displaySave: function() {
      $('.save-indicator').fadeIn(400).delay(700).fadeOut(400);
    },

    initialize: function() {
     story.sentences = [];
     initializeTemplates();
     // setupFirstThree();
     initializeSentences();
     bindEventListeners();
    }
  };



})();


// ----- SENTENCE MODEL ------
var Sentence = function(sentenceJson) {
  this.id = sentenceJson.id;
  this.position = sentenceJson.position;
  this.parentId = sentenceJson.parent_id;
  this.content = sentenceJson.content;
  this.depth = sentenceJson.depth;
  this.$el = null;
};

Sentence.prototype.toParams = function() {
  return {
    "sentence": {
      id: this.id,
      position: this.position,
      depth: this.depth,
      parent_id: this.parentId,
      content: this.content
    }
  };
};

Sentence.prototype.save = function() {
  var sentence = this;
  var response = sentence.ajaxSync('/stories/' + story.id + '/sentences', 'POST');

  response.done(function(data){
    sentence.id = data.id;
    sentence.render();
    storyView.displaySave();
  });
  response.error(function(data){
    console.log(data);
  });
};

Sentence.prototype.update = function(newContent) {
  var sentence = this;
  sentence.content = newContent;

  var response = sentence.ajaxSync('/stories/' + story.id + '/sentences/' + sentence.id, 'PUT');

  response.done(function(data){
    sentence.updateChildren();
    sentence.updateElement();
    storyView.displaySave();
  });
  response.error(function(data){
    console.log(data);
  });
};

Sentence.prototype.ajaxSync = function(url, method) {
  var sentence = this;
  return $.ajax({
    url: url,
    method: method,
    data: JSON.stringify(sentence.toParams()),
    dataType: 'json',
    contentType: 'application/json'
  });
};

Sentence.prototype.updateChildren = function() {
  var cue = $('.cue[data-parent-position=' + this.position + ']');
  cue.html(this.content);
  cue.siblings('.sentence').attr('data-parent-id', this.id);
  cue.parent('.cluster').fadeIn(500);
};

Sentence.prototype.render = function() {
  var column;
  if (this.depth === 0){
    column = $('.column[data-depth=0]');
  } else {
    column = storyView.findOrInitializeColumn(this.depth);
  }
  this.$el = column.find('.sentence[data-position=' + this.position + ']');
  this.updateElement();
  storyView.findOrInitializeColumn(this.depth + 1);
  this.updateChildren();
};

Sentence.prototype.updateElement = function() {
  this.$el.attr('data-id', this.id);
  this.$el.val(this.content);
};

Sentence.prototype.initialRender = function() {
  var column = $('.column[data-depth=0]');
  this.$el = column.find('.sentence[data-position=' + this.position + ']');
  this.updateElement();
};

var sentenceToggle = function(){
  if ($(this).siblings('input').is(":hidden")){
    $(this).siblings('input').animate({opacity: 1});
    $(this).siblings('input').toggle();

  } else {
    $(this).siblings('input').animate({opacity: 0});
    $(this).siblings('input').toggle();
  }
};



// ---------------------------------------------


$(document).ready(function(){
  storyView.initialize();

  $(window).scroll($.debounce( 250, true, function(){
    $(".column").mCustomScrollbar("disable");
  } ) );
  $(window).scroll($.debounce( 250, function(){
    $(".column").mCustomScrollbar("update");
  } ) );

});
