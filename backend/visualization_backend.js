var http = require('http');
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

app.get('/visualizations', function(req, res) {
    var ds_name = decodeURIComponent(req.query.name);
    var ds_location = decodeURIComponent(req.query.location);
    var ds_graph = decodeURIComponent(req.query.graph); // if rdf data source
    var ds_format = req.query.format;

    console.log('VISUALIZATION BACKEND: Retrieving recommendations for data source: ' + ds_name + ' ' + ds_location + ' ' + ds_format);

    var ds_model = null;

    if (ds_format === 'rdf') {
        ds_model = {
            name: ds_name,
            location: {endpoint: ds_location, graph: ds_graph},
            format: 'rdf'
        };

    } else if (ds_format === 'csv') {
        ds_model = {
            name: ds_name,
            location: ds_location,
            format: 'csv'
        };
    } else {
        console.error("Unknown datasource format: " + ds_format);
        return;
    }

    var recommendation_mock = {
        visualization: [{
                id: 5345342,
                name: "Line Chart",
                thumbnail: "http://localhost:3002/thumbnails/line_chart.png",
                structureOptions: {
                    dimensions: {
                        xAxis: {
                            label: "Horizontal Axis",
                            value: [],
                            metadata: {
                                types: ["date", "number"]
                            }
                        },
                        yAxis: {
                            label: "Vertical Axis",
                            value: [],
                            metadata: {
                                types: ["number"]
                            }
                        },
                        group: {
                            label: "Groups (optional)",
                            value: [],
                            metadata: {
                                types: ["date", "number", "string"]
                            }
                        }
                    }
                },
                layoutOptions: {
                    width: {
                        label: "Width",
                        value: 500
                    },
                    height: {
                        label: "Height",
                        value: 500
                    },
                    axis: {
                        hLabel: {
                            label: "Horizontal Label",
                            value: ""
                        },
                        vLabel: {
                            label: "Vertical Label",
                            value: ""
                        },
                        numGridlinesHor: {
                            label: "Gridlines Horizontal",
                            value: 3
                        },
                        numGridlinesVer: {
                            label: "Gridlines Vertical",
                            value: 5
                        },
                        ticks: {
                            label: "Ticks",
                            value: 10
                        }
                    }
                },
                datasource: ds_model
            }, {
                id: 351574,
                name: "Bar Chart",
                thumbnail: "http://localhost:3002/thumbnails/bar_chart.png",
                structureOptions: {
                    dimensions: {
                        xAxis: {
                            label: "Horizontal Axis",
                            values: [],
                            metadata: ["number"]
                        },
                        yAxis: {
                            label: "Vertical Axis",
                            values: [],
                            metadata: ["number", "string", "date"]
                        },
                        group: {
                            label: "Groups (optional)",
                            value: [],
                            metadata: {
                                types: ["date", "number", "string"]
                            }
                        }
                    }
                },
                layoutOptions: {
                    width: {
                        label: "Width",
                        value: 500
                    },
                    height: {
                        label: "Height",
                        value: 500
                    },
                    axis: {
                        hLabel: {
                            label: "Horizontal Label",
                            value: ""
                        },
                        vLabel: {
                            label: "Vertical Label",
                            value: ""
                        },
                        numGridlinesHor: {
                            label: "Gridlines Horizontal",
                            value: 3
                        },
                        numGridlinesVer: {
                            label: "Gridlines Vertical",
                            value: 5
                        },
                        ticks: {
                            label: "Ticks",
                            value: 10
                        }
                    }
                },
                datasource: ds_model
            }, {
                id: 382594,
                name: "Column Chart",
                thumbnail: "http://localhost:3002/thumbnails/column_chart.png",
                structureOptions: {
                    dimensions: {
                        yAxis: {
                            label: "Vertical Axis",
                            values: [],
                            metadata: ["number"]
                        },
                        xAxis: {
                            label: "Horizontal Axis",
                            values: [],
                            metadata: ["number", "string", "date"]
                        },
                        group: {
                            label: "Groups (optional)",
                            value: [],
                            metadata: {
                                types: ["date", "number", "string"]
                            }
                        }
                    }
                },
                layoutOptions: {
                    width: {
                        label: "Width",
                        value: 500
                    },
                    height: {
                        label: "Height",
                        value: 500,
                    },
                    axis: {
                        hLabel: {
                            label: "Horizontal Label",
                            value: ""
                        },
                        vLabel: {
                            label: "Vertical Label",
                            value: ""
                        },
                        numGridlinesHor: {
                            label: "Gridlines Horizontal",
                            value: 3
                        },
                        numGridlinesVer: {
                            label: "Gridlines Vertical",
                            value: 5
                        },
                        ticks: {
                            label: "Ticks",
                            value: 10
                        }
                    }
                },
                datasource: ds_model
            }
        ]
    };
    res.send(recommendation_mock);
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