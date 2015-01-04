var GraphStoreClient = require('graph-store-client');
var _ = require('lodash');

function query(config_id, config_graph, config_endpoint) {
    console.log("QUERY VISUALIZATION CONFIGURATION");

    var client = new GraphStoreClient(config_endpoint, null);

    var configuration = {visualization: {structureOptions: {}, layoutOptions: {}}};

    return client.query(datasourceQuery(config_id, config_graph)).then(function(results, err) {

        console.log("SPARQL RESULT VIS DETAILS");
        console.dir(results);

        configuration['visualization']['name'] = results[0]['visualizationName']['value'];
        configuration['visualization']['thumbnail'] = results[0]['visualizationThumbnail']['value'];
        configuration['visualization']['datasource'] = {
            name: results[0]['datasourceName']['value'],
            //  location: results[0]['datasourceLocation']['value'],
            //  graph: results[0]['datasourceGraph']['value'],
            format: results[0]['datasourceFormat']['value']
        };

        return client.query(structureOptionsQuery(config_id, config_graph)).then(function(results, err) {

            console.log("SPARQL RESULT STRUCTURE OPTIONS");
            console.dir(results);

            for (var i = 0; i < results.length; i++) {
                var option = results[i];
                var value_count = 1;
                var parent = [];

                while (option['value' + value_count]) {
                    parent.push(option['value' + value_count]['value']);
                    value_count++;
                }

                var id = option['structureOptionId']['value'];

                if (configuration['visualization']['structureOptions'][id]) {
                    configuration['visualization']['structureOptions'][id]['value'].push({
                        label: option['propertyName']['value'],
                        parent: parent
                    });
                } else {
                    configuration['visualization']['structureOptions'][id] = {
                        label: option['structureOptionName']['value'],
                        id: option['structureOptionId']['value'],
                        value: [{
                                label: option['propertyName']['value'],
                                parent: parent
                            }]
                    };
                }

                configuration['visualization']['structureOptions']['type'] = "dimension";
                configuration['visualization']['structureOptions']['metadata'] = [];
            }
            return client.query(layoutOptionsQuery(config_id, config_graph)).then(function(results, err) {

                console.log("SPARQL RESULT LAYOUT OPTIONS");
                console.dir(results);

                for (var i = 0; i < results.length; i++) {
                    var option = results[i];
                    var id = option['layoutOptionId']['value'];
                    configuration['visualization']['layoutOptions'][id] = {
                        label: option['layoutOptionName']['value'],
                        id: option['layoutOptionId']['value'],
                        value: option['layoutOptionValue']['value']
                    };
                }

                console.log("VISUALIZATION CONFIGURATION");
                console.dir(JSON.stringify(configuration));

                return configuration;
            });
        });
    });


}

function datasourceQuery(config_id, config_graph) {
    var query = "";

    query += 'PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> \n';
    query += 'PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> \n';
    query += 'PREFIX xsd: <http://www.w3.org/2001/XMLSchema#> \n';
    query += 'PREFIX vis: <http://linda-project.eu/linda-visualization#> \n';
    query += 'PREFIX visconf: <http://www.linda-project.org/visualization-configuration#> \n';

    query += "SELECT  ";
    query += "?visualizationName ?visualizationThumbnail ?datasourceName ?datasourceFormat \n ";
    query += "WHERE \n";
    query += "{ \n";
    query += "GRAPH <" + config_graph + "> \n";
    query += "{ \n";
    query += "visconf:VISCONFIG-" + config_id + " vis:visualizationName ?visualizationName .\n ";
    query += "visconf:VISCONFIG-" + config_id + " vis:visualizationThumbnail ?visualizationThumbnail .\n ";
    query += "visconf:VISCONFIG-" + config_id + " vis:datasource ?datasource .\n ";
    query += "?datasource vis:datasourceName ?datasourceName .\n ";
    query += "?datasource vis:datasourceFormat ?datasourceFormat .\n ";
    /* 
     query += "?datasource vis:datasourceLocation ?datasourceLocation .\n ";
     query += "OPTIONAL ";
     query += "{ \n";
     query += "?datasource vis:datasourceGraph ?datasourceGraph .\n ";
     query += "} \n";
     */
    query += "} \n";
    query += "} \n";

    console.log("QUERY VISUALIZATION CONFIGURATION - QUERY DETAILS");
    console.log(query);

    return query;
}

