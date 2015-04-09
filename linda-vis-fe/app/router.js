import Ember from 'ember';
import config from './config/environment';

var Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {
    this.route("visualization", {
        path: '/visualization/:source_type/:id'
    });
    this.route("datasource", {
        path: '/datasource/:name/:location/:graph/:format'
    });
    this.route("dataselection", {
        path: '/dataselection/:selection/:datasource'
    });
    this.route("saved-visualizations");
    this.route("configure");
});

export default Router;
