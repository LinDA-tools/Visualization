/*Main route.*/
App.ApplicationRoute = Ember.Route.extend({
    model: function() {
        return $.getJSON("config.json")
    }
});

