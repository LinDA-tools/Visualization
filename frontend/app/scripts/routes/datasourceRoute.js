App.DatasourceRoute = Ember.Route.extend({
    model: function(params) {
        return this.store.createRecord('datasource', {name: params.name, location: params.location, graph: params.graph, format:params.format});
    }
});
