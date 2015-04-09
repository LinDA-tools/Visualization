import Ember from "ember";

export default Ember.Component.extend({
    dragOver: function (event) {
        event.stopPropagation();
        event.preventDefault();
    },
    drop: function (event) {
        event.stopPropagation();
        event.preventDefault();
        var droppableJSON = event.dataTransfer.getData('text/plain');
        console.log('DROPPED: ' + droppableJSON);

        var droppable;
        try {
            droppable = JSON.parse(droppableJSON);
        } catch (error) {
            console.log(error);
            return;
        }

        var inArea = this.get('inArea');

        if (this.isFull()) {
            return;
        }

        for (var i = 0; i < inArea.length; i++) {
            var existingJSON = JSON.stringify(inArea[i]);
            if (existingJSON === droppableJSON) {
                return;
            }
        }
        inArea.pushObject(droppable);
    },
    classNames: ['droppable-area'],
    classNameBindings: ['full', 'active'],
    active: false,
    isFull: function () { 
        return false;
    },
    full: function () {
        return this.isFull();
    }.property('maxNumItems', 'inArea.@each'),
    dragEnter: function (event) {
        console.log(event.type);
        this.set('active', true);
    },
    deactivate: function (event) {
        console.log(event.type);
        this.set('active', false);
    }.on('dragLeave', 'dragStop', 'drop')
});
