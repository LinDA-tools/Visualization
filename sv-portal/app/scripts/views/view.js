App.ContainerView = Ember.ContainerView.extend({});




// Extension of Select view that allows for manually setting list height (for dimension template)
App.Select = Ember.Select.extend({
    attributeBindings: ['size']
});

App.ColorPicker = Em.TextField.extend({
  type: 'minicolors',
  attributeBindings: ['name'],
   didInsertElement: function() {
       var element = this.get('element');
       $(element).minicolors({});
  }
});