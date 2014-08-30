var sparql_data_module = function() {

    function sparqlProxyQuery(endpoint, query) {
        console.log(query);

        var promise = Ember.$.getJSON('http://localhost:3001/sparql-proxy/' + endpoint + "/" + encodeURIComponent(query));
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
          SELECT ?class ?classLabel COUNT(?x) as ?classSize  WHERE {\n\
           ?x rdf:type ?class .\n\
           ?x ?property ?y .\n\
           OPTIONAL {\n\
            ?class rdfs:label ?classLabel .\n\
           }\n\
          }\n\
         }\n\
         GRAPH <' + graph + '> {\n\
           ?x rdf:type ?class .\n\
           ?x ?property ?y .\n\
           OPTIONAL {\n\
            ?property rdfs:label ?propertyLabel .\n\
           }\n\
         }\n\
        } ORDER BY DESC(?classSize)\n\
        \n';

        return sparqlProxyQuery(endpoint, classQuery).then(function(result) {
            var dataInfo = {};
            console.log("SPARQL-QUERY RESULT");
            console.dir(result);

            for (var i = 0; i < result.length; i++) {
                var classURI = result[i].class.value;

                console.log("class uri");
                console.dir(classURI);

                var classLabel = (result[i].classLabel || {}).value;
                if (!classLabel) {
                    classLabel = simplifyURI(classURI);
                }

                console.log("class label");
                console.dir(classLabel);

                var dataset = dataInfo[classURI];

                console.log("dataset");
                console.dir(dataset);

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
                console.log("property uri");
                console.dir(propertyURI);
                var propertyLabel = (result[i].propertyLabel || {}).value;
                console.log("property label");
                console.dir(propertyLabel);
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

    function parse(location, selection) {
        console.log("SPARQL-DATA-MODULE PARSE");

        var dimension = selection.dimension;
        var multidimension = selection.multidimension;
        var group = selection.group;
        var result = null;

        console.log('DIMENSION');
        console.dir(dimension);

        console.log('MULTIDIMENSION');
        console.dir(multidimension);

        console.log('GROUP');
        console.dir(group);

        if (group.length > 0) {
            //CASE 1: dimension and grouped multidimension -> 1 dim; 1 mdim; just 1 group value;
            result = query_group(location, dimension, multidimension, group);
        } else {
            //CASES 2: dimension and/or multidimension -> 1 dim; 1..n mdim; 
            var dimension_ = dimension.concat(multidimension);
            result = query(location, dimension_);
        }


        return result;
    }

    function query_group(location, dimension, multidimension, group) {
        console.log('1 DIMENSION and 1 MULTIDIMENSION and 1 GROUP VALUE');

        var graph = location.graph;
        var endpoint = encodeURIComponent(location.endpoint);
        var dimension = dimension[0];
        var multidimension = multidimension[0];
        var group = group[0];
        var class_ = multidimension.parent[0];
        var columnHeaders = [];
        var selectedVariablesArray = [];
        var optionals = "";
        var selectVariables = "";

        return group_by(endpoint, graph, group).then(function(groupInstances) {
            console.log("GROUP INSTANCES")
            console.dir(groupInstances);

            selectVariables += " ?d";
            selectedVariablesArray.push("d");
            columnHeaders.push(dimension.label);

            console.log('groupInstances');
            console.dir(groupInstances.length);

            for (var i = 0; i < groupInstances.length; i++) {
                var groupInstance = groupInstances[i];
                selectVariables += " ?z" + i;
                columnHeaders.push(groupInstance.label);
                selectedVariablesArray.push("z" + i);

                optionals += '\nOPTIONAL {\n'
                optionals += ' ?x' + i + ' rdf:type <' + class_ + '> .\n';
                optionals += ' ?x' + i + ' <' + dimension.id + '> ?d.\n'
                optionals += ' ?x' + i + ' <' + multidimension.id + '> ?z' + i + '.\n'
                optionals += ' ?x' + i + ' <' + group.id + '> <' + groupInstance.id + '>.\n'
                optionals += '}\n';
            }

            var query = '\n\
            PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>\n\
            PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>\n\
            SELECT DISTINCT ' + selectVariables + '\n\
            WHERE {\n\
                GRAPH <' + graph + '> {\n\
                    ' + optionals + '\n\
                }\n\
            }';
            return sparqlProxyQuery(endpoint, query);
        }).then(function(queryResult) {
            return convert(queryResult, columnHeaders, selectedVariablesArray);
        });

    }

    function query(location, dimensions) {
        console.log('1 DIMENSION and 1 to n MULTIDIMENSION');

        var graph = location.graph;
        var endpoint = encodeURIComponent(location.endpoint);
        var columnHeaders = [];
        var optionals = "";
        var selectVariables = "";
        var selectedVariablesArray = [];
        var class_ = dimensions[0].parent[0];

        for (var i = 0; i < dimensions.length; i++) {
            var dimension = dimensions[i]

            selectVariables += " ?z" + i;
            columnHeaders.push(dimension.label);
            selectedVariablesArray.push("z" + i);


            optionals += '\n\
                    ?x' + ' <' + dimension.id + '> ?z' + i + '.\n';

            console.log('OPTIONAL');
            console.dir(optionals);
        }

        var query = '\n\
            PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>\n\
            PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>\n\
            SELECT DISTINCT ' + selectVariables + '\n\
            WHERE {\n\
                GRAPH <' + graph + '> {\n\
                     ?x' + ' rdf:type <' + class_ + '>.\n\
                     ' + optionals + '\n\
                }\n\
            }';

        return sparqlProxyQuery(endpoint, query).then(function(queryResult) {
            return convert(queryResult, columnHeaders, selectedVariablesArray);
        });
    }

    function group_by(endpoint, graph, groupProperty) {
        var class_ = groupProperty.parent[0];

        var groupValuesQuery = '\n\
            PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>\n\
            PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>\n\
            SELECT DISTINCT ?instance WHERE {\n\
             GRAPH <' + graph + '> {\n\
              ?x rdf:type <' + class_ + '> .\n\
              ?x <' + groupProperty.id + '> ?instance .\n\
              { \n\
               SELECT ?label WHERE { \n\
                ?instance rdfs:label ?label \n\
               } LIMIT 1 \n\
              }\n\
             }\n\
            } ORDER BY ASC(?instance)';

        return sparqlProxyQuery(endpoint, groupValuesQuery).then(function(result) {
            var groupInstances = [];

            for (var i = 0; i < result.length; i++) {
                var instance = result[i].instance.value;
                var label = (result[i].label || {}).value || simplifyURI(instance);

                groupInstances.push({
                    id: instance,
                    label: label,
                    parent: [class_, groupProperty.id]
                });
            }
            return groupInstances;
        })
    }


    function convert(queryResults, columnHeaders, selectedVariablesArray) {
        console.log("SPARQL-DATA-MODULE CONVERT");
        console.log("columnHeaders");
        console.dir(columnHeaders);
        console.log("selectedVariablesArray");
        console.dir(selectedVariablesArray);

        var result = [];
        result.push(columnHeaders);
        for (var i = 0; i < queryResults.length; i++) {
            console.log(selectedVariablesArray.length);
            var queryResult = queryResults[i];
            var record = [];
            for (var j = 0; j < selectedVariablesArray.length; j++) {
                var p = selectedVariablesArray[j];
                var val = (queryResult[p] || {}).value;
                if (_.isUndefined(val)) {
                    record.push(null);
                    continue;
                }
                var value = simplifyURI(val);
                var parsedValue = parseFloat(value.replace(',', ''));
                if (_.isNaN(parsedValue) || _.isUndefined(parsedValue)) {
                    parsedValue = value;
                }
                record.push(parsedValue);
            }
            result.push(record);

            for (var property in queryResult) {
                console.log('item ' + i + ': ' + property + '=' + queryResult[property].value);
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