var GraphStoreClient = require('graph-store-client');
var metadata_endpoint = 'http://localhost:8890/sparql';
var metadata_graph = 'http://www.linda-project.org/dataset_metadata';
var client = new GraphStoreClient(metadata_endpoint, null);
var Q = require('q');
var _ = require('lodash');

// For better stack trackes
Q.longStackSupport = true;

function retrieveMetadata(datasource_id, visualization_id) {
    console.log('DATASET MANAGEMENT ##############');
    var metadataPromises = [];

    metadataPromises.push(metadataRDF());
    metadataPromises.push(metadataCSV());

    return Q.all(metadataPromises).then(function(result) {
        console.log('Retrieved dataset metadata: ');
        var metadata = {datasource: _.flatten(result, true)};
        printDeep(metadata);
        return metadata;
    });
}

function metadataRDF() {
    
    console.log('Retrieve RDF dataset metadata ...');
    
    var query = "";

    query += "PREFIX sd: <http://www.w3.org/ns/sparql-service-description#>";
    query += "PREFIX void: <http://rdfs.org/ns/void#> ";
    query += "PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> ";
    query += "PREFIX dcterms: <http://purl.org/dc/terms/> ";

    query += "SELECT ?ds ?title ?graph ?endpoint WHERE";
    query += "{";
    query += " GRAPH <" + metadata_graph + "> ";
    query += " {";
    query += "  ?ds rdf:type void:Dataset .";
    query += "  ?ds dcterms:title ?title .";
    query += "  ?x sd:graph ?ds .";
    query += "  ?x sd:name ?graph .";
    query += "  ?y sd:namedGraph ?x .";
    query += "  ?y sd:url ?endpoint .";
    query += " }";
    query += "}";

    return client.query(query).then(function(results, err) {

        return results.map(function(result, i) {
            return {
                id: result.ds.value,
                title: result.title.value,
                location: {
                    graph: result.graph.value,
                    endpoint: result.endpoint.value
                },
                format:'rdf'
            };
        });
    });
}

function metadataCSV() {
    
    console.log('Retrieve CSV dataset metadata ...');
    
    var query = "";

    query += "PREFIX dcterms: <http://purl.org/dc/terms/>";
    query += "PREFIX dcat: <http://www.w3.org/ns/dcat#>";
    query += "PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>";

    query += "SELECT ?ds ?title ?location WHERE";
    query += "{";
    query += " GRAPH <" + metadata_graph + "> ";
    query += " {";
    query += "  ?ds rdf:type dcat:Distribution.";
    query += "  ?ds dcat:downloadURL ?location.";
    query += "  ?x dcat:distribution ?ds.";
    query += "  ?x dcterms:title ?title.";
    query += " }";
    query += "}";

    return client.query(query).then(function(results, err) {

        return results.map(function(result, i) {
            return {
                id: result.ds.value,
                title: result.title.value,
                location:  result.location.value,
                format: 'csv'
            };
        });
    });
}

// Print whole object tree
function printDeep(object) {
    console.log(JSON.stringify(object, null, 1));
}

exports.retrieveMetadata = retrieveMetadata;