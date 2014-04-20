
App.ApplicationController = Ember.ArrayController.extend({
    itemController: 'datasource',
    addSource: false,
    actions: {
        show: function() {
            this.set('addSource', true);
        },
        hide: function() {
            this.set('addSource', false);
        },
        add: function() {
            var name = this.get('name');
            var uri = this.get('uri');
            var graph = this.get('graph');

            var datasource = this.store.createRecord('datasource', {
                name: name,
                endpoint: uri,
                graph: graph
            });

            this.set('name', '');
            this.set('uri', '');
            this.set('graph', '');

            datasource.save();
        }
    }
});

App.DatasourceController = Ember.ObjectController.extend({
    isChecked: false
});


App.VisualizationController = Ember.ArrayController.extend({
    isSelected: false,
    uri:"",
    actions: {
        select: function(tool) { 
         this.set('isSelected', true);
         //TODO placeholder = graph from ds 
         this.set('uri', tool.tooluri);               
        }
    }
});
