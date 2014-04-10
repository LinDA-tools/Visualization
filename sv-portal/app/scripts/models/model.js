App.Datasource = DS.Model.extend({
    name: DS.attr("string")
    , graph: DS.attr("string")
    , uri: DS.attr("string")
});

App.Datasource.FIXTURES = [
    {
        id:1
        , name: "foo"
        , graph: "http://foo.de"
        , uri: "http://foo.de/sparql"
    }
    ,
    {
        id: 2
        , name: "bar"
        , graph: "http://bar.org"
        , uri: "http://bar.org/sparql"
    }
];

App.Tool = DS.Model.extend({
    name: DS.attr("string")
    , uri: DS.attr("string")
});

App.Tool.FIXTURES = [
    {
        id: 1
        , name: "bar"
        , uri: "http://www.heise.de"
    }
];