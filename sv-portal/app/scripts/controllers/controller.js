
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
                uri: uri,
                graph: graph
            });

            this.set('name', '');
            this.set('uri', '');
            this.set('graph', '');

            datasource.save();
        },
        visualize: function() {
            var c = this

            this.forEach(function(item) {
                var checked = item.get('isChecked');
                if (checked) {
                    var name = item.get('name');
                    var uri = item.get('uri');
                    var graph = item.get('graph');


                    $.getJSON('http://localhost/VisRI/index.php/toolList/' + encodeURIComponent(graph) + '/' + encodeURIComponent(uri),
                            function(tool) {
                                var tool = c.store.createRecord('tool', {
                                    name: "name",
                                    uri: "uri"
                                });
                                c.transitionToRoute('visualization');
                            });

                    console.log(name);
                    return;
                }
            });
        }
    }
});

App.DatasourceController = Ember.ObjectController.extend({
    isChecked: false
});

App.ToolController = Ember.ObjectController.extend({
    isChecked: false
});

App.VisualizationController = Ember.ArrayController.extend({
    itemController: 'tool',
    selected: false,
    uri:"",
    actions: {
        select: function() { 
            var c = this;
            this.forEach(function(item) {
                var checked = item.get('isChecked');
                if (checked) {
                    c.set('selected', true);
                    c.set('uri', item.get('uri'));               
                    console.log(item.get('uri'));
                    return;
                }
            });
        }
    }
});
