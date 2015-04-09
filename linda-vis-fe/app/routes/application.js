import Ember from "ember";
/*Main route.*/
/* global $ */
export default Ember.Route.extend({
 model: function() {
        return $.getJSON("config.json");
    }
});