function structureOptionsQuery(config_id, config_graph) {
    var query = "";

    query += 'PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> \n';
    query += 'PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> \n';
    query += 'PREFIX xsd: <http://www.w3.org/2001/XMLSchema#> \n';
    query += 'PREFIX vis: <http://linda-project.eu/linda-visualization#> \n';
    query += 'PREFIX visconf: <http://www.linda-project.org/visualization-configuration#> \n';

    query += "SELECT  ";
    query += "?structureOptionName ?structureOptionId ?propertyName ?value1 ?value2 ?value3 ?value4 ?value5 ?value6 ?value7 ?value8 ?value9 ?value10 \n ";
    query += "WHERE \n";
    query += "{ \n";
    query += "GRAPH <" + config_graph + "> \n";
    query += "{ \n";

    query += "visconf:VISCONFIG-" + config_id + " vis:structureOption ?structureOption .\n ";
    query += "?structureOption vis:optionName ?structureOptionName .\n ";
    query += "?structureOption vis:optionId ?structureOptionId .\n ";
    query += "?structureOption vis:optionValue ?structureOptionValue .\n ";
    query += "?structureOptionValue vis:propertyName ?propertyName .\n ";
    query += "?structureOptionValue vis:contents/rdf:rest{0}/rdf:first ?value1 .\n ";
    query += "OPTIONAL ";
    query += "{ \n";
    query += "?structureOptionValue vis:contents/rdf:rest{1}/rdf:first ?value2 .\n ";
    query += "OPTIONAL ";
    query += "{ \n";
    query += "?structureOptionValue vis:contents/rdf:rest{2}/rdf:first ?value3 .\n ";
    query += "OPTIONAL ";
    query += "{ \n";
    query += "?structureOptionValue vis:contents/rdf:rest{3}/rdf:first ?value4 .\n ";
    query += "OPTIONAL ";
    query += "{ \n";
    query += "?structureOptionValue vis:contents/rdf:rest{4}/rdf:first ?value5 .\n ";
    query += "OPTIONAL ";
    query += "{ \n";
    query += "?structureOptionValue vis:contents/rdf:rest{5}/rdf:first ?value6 .\n ";
    query += "OPTIONAL ";
    query += "{ \n";
    query += "?structureOptionValue vis:contents/rdf:rest{6}/rdf:first ?value7 .\n ";
    query += "OPTIONAL ";
    query += "{ \n";
    query += "?structureOptionValue vis:contents/rdf:rest{7}/rdf:first ?value8 .\n ";
    query += "OPTIONAL ";
    query += "{ \n";
    query += "?structureOptionValue vis:contents/rdf:rest{8}/rdf:first ?value9 .\n ";
    query += "OPTIONAL ";
    query += "{ \n";
    query += "?structureOptionValue vis:contents/rdf:rest{9}/rdf:first ?value10 .\n ";
    query += "} \n";
    query += "} \n";
    query += "} \n";
    query += "} \n";
    query += "} \n";
    query += "} \n";
    query += "} \n";
    query += "} \n";
    query += "} \n";

    query += "} \n";
    query += "} \n";

    console.log("LOAD VISUALIZATION CONFIGURATION - QUERY STRUCTURE OPTIONS");
    console.log(query);

    return query;
}

function layoutOptionsQuery(config_id, config_graph) {
    var query = "";

    query += 'PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> \n';
    query += 'PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> \n';
    query += 'PREFIX xsd: <http://www.w3.org/2001/XMLSchema#> \n';
    query += 'PREFIX vis: <http://linda-project.eu/linda-visualization#> \n';
    query += 'PREFIX visconf: <http://www.linda-project.org/visualization-configuration#> \n';

    query += "SELECT  ";
    query += "?layoutOptionName ?layoutOptionValue ?layoutOptionId \n ";
    query += "WHERE \n";
    query += "{ \n";
    query += "GRAPH <" + config_graph + "> \n";
    query += "{ \n";

    query += "visconf:VISCONFIG-" + config_id + " vis:layoutOption ?layoutOption .\n ";
    query += "?layoutOption vis:optionName ?layoutOptionName .\n ";
    query += "?layoutOption vis:optionId ?layoutOptionId .\n ";
    query += "?layoutOption vis:optionValue ?layoutOptionValue .\n ";

    query += "} \n";
    query += "} \n";

    console.log("QUERY VISUALIZATION CONFIGURATION - QUERY LAYOUT OPTIONS");
    console.log(query);

    return query;
}

exports.query = query;


/*for (var i = 0; i < results.length; i++) {
 var option = results[i];
 
 var visualizationName_ = option['visualizationName']['value'];
 var optionName_ = option['optionName']['value'];
 
 if (visualizations[visualizationName_]) {
 
 if (visualizations[visualizationName_][optionName_]) {
 visualizations[visualizationName_][optionName_]['scaleOfMeasurement'].push(option['scaleOfMeasurement']['value']);
 } else {
 visualizations[visualizationName_][optionName_] = {
 optionName: option['optionName']['value'],
 scalesOfMeasurement: [option['scaleOfMeasurement']['value']],
 minCardinality: option['minCardinality']['value'],
 maxCardinality: option['maxCardinality']['value']
 };
 }
 } else {
 visualizations[visualizationName_] = {
 visualizationName: visualizationName_
 };
 
 visualizations[visualizationName_][optionName_] = {
 optionName: option['optionName']['value'],
 scalesOfMeasurement: [option['scaleOfMeasurement']['value']],
 minCardinality: option['minCardinality']['value'],
 maxCardinality: option['maxCardinality']['value']
 };
 }
 }
 
 console.log("VISUALIZATIONS LIST ");
 console.dir(JSON.stringify(visualizations));*/