//create a route
App.ApplicationRoute = Ember.Route.extend({
    model: function() {
        var ds = this.store.find('datasource');
        console.log('application route');
        console.log(ds);
        return ds;
    },
    renderTemplate: function() {
        this.render();
        this.render('dsManager', {// template
            into: 'application', // template
            outlet: 'dsManager', // outlet name 
        });
    }
});

App.VisualizationRoute = Ember.Route.extend({
    model: function(params) {
        return this.store.find('datasource', params.datasource_id).then(function(ds) {
            return Ember.$.getJSON('http://localhost:3001/suggest/' + params.datasource_id).then(function(tools) {
                console.log('visualization route');
                console.log(tools);
                return {selectedDatasource: ds, suggestedTools: tools}
            });
        });
    },
    setupController: function(controller, model) {
        console.log("Model: ");
        console.dir(model);
        controller.set('selectedDatasource', model.selectedDatasource);
        controller.set('suggestedTools', model.suggestedTools);
    }
});