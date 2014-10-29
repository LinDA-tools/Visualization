App.IndexRoute = Ember.Route.extend({
    renderTemplate: function() {
        this._super(this, arguments);
        this.render('dataselection', {
            outlet: 'dataselection',
            into: 'index',
            controller: 'dataselection'
        });
    },
    setupController: function(controller, model) {
        var self = this;
        this.store.find('datasource').then(function(response) {
            console.log("setup index controller:");
            console.dir(response)
            self.controllerFor('dataselection').set('model', response.toArray());
        });
    }

});
