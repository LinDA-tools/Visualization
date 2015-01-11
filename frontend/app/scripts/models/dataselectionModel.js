App.Dataselection = DS.Model.extend({
    datasource: DS.belongsTo('datasource'),
    subset: DS.attr('string'), // RDF class or similar
    propertyInfos: DS.attr()
});
