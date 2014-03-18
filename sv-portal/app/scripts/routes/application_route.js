//create a route
App.ApplicationRoute = Ember.Route.extend({
    model: function() {
        return this.store.find('datasource');
    }
    ,
    renderTemplate: function() {
        this.render();
        this.render('dsManager', {// template
            into: 'application', // template
            outlet: 'dsManager', // outlet name 
        });
    }
});

App.VisualizationRoute=Ember.Route.extend({ 
     model: function() {
        return this.store.find('tool');
    }
});