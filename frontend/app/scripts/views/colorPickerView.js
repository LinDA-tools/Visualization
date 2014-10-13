App.ColorPicker = Em.TextField.extend({
    type: 'minicolors',
    attributeBindings: ['name'],
    didInsertElement: function() {
        $(this.get('element')).minicolors({});
    }
});