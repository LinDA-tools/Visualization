var modules = require('./Modules');

function suggest(graphUri) { // ToDo: resUri
    var resSuggestion = [];

// 1. SPARQL query metadata data source (properties and classes list: ds_pl and ds_cl)
    var SparqlClient = require('sparql-client');
    var endpoint = 'http://localhost:8890/sparql'; // TODO
    var client = new SparqlClient(endpoint);

    var qp = "SELECT ?z WHERE { GRAPH ?g { ?x <http://rdfs.org/ns/void#classPartition> ?y . ?y <http://rdfs.org/ns/void#class> ?z }} ";
    console.log('QUERY DS PROPERTIES: ' + qp);
    var pl; // properties list

    client.query(qp)
            .bind('g', '<' + graphUri + '>')
            .execute(function(err, res) {
                if (err) {
                    console.log('SE: could not retrieve properties from ds: ' + err);
                    return;
                }
                console.log('QUERY pl RES');
                pl = res.results.bindings.map(function(result) {
                    return result.z.value;
                });
                console.dir(pl);
            });

    var qc = "SELECT ?z  WHERE {GRAPH ?g { ?x <http://rdfs.org/ns/void#propertyPartition> ?y . ?y <http://rdfs.org/ns/void#property> ?z } } ";
    console.log('QUERY DS CLASSES: ' + qc);
    var cl; // classes list

    client.query(qc)
            .bind('g', '<' + graphUri + '>')
            .execute(function(err, res) {
                if (err) {
                    console.log('SE: could not retrieve classes from ds: ' + err);
                    return;
                }
                console.log('QUERY cl RES: ');
                cl = res.results.bindings.map(function(result) {
                    return result.z.value;
                });
                console.dir(cl);
            });

// 2. MongoDB vocabulary (graph uri of each vocabulary)
    var vm = modules.VocabularyModel;
    var vocUri = [];
    var query = vm.find();

    query.select('graph');
    query.exec(function(err, res) {

        if (err) {
            console.log('SE: could not retrieve vocabulary graphs: ' + err);
            return;
        }

        vocUri = res;
        console.log('SE: graph uris: ' + vocUri);
    });


// 3. SPARQL query vocabulary (properties and classes list: vi_pl vi_cl)
    var v = {};

    for (var i in vocUri) {
        console.log(vocUri[i].graph);
        var qvc = "SELECT ?y  WHERE { GRAPH ?g { { ?x <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/2000/01/rdf-schema#Class> } UNION {?x <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/2002/07/owl#Class>} } } ";

        var qvp = "SELECT ?y  WHERE { GRAPH ?g { { ?x <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/1999/02/22-rdf-syntax-ns#Property> } UNION {?x <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/2002/07/owl#ObjectProperty>} } } ";

        console.log('QUERY V CLASSES: ' + qvc);
        console.log('QUERY V PROPERTIES: ' + qvp);

        client.query(qvc)
                .bind('g', '<' + vocUri.graph + '>')
                .execute(function(err, res) {
                    if (err) {
                        console.log('SE: could not retrieve classes from vocabulary: ' + err);
                        return;
                    }
                    console.log('QUERY v RES: ');
                    v[vocUri.graph] = res.results.bindings.map(function(result) {
                        return result.z.value;
                    });
                    console.dir(v);
                });

        client.query(qvp)
                .bind('g', '<' + vocUri.graph + '>')
                .execute(function(err, res) {
                    if (err) {
                        console.log('SE: could not retrieve properties from vocabulary: ' + err);
                        return;
                    }
                    console.log('QUERY v RES: ');
                    v[vocUri.graph] = res.results.bindings.map(function(result) {
                        return result.z.value;
                    });
                    console.dir(v);
                });
    }

// 4. MATCHING (ds_pl, vi_pl) (ds_cl, vi_cl)

    for (var graph in v) {
        console.log(v[graph]);
    }

// 5. RANKING 

    return resSuggestion;
}

exports.suggest = suggest;