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
    $('body').on('click', '.cue', sentenceToggle);

    $('.story-name').on('blur', function(e) {
      e.preventDefault();
      var newTitle = $('.story-name').html();
      if (newTitle !== story.name) {
	story.updateTitle(newTitle);
      }
    });

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

  var setShared = function(shared_value){
    if (shared_value === true) {
    $('input.sentence').attr('disabled', true)
  }
}


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
          column += '<div class="triad">'

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
  $(this).siblings('.triad').slideToggle(500);
};

function startIntro(e){
        if (e) { e.preventDefault(); };
        var intro = introJs();
          intro.setOptions({
            steps: [
              {
                intro: "Welcome to Three Sentences"
              },
              {
                element: document.querySelector('#column-0'),
                intro: "Here, you see there are three lines to enter new sentences.",
                position: 'right'
              },
              {
                element: '.sentence',
                intro: "Here is the top line, which is used to start the introduction to your story. This line is meant to encapsulate your introduction in one sentence.",
                position: 'top'
              },
              {
                element: '#two',
                intro: 'Enter a line that summarizes the conflict of your story here.',
                position: 'top'
              },
              {
                element: '#three',
                intro: "And here is where you write your conclusion. Watch what happens when you enter a sentence.",
                position: 'top'
              },
              {
                element: '#cluster_tour',
                intro: 'As you see, a new set of three lines have been created.'
              },
              {
                element: '#cue_tour',
                intro: 'The cue or header line matches up with the sentence that these three lines came from. This is a cue of what sentence to embellish.'
              },
              {
                element: '.button.export.round',
                intro: "Since this is an outlining tool, we cut you off after 363 sentences. Here you are given the option to export your story. Let's get writing!"

              }
            ]
          });

          intro.start().setOptions({ 'skipLabel': "Okay, I've got it!" }).onexit(function() {
    window.location.href = "new";
  }).oncomplete(function() {
    window.location.href = "new";
  })


      }


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
  $('body').on('click', 'a.arrow', function(e) {
    e.preventDefault();
    var target = $('.column'+$(this).attr('href'));
    $('body').animate({ scrollLeft: (target.offset().left) }, 200);
  });
  if(window.location.href === "http://0.0.0.0:3000/stories/demo") {
    startIntro();
  }
});
