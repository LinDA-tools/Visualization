import DS from "ember-data";

var Adapter = DS.RESTAdapter.extend({
        host: 'http://' + window.location.hostname + ':3002'
});

export default Adapter;
