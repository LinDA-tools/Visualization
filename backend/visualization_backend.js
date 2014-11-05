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

app.get('/datasources/:ds_id', function(req, res) {
    var ds_id = req.param("ds_id");
    console.log('app.get /datasources ' + ds_id);
    dataset_management.retrieveMetadata().then(function(metadata, err) {
        if (err) {
            console.log('visualization_backend: Could not retrieve metadata about data sources: ' + err);
            return;
        }
        for (var i = 0; i < metadata.datasource.length; i++) {
            var ds = metadata.datasource[i];
            if (ds.id === ds_id) {
                var result = {
                    datasource: ds
                };
                res.send(result);
            }
        }
    }, printError);
});

var sampleSelection = {
    id: "SampleSelection",
    datasource: "http://linda-project.eu/datasets#r4077e6b47fa4ced5ffe0873",
    selectedClass: {
        id: 1234,
        uri: "http://purl.org/linked-data/cube#Observation",
        label: "Observation",
        datasource: "http://linda-project.eu/datasets#r4077e6b47fa4ced5ffe0873"
    },
    propertypaths: [
        [{id: 35243, uri: "http://purl.org/linked-data/sdmx/2009/dimension#refArea", label: "Reference Area"}],
        [{id: 6345, uri: "http://purl.org/linked-data/sdmx/2009/dimension#refPeriod", label: "Reference Period"}],
        [{id: 42247, uri: "http://purl.org/linked-data/sdmx/2009/measure#obsValue", label: "Observation"}]
    ]
};

app.post('/dataselections', function(req, res) {
    console.log('app.post /dataselections');
    res.send({
        dataselection: [
            sampleSelection
        ]
    });
});

app.get('/dataselections/:selection_id', function(req, res) {
    console.log('app.post /dataselection');
    res.send({
        dataselection: sampleSelection
    });
});

app.get('/visualizations', function(req, res) {
    var dataselection_id = req.query.dataselection_id;

    console.log('/visualizations/:dataselection_id: ');
    console.dir(dataselection_id);

    res.send({
        visualization: [{
                id: 5345342,
                name: "Line Chart",
                thumbnail: "http://localhost:3002/thumbnails/line_chart.png",
                structureOptions: {
                    dimensions: {
                        xAxis: {
                            label: "Horizontal Axis",
                            value: [
                                {
                                    parent: ["http://purl.org/linked-data/cube#Observation"],
                                    id: "http://purl.org/linked-data/sdmx/2009/dimension#refPeriod",
                                    label: "Reference Period",
                                    type: "date"
                                }
                            ],
                            metadata: {
                                types: ["date", "number"]
                            }
                        },
                        yAxis: {
                            label: "Vertical Axis",
                            value: [
                                {
                                    parent: ["http://purl.org/linked-data/cube#Observation"],
                                    id: "http://purl.org/linked-data/sdmx/2009/measure#obsValue",
                                    label: "Observation",
                                    type: "date"
                                }
                            ],
                            metadata: {
                                types: ["date", "number", "string"]
                            }
                        },
                        group: {
                            label: "Groups (optional)",
                            value: [
                                {
                                    parent: ["http://purl.org/linked-data/cube#Observation"],
                                    id: "http://purl.org/linked-data/sdmx/2009/dimension#refArea",
                                    label: "Reference Area",
                                    type: "date"
                                }
                            ],
                            metadata: {
                                types: ["date", "number", "string"]
                            }
                        }
                    }
                },
                tuningOptions: {
                    width: 500,
                    height: 500,
                    background_color: "#ffffff",
                    style: ["#001122", "#ff0000", "#0123ff"],
                    axis: {
                        hLabel: "HorizontalLabelName",
                        vLabel: "VerticalLabelName",
                        numGridlinesHor: 3,
                        numGridlinesVer: 5,
                        ticks: 10
                    }
                },
                dataselection: sampleSelection.id
            }, {
                id: 352564,
                name: "Bar Chart",
                thumbnail: "http://localhost:3002/thumbnails/bar_chart.png",
                structureOptions: {
                    dimensions: {
                        xAxis: {
                            values: [{
                                    "URI1": "Reference Period"
                                }],
                            metadata: ["number"]
                        },
                        yAxis: {
                            values: [{
                                    "URI1": "Reference Area"
                                }, {
                                    "URI2": "Observed value"
                                }],
                            metadata: ["number", "string", "date"]
                        }
                    }
                },
                tuningOptions: {
                    width: 500,
                    height: 500,
                    background_color: "#ffffff",
                    style: ["#001122", "#ff0000", "#0123ff"],
                    axis: {
                        hLabel: "HorizontalLabelName",
                        vLabel: "VerticalLabelName",
                        numGridlinesHor: 3,
                        numGridlinesVer: 5,
                        widthPx: 100,
                        widthRatio: 0.5 //it's possible to choose one width parameter
                    }
                },
                dataselection: sampleSelection.id
            }
        ]
    });



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