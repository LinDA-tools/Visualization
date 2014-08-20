var modules = require('./metadata_module');
var GraphStoreClient = require('graph-store-client');
var endpoint = 'http://localhost:8890/sparql';
var client = new GraphStoreClient(endpoint, null);
var Q = require('q');

function suggest(datasource_id) {
    console.log('RECOMMENDATION ENGINE ##############');
    var query = modules.DatasourceModel.findById(datasource_id);

    return query.exec().then(function(datasource, err) {
        if (err) {
            console.log('recommendation_engine: Could not retrieve datasource:' + err);
            return;
        }

        console.log('DATASET');
        console.dir(datasource);

        if (datasource.format !== 'rdf') { // tabular data  

            return modules.WidgetModel.find({}).exec();

        } else { // RDF data
            console.log('RETRIEVE VOID ' + datasource.name);

            return modules.VocabularyModel.find({}).exec().then(function(vocabularies, err) {
                if (err) {
                    console.log('recommendation_engine: Could not retrieve vocabulary graphs: ' + err);
                    return;
                }

                console.log('RETRIEVE VOCABULARIES ##############');
                console.dir(vocabularies);

                return data(datasource.metadata, vocabularies);
            }).then(function(results, err) {
                var dsList = results.shift();
                var matching = match(dsList.list, results);

                return matching;
            }).then(function(resultMatching, err) {
                var ranking = rank(resultMatching);

                return ranking;
            }).then(function(resultRanking, err) {
                var ranking = resultRanking.ranking;
                var matching = resultRanking.matching;

                return modules.VocabularyModel.find({}).exec().then(function(result, err) {
                    var categories = [];
                    
                    for (var v = 0; v < result.length; v++) {
                        for (var k = 0; k < ranking.length; k++) {
                            if ((ranking[k] === result[v].graph) && (matching[result[v].graph] > 0)) {
                                categories.push(result[v].category);
                            }
                        }
                    }

                    console.log('RETRIEVED CATEGORIES ##############');
                    console.dir(categories);

                    return categories;
                });
            }).then(function(categories, err) {
                return modules.WidgetModel.find({}).where('category').in(categories).exec().then(function(visualisations, err) {

                    if (err) {
                        console.log('recommendation_engine: Could not retrieve visualizations: ' + err);
                        return;
                    }

                    if (visualisations.length === 0) {

                        return modules.WidgetModel.find({}).where('category').equals('statistical').exec().then(function(visualisations, err) {
                            console.log('PROVISIONAL VISUALISATIONS ##############');
                            console.dir(visualisations);
                            return visualisations;
                        });
                    }

                    console.log('SUGGESTED VISUALISATIONS RESULT ##############');
                    console.dir(visualisations);
                    return visualisations;
                });

            });
        }
    });
}

function data(dsUri, vocUri) {
    console.log("RETRIEVE CLASSES AND PROPERTIES ##############");
    var array = [];

    var qds = "SELECT DISTINCT ?cp WHERE { \n\
                    GRAPH <" + dsUri + "> { \n\
                        { ?x <http://rdfs.org/ns/void#classPartition> ?y . ?y <http://rdfs.org/ns/void#class> ?cp }\n\
                        UNION\n\
                        { ?x <http://rdfs.org/ns/void#propertyPartition> ?y . ?y <http://rdfs.org/ns/void#property> ?cp } \n\
                    }\n\
                }";

    array.push(execQuery(qds, dsUri));

    for (var i in vocUri) {
        var graph = vocUri[i].graph;
        var qvc = "SELECT DISTINCT ?cp  WHERE { \n\
                        GRAPH <" + graph + "> { \n\
                            { ?cp <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/2000/01/rdf-schema#Class> } \n\
                            UNION \n\
                            { ?cp <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/2002/07/owl#Class> } \n\
                            UNION \n\
                            { ?cp <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/1999/02/22-rdf-syntax-ns#Property> } \n\
                            UNION \n\
                            { ?cp <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/2002/07/owl#ObjectProperty> } \n\
                            UNION \n\
                            { ?cp <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/2002/07/owl#DatatypeProperty> } \n\
                        }\n\
                    } ";
        array.push(execQuery(qvc, graph));
    }
    return Q.all(array);
}

function match(dsList, vocLists) {
    var matching = {};

    for (var g in vocLists) {
        var match = 0;
        var rmap = vocLists[g];
        var vocList = rmap.list;
        for (var d in dsList) {
            for (var v in vocList) {
                if (dsList[d] === vocList[v]) {
                    match = match + 1;
                }
            }
        }
        matching[rmap.graph] = match / vocList.length;
    }

    console.log("MATCHING RESULT ##############");
    console.dir(dsList);
    console.dir(vocLists);
    console.dir(matching);

    return matching;
}

function rank(matching) {
    var ranking = Object.keys(matching);

    ranking.sort(function(a, b) {
        return matching[b] - matching[a];
    });

    var result = {matching: matching, ranking: ranking};

    console.log("RANKING RESULT ##############");
    console.dir(result);

    return result;
}

function execQuery(q, g) {
    map = [];
    return client.query(q).then(function(res, err) {
        if (err) {
            console.log('recommendation_engine: could not retrieve classes or properties: ' + err);
            return;
        }

        var uris = res.map(function(result) {
            return result.cp.value;
        });
        map[g] = uris;
        return {"graph": g, "list": uris};
    });
}

exports.suggest = suggest;