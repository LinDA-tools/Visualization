// MONGOOSE with  express-restify-mongoose
var http = require('http');
var se = require('./SuggestionEngine');
var lodstats = require('./Lodstats');
var modules = require('./Modules');
var express = require('express');
var restify = require('express-restify-mongoose')

//CORS middleware
var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');

    next();
}

var dsm = modules.DatasourceModel;
var app = express();

app.configure(function() {
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(allowCrossDomain);
    restify.serve(app, dsm, {prefix: '', version: '', plural: true, lowercase: true});
});

app.get('/suggest/:datasource_id', function(req, res) {
    console.log('/suggest/:datasource_id: ');
    console.dir(req.param("datasource_id"));
    var datasource_id = req.param("datasource_id");
   
    var query = dsm.findById(datasource_id);
    query.select('lodstats');
    query.exec().then(function(datasource, err) {
        if (err) {
            console.log('VisBackend: Could not retrieve ds graph and endpoint uri:' + err);
            return;
        }

        console.log('VisBackend: DS:');
        var lodstatsUri = datasource.lodstats;
        console.dir(datasource);
        console.dir(datasource["lodstats"]);
        

        // graph uri of each vocabulary
        var query = modules.VocabularyModel.find();
        query.select('graph');
        return query.exec().then(function(vocabulary, err) {
            if (err) {
                console.log('VisBackend: could not retrieve vocabulary graphs: ' + err);
                return;
            }
            // suggest vis. tools for data source
            return se.suggest(lodstatsUri, vocabulary);
        });
    }).then(function(tools, err) {
        if (err) {
            console.log('SE: Could not retrieve classes and properties from data source or vocabularies: ' + err);
            return;
        }
        res.send(tools);
    });
});

app.get('/bind/:datasource_id/:tool_id', function(req, res) {
    var datasource_id = req.param("datasource_id");
    var tool_id = req.param("tool_id");
    
    console.log('/bind/:datasource_id/:tool_id');
    console.dir(datasource_id);
    console.dir(tool_id);

    var tm = modules.ToolModel;
    var dm = modules.DatasourceModel;

    tm.findById(tool_id ).exec().then(function(tool, err) {
        if (err) {
            console.log('VisBackend: Could not retrieve tool uri: ' + err);
            return;
        }
        var tool_uri= tool.tooluri;
        console.log("QUERY T");
        console.dir(tool_uri);

        dm.findById(datasource_id).exec().then(function(ds, err) {
            if (err) {
                console.log('VisBackend: Could not retrieve datasource uri: ' + err);
                return;
            }
        var ds_graph = ds.graph;
        var result = {uri: tool_uri.concat(encodeURIComponent(ds_graph))};

        console.log("QUERY D");
        console.dir(ds_graph);
        console.dir(result);
        
        res.send(result);
        
        });
     });
});

http.createServer(app).listen(3000, function() {
    console.log("VisBackend: Express server listening on port 3000");
});

http.createServer(function(req, res) {
    res.writeHead(200, {
        'Content-Type': 'text/plain; charset=UTF-8'
    });


}).listen(9080, "");
