var modules = require('./metadata_module');
var GraphStoreClient = require('graph-store-client');
var endpoint = 'http://localhost:8890/sparql';
var client = new GraphStoreClient(endpoint, null);
var Q = require('q');
var _ = require('lodash');

// For better stack trackes
Q.longStackSupport = true;

function preconfigure(datasource_id, visualization_id) {
    console.log('PRECONFIGURATION ENGINE ##############');
    var datasource = null;
    var structureOptions = null;

    return modules.DatasourceModel.findById(datasource_id).exec().then(function(result) {
        console.log('DATASET');
        console.dir(result);
        datasource = result;

        return datasource;
    }).then(function(datasource) {
        return modules.WidgetModel.findById(visualization_id).exec().then(function(visualization) {
            console.log('VISUALIZATION');
            console.dir(visualization);
            structureOptions = visualization.structureOptions;

            var optionsInfo = createOptionsInfo(structureOptions, datasource.location.graph, [])
            console.log('OPTIONS INFO');
            console.dir(optionsInfo);
            return optionsInfo;
        }).then(function(optionsInfo) {
            var optionMatchPromises = [];
            var optionsMap = {};

            optionsInfo.forEach(function(optionInfo) {
                console.log('forEach property');
                console.dir(optionInfo);
                var dsUri = datasource.location.graph;
                var promise = getMatchingPropertiesInfo(dsUri, optionInfo);
                optionMatchPromises.push(promise);
            });


            if (optionMatchPromises.length === 0) {
                return Q.fcall(function(res) {
                    console.log('Not preconfiguring...');
                    console.dir(optionsMap)
                    return optionsMap;
                });
            } else {
                return Q.all(optionMatchPromises).then(function(optionMatchesArray) {
                    var allOptionMatches = _.flatten(optionMatchesArray);
                    // console.log('properties selection');
                    // printDeep(allOptionMatches);
                    // E.g.
                    // [
                    //   {
                    //     "option": "lat",
                    //     "property": "http://www.w3.org/2003/01/geo/wgs84_pos#lat",
                    //       "label": "latitude",
                    //       "datatypes": [
                    //          "http://www.w3.org/2001/XMLSchema#string"
                    //       ],
                    //     "parentClass": "http://www.hospitals_reviewer.com/schema#Hospital"
                    //   }, 
                    //   {...}, 
                    //   ...
                    // ]

                    if (allOptionMatches.length > 0) {
                        // 1. Group all matching properties of all options by parent class
                        var matchesByClass = _.groupBy(allOptionMatches, 'parentClass');

                        // console.log("Matches by class:");
                        // printDeep(matchesByClass);
                        // E.g.
                        // {
                        //   "http://www.hospitals_reviewer.com/schema#Hospital": [
                        //     {
                        //       "option": "lat",
                        //       ...,
                        //       "parentClass": "http://www.hospitals_reviewer.com/schema#Hospital"
                        //     }, 
                        //     {...} 
                        //   ],
                        //   ...
                        // }

                        // 2. Group each class's matches by option
                        var optionMatchesByClass = _.mapValues(matchesByClass, function(classMatches) {
                            return _.groupBy(classMatches, function(m) {
                                return m.option;
                            });
                        });

                        // 3. Select the class with most matching options
                        var sortedOptionMatchesByClass = _.sortBy(optionMatchesByClass, function(optionMatches) {
                            // sort is ascending, but we want descending => take negative size
                            return -(_.size(optionMatches));
                        });
                        var selectedClassOptionMatches = sortedOptionMatchesByClass[0];
                        console.log("selectedClassOptionMatches");
                        printDeep(selectedClassOptionMatches);
                        var selectedClass = _.values(selectedClassOptionMatches)[0][0].parentClass;
                        console.log("selectedClass");
                        printDeep(selectedClass);

                        // 4. Map a random value for each option
                        for (var option in selectedClassOptionMatches) {
                            var optionMatches = selectedClassOptionMatches[option];
                            var random = Math.floor((Math.random() * optionMatches.length));
                            var optionMatch = optionMatches[random];
                            var label = optionMatch.label || simplifyURI(optionMatch.property);

                            console.log("Mappiong to " + option + ":");
                            printDeep(optionMatch);
                            optionsMap[option] = [{
                                    id: optionMatch.property,
                                    label: label,
                                    parent: [selectedClass]
                                }
                            ];
                        }
                    }
                    console.log("preconfiguring... ");
                    printDeep(optionsMap);
                    return optionsMap;
                });
            }

        }).then(function(optionsMap) {
            console.log('PRECONFIGURATION__________________________________');
            console.dir(optionsMap);
            var configMap = createConfigMap(structureOptions, datasource.location.graph, optionsMap);
            console.log('config map');
            console.dir(configMap);
            return configMap;
        });
    });
}

function createConfigMap(options, dsUri, preconfig) {
    var configMap = {};
    for (var optionName in options) {

        var option = options[optionName];

        if (option.suboptions) {
            configMap[optionName] = createConfigMap(option.suboptions, dsUri, preconfig);
        } else {
            configMap[optionName] = preconfig[optionName] || [];
        }
    }
    return configMap;
}

