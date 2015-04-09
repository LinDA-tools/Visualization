import Ember from "ember";

export default Ember.Component.extend({
    tagName: 'span',
    classNames: ['draggable-item'],
    attributeBindings: ['draggable'],
    draggable: 'true',
    dragStart: function (event) {
        event.stopPropagation();
        var data = this.get('data');
        var jsonData = JSON.stringify(data);
        event.dataTransfer.setData('text/plain', jsonData);
        event.dataTransfer.effectAllowed = "copy";
    },
});


