App.IndexController = Ember.ObjectController.extend({
    needs: ['application'],
    datasetsEndpointURI: function () {
        return encodeURIComponent(this.get('controllers.application.datasetsEndpoint'));
    }.property()
});
