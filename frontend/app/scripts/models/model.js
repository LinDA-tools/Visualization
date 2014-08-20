App.Datasource = DS.Model.extend({
    name: DS.attr("string"),
    location: DS.attr(),
    format: DS.attr("string"),
    metadata:DS.attr("string")
});
