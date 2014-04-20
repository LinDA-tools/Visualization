//create a route
App.ApplicationRoute = Ember.Route.extend({
    model: function() {
        var ds = this.store.find('datasource');
        console.log('application route');
        console.log(ds);
        return ds;
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

App.VisualizationRoute = Ember.Route.extend({
    model: function(params) {
        var response = Ember.$.getJSON('http://localhost:3000/suggest/' + params.datasource_id);
        console.log('visualization route');
        console.log(response);
        return response;
    }
});