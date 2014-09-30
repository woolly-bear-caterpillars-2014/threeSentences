// ------------- VIEW MODULE -------------
var storyView = (function() {
  var columnTemplate,
      cueTemplate,
      sentenceTemplate,
      currentSentenceContent;

  var colWidth = 850;

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
    $('.slidee').on('click', '.cue', sentenceToggle);

    $('.story-name').on('blur', function(e) {
      e.preventDefault();
      var newTitle = $('.story-name').html();
      if (newTitle !== story.name) {
        story.updateTitle(newTitle);
      }
    });

    $('.slidee').on('focus', 'input.sentence', function(e){
      e.preventDefault();
      currentSentenceContent = $(this).val();
    });

    $('.slidee').on('blur', 'input.sentence', function(e) {
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

    $('.slidee').on('click', 'a.arrow', function(e) {
      e.preventDefault();
      var target = $('.column'+$(this).attr('href'));
      $('body').animate({ scrollLeft: (target.offset().left) }, 200);
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

  var setFrameWidth = function() {
    var numCols = $('.slidee').children('.column').length;
    $('#frame').width(400 + (numCols * colWidth));
  };

  var endColumn = function() {
    if ($('.slidee #the-end').length === 0) {
      var end = $('#the-end').detach();
      $('.slidee').append(end);
      var currentWidth = $('#frame').width();
      $('#frame').width(currentWidth + 850);
      end.fadeIn();
    }
  };

  var setShared = function(sharedValue){
    if (sharedValue === true) {
      $('input.sentence').attr('disabled', true);
      $('h1.story-name').attr('contenteditable', false);
    }
  };

  var introSteps = {
        steps: [
          { intro: "Welcome to Three Sentences. We'd like to show you around." },
          {
            element: document.querySelector('#column-0'),
            intro: "If you can write three sentences, you can write a story.",
            position: 'top'
          },
          {
            element: '.sentence',
            intro: "Write your first sentence here. It should describe the beginning of your story.",
            position: 'top'
          },
          {
            element: '#two',
            intro: "Your second sentence should describe your story's main conflict.",
            position: 'top'
          },
          {
            element: '#three',
            intro: "The third sentence should be the ending of your story—the resolution.",
            position: 'top'
          },
          {
            element: '#cue_tour',
            intro: 'When you enter a sentence, it becomes a cue for three new sentences that branch off of it.'
          },
          {
            element: '#cluster_tour',
            intro: "Look at your cue and enter three sentences that expand upon it."
          },
          {
            element: '#cluster_tour_2',
            intro: "If you do this for every sentence you write, you'll scaffold out your story in no time.",
            position: 'top'
          },
          {
            element: '.button.export.round',
            intro: "After five columns, you're done. But this is the beginning of your writing process—not the end of it.<br/><br/>You can share or export your story here, so you can take it to the next step."
          }
        ]
      };

  return {
   buildColumn: function(depth) {
     if ( depth >= 5) { return endColumn() }
     var column = columnTemplate({depth: depth});
     var startPos = calculateStartPosition(depth);
     var endPos = calculateEndPosition(depth);
     var range = _.range(startPos, endPos + 1);
     var spacing = Math.pow(3, (depth - 1));
     var iterator = 0;
     _.each(range, function(element, index, list) {
        if (index !== 0 && index % 3 === 0) {
          column += '</div></div>';
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
          column += '<div class="triad">';

        }
        column += sentenceTemplate({
          sentence_id: '',
          position: element,
          depth: depth,
          parent_id: parentId(element)
        });

      });
      column += "</div></div></div>";
      $('.slidee').append(column);
      setFrameWidth();

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

    startIntro: function(e){
      if (e) {
        e.preventDefault();
      }
      var intro = introJs();

      intro.setOptions(introSteps);

      intro.start().setOptions({ 'skipLabel': "End Tour" }).onexit(function() {
        window.location.href = "new";
      }).oncomplete(function() {
        window.location.href = "new";
      }).onbeforechange(function(targetElem) {
        if (targetElem.id === "cue_tour") {
          $('body').animate({ scrollLeft: ($(targetElem).offset().left - 200) }, 200);
        } else if (targetElem.className === "button export round") {
          $('body').animate({ scrollLeft: 0}, 200);
        }
      });
    },

    initialize: function() {
     story.sentences = [];
     initializeTemplates();
     initializeSentences();
     bindEventListeners();
     setFrameWidth();
     setShared(shared);
    }
  };



})();

var sentenceToggle = function(){
  if ($(this).attr('data-toggled') === 'false') {
    $(this).attr('data-toggled', 'true');
    $(this).parent().find('span.cue_arrow').css({
      transform: 'rotate(90deg)',
      MozTransform: 'rotate(90deg)',
      WebkitTransform: 'rotate(90deg)',
      msTransform: 'rotate(90deg)'});
  } else {
    $(this).attr('data-toggled', 'false');
    $(this).parent().find('span.cue_arrow').css({
      transform: 'rotate(0deg)',
      MozTransform: 'rotate(0deg)',
      WebkitTransform: 'rotate(0deg)',
      msTransform: 'rotate(0deg)'});
  }
  $(this).siblings('.triad').slideToggle(500);

};

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
  cue.children('.cue-text').html(this.content);
  cue.siblings().find('.sentence').attr('data-parent-id', this.id);
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

// ----------------- STORY ---------------------
function Story(storyJson) {
  this.name = storyJson.name;
  this.id = storyJson.id;
  this.$el = $('.story-name');
}

Story.prototype.updateTitle = function(title) {
  var story = this;
  var params = {
    "story": {
      id: this.id,
      name: title
    }
  };
  var response = this.sync(params);
  response.done(function(data){
    story.name = data.name;
    storyView.displaySave();
  });
};

Story.prototype.sync = function(params) {
  var story = this;
  return $.ajax({
    url: '/stories/' + story.id,
    method: 'PUT',
    data: JSON.stringify(params),
    dataType: 'json',
    contentType: 'application/json'
  });
};



// ---------------------------------------------

$(document).ready(function(){

  storyView.initialize();

  if(window.location.href === window.location.origin + "/stories/demo") {
    storyView.startIntro();
  }
});
