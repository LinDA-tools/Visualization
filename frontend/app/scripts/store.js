App.Store = DS.Store.extend({
    revision: 13,
    adapter: DS.RESTAdapter.extend({
        host: 'http://localhost:3001'
    })
});

App.ApplicationSerializer = DS.RESTSerializer.extend({
    primaryKey: '_id',
    serialzeId: function(id) {
        return id.toString();
    },
    normalizePayload: function(type, payload) { 
        var result = {};
        result[type.typeKey]=payload; 
        console.log(result); 
        return result;
    },
    serializeIntoHash: function(hash, type, record, options) {
        Ember.merge(hash, this.serialize(record, options));
    }
});

