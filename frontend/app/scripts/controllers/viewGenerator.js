function viewGenerator(container, mappings){
    for (var mapping in mappings){
        var view = Ember.View.create({
            tagName: 'li',
            templateName : mapping['template'],
            value : mapping['option']['value'],
     
        });
        container.pushObject(view);
    }
};


