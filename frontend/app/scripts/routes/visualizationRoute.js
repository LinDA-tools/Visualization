App.VisualizationRoute = Ember.Route.extend({
    model: function(params) {
        console.log("Requesting visualization for: " + params.dataselection_id)
        return this.store.find('visualization', params.dataselection_id).then(function(result) {
            console.log("Recommendations:")
            console.dir(result)
            return [result];
        });
    }
});