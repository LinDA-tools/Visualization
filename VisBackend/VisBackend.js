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

    var resSuggestion = [];

    var query = dsm.findById(req.param("datasource_id"));

    query.select('graph endpoint');

    query.exec(function(err, res) {

        if (err) {
            console.log('VisBackend: Could not retrieve ds graph and endpoint uri:' + err);
            return;
        }

        console.log('VisBackend: ds graph %s and endpoint %s', res.graph, res.endpoint);

        // extract metadata of data source
        var resUri = lodstats.extract(res.graph, res.endpoint);

        // suggest vis. tools for data source
        resSuggestion = se.suggest(resUri.graph);
    });

    var tm = modules.ToolModel;

    // Iterate over suggested tool list and extract JSON objects (tool model instances)
    // Send the collection of tool model instances to the client
    tm.find({}).where('_id').in(resSuggestion).exec(function(err, tool) {
        if (err) {
            console.log('VisBackend: Could not retrieve tools: ' + err);
            return;
        }
        res.send(tool);
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
