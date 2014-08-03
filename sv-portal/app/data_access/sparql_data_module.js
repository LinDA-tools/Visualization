var sparql_data_module = function() {

    function sparqlProxyQuery(endpoint, query) {
        console.log(query);

        var promise = Ember.$.getJSON('http://localhost:3000/sparql-proxy/' + endpoint + "/" + encodeURIComponent(query));
        return promise.then(function(result) {
            console.log("SPARQL RESULT:");
            console.dir(result);
            return result;
        });
    }

    function simplifyURI(uri) {
        var splits = uri.split(/[#/:]/);
        return splits[splits.length - 1];
    }

    function read(location) {
        console.log("SPARQL-DATA-MODULE READ");
        var graph = location.graph;
        var endpoint = encodeURIComponent(location.endpoint);
        var classQuery = '\n\
            PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>\n\
            PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>\n\
            SELECT DISTINCT ?class ?classLabel ?property ?propertyLabel WHERE {\n\
                GRAPH <' + graph + '> {\n\
                    ?x rdf:type ?class .\n\
                    OPTIONAL {\n\
                        ?class rdfs:label ?classLabel .\n\
                    } .\n\
                    OPTIONAL {\n\
                        ?x ?property ?y .\n\
                        OPTIONAL {\n\
                            ?property rdfs:label ?propertyLabel .\n\
                        }\n\
                    }\n\
                }\n\
            }';

        return sparqlProxyQuery(endpoint, classQuery).then(function(result) {
            var dataInfo = {};

            for (var i = 0; i < result.length; i++) {
                var classURI = result[i].class.value;

                var classLabel = (result[i].classLabel || {}).value;
                if (!classLabel) {
                    classLabel = simplifyURI(classURI);
                }

                var dataset = dataInfo[classURI];
                if (!dataset) {
                    dataset = {
                        label: classLabel,
                        id: classURI,
                        properties: []
                    };

                    dataInfo[classURI] = dataset;
                }

                if (!result[i].property) {
                    continue;
                }

                var propertyURI = result[i].property.value;
                var propertyLabel = (result[i].propertyLabel || {}).value;
                if (!propertyLabel) {
                    propertyLabel = simplifyURI(propertyURI);
                }

                var entry = {
                    label: propertyLabel,
                    id: propertyURI
                }
                dataset.properties.push(entry);
            }

            console.log('DATA INFO');
            console.dir(dataInfo);
            return {dataInfo: dataInfo, location: location};
        });
        console.log("###########");
    }

    function parse(location, selectedClass, selectedProperties) {
        console.log("SPARQL-DATA-MODULE PARSE");
        console.log("SELECTED CLASS");
        console.dir(selectedClass);

        var graph = location.graph;
        var endpoint = encodeURIComponent(location.endpoint);
        var selectVariablesArray = [];

        var optionals = "";
        var selectVariables = "";
        var simplifiedDimURI = null;

        for (var i = 0; i < selectedProperties.length; i++) {
            var property = selectedProperties[i];
            console.log("SELECTED PROPERTY " + i);
            console.dir(property);
            

            simplifiedDimURI = simplifyURI(property);
            console.log("simplifiedDimURI: " + simplifiedDimURI);

            selectVariables += " ?" + simplifiedDimURI;
            selectVariablesArray.push(simplifiedDimURI);

            optionals += ' OPTIONAL {';

            optionals += '\n\
                    ?x' + i + ' rdf:type <' + selectedClass.id + '> .\n';

            optionals += '\n\
                    ?x' + i + ' <' + property + '> ?' + simplifiedDimURI + '.\n'

            optionals += '}\n';
        }

        var query = '\n\
            PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>\n\
            PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>\n\
            SELECT DISTINCT ' + selectVariables + '\n\
            WHERE {\n\
                GRAPH <' + graph + '> {\n\
                    { ' + optionals + '}\n\
                }\n\
            }';

        return sparqlProxyQuery(endpoint, query).then(function(result) {
            console.log('QUERY RESULT');
            console.dir(result);
            return result;
        }).then(function(queryResult) {
            return convert(queryResult, selectVariablesArray);
        });

    }//parse

    function convert(queryResult, selectVariablesArray) {
        console.log("SPARQL-DATA-MODULE CONVERT");

        var result = [];
        result.push(selectVariablesArray);
        for (var i = 0; i < queryResult.length; i++) {
            console.log(selectVariablesArray.length);
            var object = queryResult[i];
            var record = []
            for (var j = 0; j < selectVariablesArray.length; j++) {
                var p = selectVariablesArray[j];
                console.log('ITEM ' + j + ': ' + p + '=' + object[p].value);
                var value = object[p].value;
                var parsedValue = parseFloat(value.replace(',', ''));
                if (_.isNaN(parsedValue) || _.isUndefined(parsedValue)) {
                    parsedValue = value;
                }
                record.push(parsedValue);
            }
            result.push(record);

            for (var property in object) {
                console.log('item ' + i + ': ' + property + '=' + object[property].value);
            }
        }
        console.log("CONVERTED QUERY RESULT");
        console.dir(result);
        console.log("###########");
        return result;
    }

    return {
        read: read,
        parse: parse,
    };
}();