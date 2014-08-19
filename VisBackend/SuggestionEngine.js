var modules = require('./Modules');
var GraphStoreClient = require('graph-store-client'); // works with promises (for managing the order of execution of asynchronous calls)
var endpoint = 'http://localhost:8890/sparql';
var client = new GraphStoreClient(endpoint, null);
var Q = require('q'); // promis library for the graph-store-client SPARQL client


function suggest(datasource_id) {
    console.log('SUGGESTION ENGINE ##############');
    var query = modules.DatasourceModel.findById(datasource_id);

    return query.exec().then(function(datasource, err) {
        if (err) {
            console.log('SE: Could not retrieve datasource:' + err);
            return;
        }

        console.log('DATASETS');
        console.dir(datasource);

        if (datasource.format !== 'sparql') { // tabular data           
            return getCSVVisualizations().then(function(visualizations, err) {
                if (err) {
                    console.log('SE: Could not retrieve visualizations: ' + err);
                    return;
                }
                return visualizations;
            });

        } else { // RDF data
            console.log('RETRIEVE VOID ' + datasource.name);

            return getVocabularies().then(function(vocabularies, err) {
                if (err) {
                    console.log('SE: Could not retrieve vocabulary graphs: ' + err);
                    return;
                }
                return suggestRDF(datasource.metadata, vocabularies);
            });

        }
    });
     console.log(' ############## SUGGESTION ENGINE END');
}

function suggestRDF(dsUri, vocUri) {  
    console.log("SUGGEST_RDF");
    
    return getPropertiesAndClasses(dsUri, vocUri).then(function(results, err) {
        var dsList = results.shift();
        var matching = match(dsList.list, results);
        
        return matching;
    }).then(function(matching, err) {       
        var ranking = rank(matching);  
        
        return ranking;    
    }).then(function(ranking, err) {
        var categories = getCategories(ranking);
       
        return categories;
    }).then(function(categories, err) {         
        var suggestions = getTools(categories);
                       
        return suggestions;
    });
}

function match(dsList, vocLists) {
    var matching = {};
    console.log("MATCH VOCABULARIES");        
    console.dir(dsList);
    console.dir(vocLists);
    for (var g in vocLists) {
        var match = 0;
        var rmap = vocLists[g];
        var vocList = rmap.list;
        for (var d in dsList) {
            for (var v in vocList) {
                if (dsList[d] === vocList[v]) {
                    console.dir(dsList[d])

                    match = match + 1;
                }
            }
        }
        matching[rmap.graph] = match / vocList.length;
    }
    console.log("MATCHING RESULT");
    console.dir(matching);
    return matching;
}

function rank(matching) {   
    var ranking = Object.keys(matching);
    ranking.sort(function(a, b) {
        return matching[b] - matching[a]
    });
 
    var result = {matching: matching, ranking: ranking};  
    
    console.log("RANKING RESULT");
    console.dir(result);
    
    return result;
}

function getVocabularies() {
    // graph uri of each vocabulary
    var query = modules.VocabularyModel.find();
    query.select('graph');

    return query.exec();
}

function getTools(category) {         
    var tm = modules.WidgetModel;
    console.log('cat');
    console.dir(category);
    var tools = tm.find({}).where('category').in(category).exec().then(function(result, err) {    
    console.log('SUGGESTED TOOLS RESULT');
    console.dir(result);
    return result;
    });

    console.log('SUGGESTED TOOLS');
    console.dir(tools);
    
    return tools;
}

function getCSVVisualizations() {
    return modules.WidgetModel.find({}).exec();
}

function getPropertiesAndClasses(dsUri, vocUri) {
    console.log("RETRIEVE CLASSES AND PROPERTIES" );      
    var array = [];

    // SPARQL query metadata data source (properties and classes list: ds_pl and ds_cl)
    var qds = "SELECT DISTINCT ?cp WHERE { \n\
                    GRAPH <" + dsUri + "> { \n\
                        { ?x <http://rdfs.org/ns/void#classPartition> ?y . ?y <http://rdfs.org/ns/void#class> ?cp }\n\
                        UNION\n\
                        { ?x <http://rdfs.org/ns/void#propertyPartition> ?y . ?y <http://rdfs.org/ns/void#property> ?cp } \n\
                    }\n\
                }";

    array.push(execQuery(qds, dsUri)); // retrieve classes and properties of ds

    // SPARQL query vocabulary (properties and classes list: vi_pl vi_cl)
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
        array.push(execQuery(qvc, graph)); // retrieve classes and properties of each vocabulary
    }
    return Q.all(array);
}

function getCategories(resultRanking){
       var vm = modules.VocabularyModel.find();
       var ranking = resultRanking.ranking; // array [graph, graph, ...]
       var matching = resultRanking.matching; // map {graph:sim_val, graph:sim_val, ...}
      
       return vm.find({}).exec().then(function(result, err) {                                     
            var categories = [];
              for (var v = 0; v < result.length; v++) {             
                 for (var k = 0; k < ranking.length; k++) {
                         if((ranking[k]===result[v].graph) && (matching[result[v].graph]>0)){                       
                             categories.push(result[v].category);
                         }  
                  }   
              }

            console.log('RETRIEVE CATEGORIES');
            console.dir(categories); 
            
            return categories;
            });
}

function execQuery(q, g) {
    map = [];
    return client.query(q).then(function(res, err) {
        if (err) {
            console.log('SE: could not retrieve classes or properties: ' + err);
            return;
        }

        var uris = res.map(function(result) {
            return result.cp.value;
        });
        // console.dir(uris);
        map[g] = uris;
        return {"graph": g, "list": uris};
    });
}

exports.suggest = suggest;