var http = require('http');
var GraphStoreClient = require('graph-store-client');
var express = require('express');
var store_visualization = require('./visualization_modules/store_visualization_config.js');
var query_visualization = require('./visualization_modules/query_visualization_config.js');
var query_patterns = require('./visualization_modules/query_visualization_patterns.js');
var query_visualizations = require('./visualization_modules/query_visualizations.js');

var Q = require('q');
Q.longStackSupport = true;

var printError = function(error) {
    console.error("ERROR: " + error.stack);
    res.status(500).send({error: 'Internal error'});
};

//CORS middleware
var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');

    next();
};

// Web Server
var app = express();

app.configure(function() {
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(allowCrossDomain);
    app.use('/thumbnails', express.static(__dirname + '/thumbnails'));
    app.use('/testsets', express.static(__dirname + '/testsets'));
});

app.get('/sparql-proxy/:endpoint/:query', function(req, res) {
    var query = req.param("query");
    var endpoint = req.param("endpoint");
    var client = new GraphStoreClient(endpoint, null);

    client.query(query).then(function(result, err) {
        if (err) {
            console.log('visualization_backend: Could not execute query: ' + err);
            return;
        }
        console.log("SPARQL_RESULT");
        console.dir(result);

        res.send(result);
    }, printError);
});

//visualization configuration
app.put('/visualizations/:id', function(req, res) {
    var vis_config = req.body;
    var config_id = 123;//req.param("id");
    var config_name = "";
    var config_graph = "http://www.linda-project.org/visualization-configuration";
    var endpoint = "http://localhost:8890/sparql";
    var ontology_graph = "http://linda-project.eu/linda-visualization";

    // store_visualization.store(vis_config, config_id, config_name, config_graph);

    // query_visualization.query(config_id, config_graph, endpoint);

    // query_patterns.query(ontology_graph, endpoint);

    query_visualizations.query(ontology_graph, endpoint);

    //console.log('VISUALIZATION CONFIGURATION FE');
    //console.log(JSON.stringify(req.body));

    //res.send('hello world');
});

http.createServer(app).listen(3002, function() {
    console.log("visualisation_backend: Express server listening on port 3002");
});

process.on('uncaughtException', printError);