function getMatchingPropertiesInfo(dsUri, optionInfo) {
    // optionMap => {xAxis:{id:'', label:'', parent:[]}, yAxis:{}}
    var optionPropertyClasses = optionInfo.propertyClasses;
    var optionProperties = optionInfo.properties;

    return getDSPropertiesByClass(dsUri, optionPropertyClasses).then(function(propertiesByClass) {
        console.log('returned properties');
        console.dir(propertiesByClass);

        var allProperties = propertiesByClass.concat(optionProperties);
        console.log('concatenated properties');
        console.dir(allProperties);


        return getDSPropertyInfos(dsUri, allProperties);
    }).then(function(propertyInfos) {
        var matchingPropertyInfos = [];

        propertyInfos.forEach(function(propertyInfo) {
            console.log("propertyInfo")
            printDeep(propertyInfo)
            propertyInfo.parentClasses.forEach(function(parentClass) {
                matchingPropertyInfos.push({
                    option: optionInfo.option,
                    property: propertyInfo.property,
                    label: propertyInfo.label,
                    datatypes: propertyInfo.datatypes,
                    parentClass: parentClass
                });
            });
        });

        return matchingPropertyInfos;
    });
}

function createOptionsInfo(options, dsUri, optionsInfo) {

    for (var optionName in options) {
        var option = options[optionName];

        if (option.suboptions) {
            createOptionsInfo(option.suboptions, dsUri, optionsInfo);
        } else {
            optionsInfo.push({
                option: optionName,
                propertyClasses: option.propertyClasses || [],
                properties: option.properties || []
            });
        }
    }
    return optionsInfo;
}

function getDSPropertiesByClass(dsUri, propertyClasses) {
    console.log("RETRIEVE CLASSES FROM THE DATASET FOR INITIALIZING A VISUALIZATION OPTION ##############");

    if (propertyClasses.length > 0) {
        var union = "";

        for (var i = 0; i < propertyClasses.length; i++) {
            if (i > 0) {
                union += ' UNION ';
            }
            union += '{\n\
                            ?property rdf:type <' + propertyClasses[i] + '> .\n\
                        }';
        }

        var q = '\
                PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>\n\
                PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>\n\
                SELECT DISTINCT ?property WHERE {\n\
                    GRAPH <' + dsUri + '> {\n\
                        ' + union + '\n\
                    }\n\
                } LIMIT 50';

        return client.query(q).then(function(results) {
            console.log('properties by class result:');
            console.dir(results);
            return results.map(function(result) {
                return result.property.value;
            });
        });
    } else {
        return Q.fcall(function() {
            return [];
        });
    }
}

function queryForEach(array, getQuery) {
    var promises = [];
    array.forEach(function(element) {
        var query = getQuery(element);
        var promise = client.query(query);
        promises.push(promise);
    });

    return Q.all(promises);
}

function getDSPropertyInfos(dsUri, properties) {
    console.log("RETRIEVE PROPERTIES FROM THE DATASET FOR INITIALIZING A VISUALIZATION OPTION ##############");
    console.log('iterating over the properties');
    printDeep(properties);
    var propertyParents;
    var propertyLabels;
    var propertyDatatypes;

    return queryForEach(properties, function(property) {
        return '\n\
            PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>\n\
            PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>\n\
            PREFIX skos: <http://www.w3.org/2004/02/skos/core#>\n\
            SELECT DISTINCT ?propertyLabel WHERE {\n\
                GRAPH <' + dsUri + '> {\n\
                    OPTIONAL {\n\
                        <' + property + '> rdfs:label ?propertyLabel . \n\
                    }\n\
                    OPTIONAL {\n\
                        <' + property + '> skos:prefLabel ?propertyLabel . \n\
                    }\n\
                }\n\
            } LIMIT 1\n';
    }).then(function(propertyLabelResultsArray) {
        console.dir("propertyLabelResultsArray");
        printDeep(propertyLabelResultsArray);
        propertyLabels = propertyLabelResultsArray.map(function(propertyLabelResults, i) {
            var propertyLabel = propertyLabelResults[0].propertyLabel;
            if (propertyLabel) {
                return propertyLabel.value;
            } else {
                return simplifyURI(properties[i]);
            }
        });

        return queryForEach(properties, function(property) {
            return '\n\
            PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>\n\
            PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>\n\
            SELECT DISTINCT DATATYPE(?object) as ?type WHERE {\n\
                GRAPH <' + dsUri + '> {\n\
                    ?subject <' + property + '> ?object.\n\
                }\n\
            }\n';
        });
    }).then(function(datatypeResultsArray) {
        console.dir("datatypeResultsArray");
        printDeep(datatypeResultsArray);
        propertyDatatypes = datatypeResultsArray.map(function(datatypeResults, i) {
            return _.map(datatypeResults, function(datatypeResult) {
                if (datatypeResult.type) {
                    return datatypeResult.type.value;
                }
            });
        });

        return queryForEach(properties, function(property) {
            return '\n\
            PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>\n\
            PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>\n\
            SELECT DISTINCT ?parent WHERE {\n\
                GRAPH <' + dsUri + '> {\n\
                    ?subject <' + property + '> ?object.\n\
                    ?subject rdf:type ?parent . \n\
                }\n\
            }\n';
        });
    }).then(function(parentResultsArray) {
        console.dir("parentResultsArray");
        printDeep(parentResultsArray);
        propertyParents = parentResultsArray.map(function(parentResults) {
            return _.map(parentResults, function(parentResult) {
                return parentResult.parent.value;
            });
        });

        return properties.map(function(property, i) {
            return {
                property: property,
                label: propertyLabels[i],
                datatypes: propertyDatatypes[i],
                parentClasses: propertyParents[i]
            };
        });
    });
}
function simplifyURI(uri) {
    var splits = ('' + uri).split(/[#/:]/);
    return splits[splits.length - 1];
}

// Print whole object tree
function printDeep(object) {
    console.log(JSON.stringify(object, null, 1));
}

exports.preconfigure = preconfigure;