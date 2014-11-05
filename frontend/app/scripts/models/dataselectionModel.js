App.Dataselection = DS.Model.extend({
    datasource: DS.belongsTo("datasource"),
    selectedClass: DS.attr(), // DS.belongsTo("rdfclass"),
    propertypaths: DS.attr() // DS.hasMany("propertypath")
});

App.Rdfclass = DS.Model.extend({
    label: DS.attr("string"),
    uri: DS.attr("string"),
    datasource: DS.belongsTo("datasource"),
    childproperties: DS.hasMany("rdfproperty")
});

App.Rdfproperty = DS.Model.extend({
    label: DS.attr("string"),
    uri: DS.attr("string"),
    childproperties: DS.hasMany("rdfproperty")
});

App.Propertypath = DS.Model.extend({
    properties: DS.hasMany("rdfproperty")
});

