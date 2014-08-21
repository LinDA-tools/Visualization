var http = require('http');
var rec_engine = require('./recommendation_engine');
var GraphStoreClient = require('graph-store-client'); 
var modules = require('./metadata_module');
var express = require('express');
var restify = require('express-restify-mongoose');

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
    app.use('/thumbnails', express.static(__dirname+'/thumbnails')); 
    app.use('/testsets', express.static(__dirname+'/testsets')); 
    restify.serve(app, modules.DatasourceModel, {prefix: '', version: '', plural: true, lowercase: true});
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
    });
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
     });   
});

http.createServer(app).listen(3001, function() {
    console.log("visualisation_backend: Express server listening on port 3001");
});

