var Sentence = Backbone.Model.extend({
  defaults: function() {
    return {
      content: '',
      parent_id: null,
      depth: 0,
      position: 1
    }
  }
});

var Story = Backbone.Collection.extend({
  model: Sentence,

});

var SentenceView = Backbone.View.extend({
  tagName: 'p',

  template: _.template($('#sentence-template')),

  events: {
    'focus': 'edit',
    'blur': 'close',
    'keypress': 'updateOnEnter'
  },

  initialize: function() {
    this.listenTo(this.model, 'change', this.render);
  },

  render: function() {
    this.$el.html(this.template(this.model.toJSON()));
    return this;
  },

  edit: function() {
    this.$el.addClass('editing'),
  },

  close: function() {
    var value = this.$el.html();
    if (!value) {
      this.clear();
    } else {
      this.model.save({title: value});
      this.$el.removeClass("editing");
    }
  },

  updateOnEnter: function(e) {
    if (e.keyCode == 13) this.close();
  }
});

var AppView = Backbone.View.extend({
  el: $('.content'),


});
