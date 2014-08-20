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
        var tools = Ember.$.getJSON('http://localhost:3001/suggest/' + params.datasource_id);
        console.log('visualization route');
        console.log(tools);
        return tools;
    },
    setupController: function(controller, model) {
        controller.set('model', model);
        controller.set('isSelected', false);
        controller.set('uri', '');
    }
});