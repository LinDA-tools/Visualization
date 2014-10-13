var http = require('http');
var dataset_management = require('./dataset_management');
var GraphStoreClient = require('graph-store-client');
var express = require('express');

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

app.get('/datasources', function(req, res) {
    console.log('app.get /datasources');

    dataset_management.retrieveMetadata().then(function(metadata, err) {
        if (err) {
            console.log('visualization_backend: Could not retrieve metadata about data sources: ' + err);
            return;
        }
        res.send(metadata);
    }, printError);
});

app.get('/suggest/:datasource_id', function(req, res) {
    var datasource_id = req.param("datasource_id");

    console.log('/suggest/:datasource_id: ');
    console.dir(req.param("datasource_id"));

    rec_engine.suggest(datasource_id).then(function(tools, err) {
        if (err) {
            console.log('visualization_backend: Could not retrieve visualizations: ' + err);
            return;
        }
        res.send(tools);
    }, printError);
});

app.get('/preconfigure/:dataset_id/:visualization_id', function(req, res) {
    var dataset_id = req.param("dataset_id");
    var visualization_id = req.param("visualization_id");

    console.log('/preconfigure/:dataset_id/:visualization.id ');
    console.dir(req.param("dataset_id"));
    console.dir(req.param("visualization_id"));

    preconfig_engine.preconfigure(dataset_id, visualization_id).then(function(preconfig, err) {
        if (err) {
            console.log('visualization_backend: Could not retrieve preconfiguration: ' + err);
            return;
        }
        res.send(preconfig);
    }, printError);
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

http.createServer(app).listen(3002, function() {
    console.log("visualisation_backend: Express server listening on port 3002");
});

process.on('uncaughtException', printError);