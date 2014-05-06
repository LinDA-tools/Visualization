var modules = require('./Modules');
var GraphStoreClient = require('graph-store-client'); // works with promises (for managing the order of execution of asynchronous calls)
var endpoint = 'http://localhost:8890/sparql';
var client = new GraphStoreClient(endpoint, null);
var Q = require('q'); // promis library for the graph-store-client SPARQL client

function suggest(dsUri, vocUri) {
    console.log("suggest " + dsUri);
    return getPropertiesAndClasses(dsUri, vocUri).then(function(results, err) {
        if (err) {
            console.log('SE: Could not retrieve classes and properties from data source or vocabularies: ' + err);
            return;
        }
        var dsList = results.shift();

        console.log('matching');
        var matching = match(dsList.list, results);
        console.dir(matching);        

        console.log('category');
        return getCategories(matching);
    }).then(function(categories, err) {
        if (err) {
            console.log('SE: Could not calculate categories ranking: ' + err);
            return;
        }
        console.dir(categories);

        console.log('tools');
        return getTools(categories);
    }).then(function(tools, err) {
        if (err) {
            console.log('SE: Could not retrieve tools: ' + err);
            return;
        }
        console.dir(tools);
        return tools;
    });
    return suggestions;
}

function match(dsList, vocLists) {
    var matching = {};
    console.log('MATCHING');
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
    return matching;
}

function rank(matching) {
    var ranking = Object.keys(matching);
    ranking.sort(function(a, b) {
        return matching[b] - matching[a]
    });
    return {matching: matching, ranking: ranking};
}

function getCategories(matching) {
    var vm = modules.CategoryModel;

    var categories = vm.find({}).populate('vocabularies').exec().then(function(result, err) {
        var map = {};

        if (err) {
            console.log('SE: Could not retrieve category: ' + err);
            return;
        }

        // calculate maximum of vocabulary matchings in order to determine category ranking
        for (c in result) {
            var category = result[c];
            var vocabularies = category.vocabularies;
            var m = 0;
            for (var v = 0; v < vocabularies.length; v++) {
                var matchingValue = matching[vocabularies[v].graph];
                if (m < matchingValue) {
                    m = matchingValue;
                }
            }
            if (category.name === 'Generic' || m > 0) {
                map[category.name] = m;
            }
        }

        return rank(map);
    });
    return categories;
}

function getTools(category) {
    var categories = category.ranking;
    var tm = modules.ToolModel;

    var tools = tm.find({}).where('category').in(categories).exec().then(function(result, err) {
        if (err) {
            console.log('SE: Could not retrieve tools: ' + err);
            return;
        }
        return result;
    });

    return tools;
}

function getPropertiesAndClasses(dsUri, vocUri) {
    console.log("getPropertiesAndClasses " + dsUri);
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
                        }\n\
                    } ";
        array.push(execQuery(qvc, graph)); // retrieve classes and properties of each vocabulary
    }
    return Q.all(array);
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