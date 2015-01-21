var GraphStoreClient = require('graph-store-client');
var _ = require('lodash');

function store(vis_config, config_id, config_name, config_graph, config_endpoint) {
    console.log("STORE VISUALIZATION CONFIGURATION");

    var query = "";

    query += 'PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> \n';
    query += 'PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> \n';
    query += 'PREFIX xsd: <http://www.w3.org/2001/XMLSchema#> \n';
    query += 'PREFIX vis: <http://linda-project.eu/linda-visualization#> \n';
    query += 'PREFIX visconf: <http://www.linda-project.org/visualization-configuration#> \n';

    query += "INSERT \n";
    query += "{ \n";

    query += "GRAPH <" + config_graph + "> \n";
    query += "{ \n";

    query += "visconf:VISCONFIG-" + config_id + " a vis:VisualizationConfiguration ; \n";
    query += " vis:configurationName '" + config_name + "' ; \n";
    query += " vis:visualizationName '" + vis_config['visualization']['visualizationName'] + "' ; \n";
    //query += " vis:visualizationThumbnail '" + vis_config['visualization']['visualizationThumbnail'] + "'^^xsd:anyURI ; \n";
    query += " vis:datasource ";

    query += '[ \n';
    query += "  vis:datasourceName '" + vis_config['visualization']['datasource']['name'] + "' ; \n";
    //query += "vis:datasourceLocation '" + vis_config['visualization']['datasource']['location'] + "' ; \n";
    //query += "vis:datasourceGraph '" + vis_config['visualization']['datasource']['graph'] + "' ; \n";
    query += "  vis:datasourceFormat '" + vis_config['visualization']['datasource']['format'] + "' ; \n";
    query += ' ] ; \n';
    query += " vis:structureOption ";

    var structure_options = vis_config['visualization']['structureOptions'];

    var option_count = 0;

    for (var option in structure_options) {
        option_count++;

        query += "[ \n";
        query += "  a vis:Option ; \n";
        query += "  vis:optionName '" + structure_options[option]['optionName'] + "' ; \n";
        

        query += "  vis:optionValue  ";

        var option_values = structure_options[option]['value'];

        for (var v = 0; v < option_values.length; v++) {
    
            var option_value_path = structure_options[option]['value'][v]['parent'];
            var property_name = structure_options[option]['value'][v]['label'];

            query += "[ \n";
            query += "   vis:propertyName '"+property_name+"' ; \n";
            query += "   vis:propertyId '" + structure_options[option]['value'][v]['id'] + "' ; \n";
            query += "   vis:contents ";
            query += "( ";

            for (var p = 0; p < option_value_path.length; p++) {
                query += "'" + option_value_path[p]['id'] + "' ";
            }

            query += ") \n";

            if (v === option_values.length - 1) {
                query += "  ] ; \n";
            } else {
                query += "  ] , \n";
            }
        }

        if (option_count === _.size(structure_options)) {
            query += " ] ; \n";
        } else {
            query += " ] , \n";
        }
    }

    query += " vis:layoutOption ";

    var layout_options = vis_config['visualization']['layoutOptions'];

    var option_count = 0;

    for (var option in layout_options) {
        option_count++;

        query += "[ \n";
        query += "  a vis:Option ; \n";
        query += "  vis:optionName '" + layout_options[option]['optionName'] + "' ; \n";
        //query += "  vis:optionId '" + layout_options[option]['id'] + "' ; \n";
        query += "  vis:optionValue '" + layout_options[option]['value'] + "' ; \n";

        if (option_count === _.size(layout_options)) {
            query += " ] . \n";
        } else {
            query += " ] , \n";
        }
    }

    query += "} \n";
    query += "} \n";

    console.log("STORE VISUALIZATION CONFIGURATION - INSERT QUERY");
    console.log(query);

    var client = new GraphStoreClient(config_endpoint, null);
    client.query(query).then(function(result, err) {
        if (err) {
            console.log('visualization_backend: Could not execute insert query: ' + err);
            return;
        }
        console.log("SPARQL_RESULT");
        console.dir(result);

    });
}

exports.store = store;
