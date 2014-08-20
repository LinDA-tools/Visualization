App.ContainerView = Ember.ContainerView.extend({});

// Extension of Select view that allows for manually setting list height (for dimension template)
App.Select = Ember.Select.extend({
    attributeBindings: ['size'],
//    didInsertElement: function() {
//        $(this.get('element')).selectmenu();
//    }
});

App.ColorPicker = Em.TextField.extend({
    type: 'minicolors',
    attributeBindings: ['name'],
    didInsertElement: function() {
        $(this.get('element')).minicolors({});
    }
});

App.TabView = Ember.View.extend({
    didInsertElement: function() {
        var element = $(this.get('element'));
        element.addClass("ui-tabs-vertical ui-helper-clearfix");
        $("li", element).removeClass("ui-corner-top").addClass("ui-corner-left");
    }
});

App.ButtonGroupView = Ember.CollectionView.extend({
    tagName: 'ul',
    classNames: ['blanklist'],
    selection: null,
    // Button:
    itemViewClass: Ember.View.extend({
        template: Ember.Handlebars.compile("{{view.content.label}}"),
        tagName: 'button',
        isSelected: function() {
            var buttonGroup = this.get('parentView');
            var selection = buttonGroup.get('selection'); // currently selected
            var content = this.get('content'); // own value

            return (selection === content);
        }.property('parentView.selection'),
        click: function(event) {
            var content = this.get('content');
            var buttonGroup = this.get('parentView');
            buttonGroup.set('selection', content); // <=> datasubset aus dem controller        

            console.log("click");
            console.dir(content);
        },
        classNameBindings: ['isSelected:verticalTabButtonSelected:verticalTabButtonUnselected']//to change background color of button
    }),
    attributeBindings: ['data-toggle'],
    'data-toggle': 'buttons-radio'
});

// TREE VIEW
App.TreeBranchComponent = Ember.Component.extend({
    tagName: 'ul',
    classNames: ['tree-branch']
});

App.TreeNodeComponent = Ember.Component.extend({
    tagName: 'li',
    classNames: ['tree-node'],
    isExpanded: false,
    toggle: function() {
        this.toggleProperty('isExpanded');
    },
    dragStart: function(event) {
        event.stopPropagation();
        var draggable = this.get('node.draggable');
        console.log('DRAGGABLE');
        console.dir(draggable);
        console.log('DRAGGABLE - STRING')
        console.dir(JSON.stringify(draggable))
        event.dataTransfer.setData('text/plain', JSON.stringify(draggable));
        event.dataTransfer.effectAllowed = "copy";
    }
});


// DRAG AND DROP 
App.DroppableAreaComponent = Ember.Component.extend({
    dragOver: function(event) {
        event.stopPropagation();
        event.preventDefault();
    },
    drop: function(event) {
        var droppable = event.dataTransfer.getData('text/plain');
        console.log('DROPPABLE');
        console.dir(JSON.parse(droppable));
        this.get('inArea').pushObject(JSON.parse(droppable));
    }
});

// ITEMS COMPONENT 
App.PropertyItemComponent = Ember.Component.extend({
    remove: function() {
       console.log('REMOVE');
       var collection=this.get('collection'); //collection = inArea
       var item=this.get('item');
       
       console.dir(collection);      
       console.dir(item); 
       
       collection.removeObject(item);
       
    }
});
