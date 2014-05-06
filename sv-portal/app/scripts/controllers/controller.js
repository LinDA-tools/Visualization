
App.ApplicationController = Ember.ArrayController.extend({
    itemController: 'datasource',
    addSource: false,
    selectedSource: null,
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
        },
        select: function(ds) {
            console.log("SELECTFUNCT");
            console.dir(ds);
            this.set('selectedSource', ds);
            this.transitionToRoute('visualization', ds.id);
        }
    }
});

App.DatasourceController = Ember.ObjectController.extend({
});


App.VisualizationController = Ember.ArrayController.extend({
    isSelected: false,
    uri: "",
    needs: "application",
    applicationController: Ember.computed.alias("controllers.application"),
    actions: {
        select: function(tool) {
            console.log("SELECT");
            this.set('isSelected', true);
            var applicationController = this.get('applicationController');
            var ds = applicationController.get('selectedSource');
            console.dir(ds);
            console.dir(tool);

            console.log("vis controller ds: " + ds.id + " tool id: " + tool._id);

            var c = this;
            Ember.$.getJSON('http://localhost:3000/bind/' + ds.id + "/" + tool._id).then(function(uri, err) {
                console.log("BIND")

                c.set('uri', uri.uri);
            });



        }
    }
});
