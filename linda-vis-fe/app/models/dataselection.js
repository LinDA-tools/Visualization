import DS from "ember-data";

export default DS.Model.extend({
    datasource: DS.attr(),
    propertyInfos: DS.attr()
});

