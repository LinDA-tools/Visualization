App.Dataselection = DS.Model.extend({
    datasource: DS.belongsTo("datasource"),
    "class": DS.attr("string"),
    propertypaths: DS.hasMany("propertypath")
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

