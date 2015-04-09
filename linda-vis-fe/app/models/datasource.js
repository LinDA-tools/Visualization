import DS from "ember-data";

export default DS.Model.extend({
    name: DS.attr("string"),
    location: DS.attr("string"),
    graph: DS.attr("string"),
    format: DS.attr("string")
});
