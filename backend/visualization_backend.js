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

app.get('/visualizations', function(req, res) {
    var ds_name = decodeURIComponent(req.query.name);
    var ds_location = decodeURIComponent(req.query.location);
    var ds_graph = decodeURIComponent(req.query.graph); // if rdf data source
    var ds_format = req.query.format;
	var host = req.headers.host;

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
        visualization: [
            {
                id: 5345342,
                name: "Line Chart",
                thumbnail: "http://" + host + "/thumbnails/line_chart.png",
                structureOptions: {
                    xAxis: {
                        label: "Horizontal Axis",
                        id: "xAxis",
                        value: [],
                        type: "dimension",
                        metadata: {
                            types: ["date"]
                        }
                    },
                    yAxis: {
                        label: "Vertical Axis",
                        id: "yAxis",
                        value: [],
                        type: "dimension",
                        metadata: {
                            types: ["number"]
                        }
                    },
                    addedSeries: {
                        label: "Series",
                        id: "addedSeries",
                        value: [],
                        type: "dimension",
                        metadata: {
                            types: [""]
                        }
                    }
                },
                layoutOptions: {
                    hLabel: {
                        label: "Horizontal Label",
                        id: 'hLabel',
                        value: "",
                        type: "string"
                    }, vLabel: {
                        label: "Vertical Label",
                        id: 'vLabel',
                        value: "",
                        type: "string"
                    }, ticks: {
                        label: "Ticks",
                        id: 'ticks',
                        value: 10,
                        type: "number"
                    }, tooltip: {
                        label: "Show Tooltip",
                        id: 'tooltip',
                        value: false,
                        type: "boolean"
                    }, gridlines: {
                        label: "Gridlines",
                        id: 'gridlines',
                        value: true,
                        type: "boolean"
                    }

                },
                datasource: ds_model
            }, {
                id: 282534,
                name: "Column Chart",
                thumbnail: "http://" + host + "/thumbnails/column_chart.png",
                structureOptions: {
                    xAxis: {
                        label: "Horizontal Axis",
                        value: [],
                        type: "dimension",
                        metadata: {
                            types: ["categorical data"]
                        }
                    }, yAxis: {
                        label: "Vertical Axis",
                        value: [],
                        type: "dimension",
                        metadata: {
                            types: ["measures (numbers)"]
                        }
                    }, group: {
                        label: "Group by",
                        value: [],
                        type: "dimension",
                        metadata: {
                            types: ["any"]
                        }
                    }, stackedGroup: {
                        label: "Stacked groups",
                        value: [],
                        type: "dimension",
                        metadata: {
                            types: ["any"]
                        }
                    }

                },
                layoutOptions: {
                    hLabel: {
                        label: "Horizontal Label",
                        value: "",
                        type: "string"
                    }, vLabel: {
                        label: "Vertical Label",
                        value: "",
                        type: "string"
                    }, widthRatio: {
                        label: "Bar Width",
                        value: 0.5,
                        type: "number"
                    }, gridlines: {
                        label: "Show Gridlines",
                        value: true,
                        type: "boolean"
                    }, tooltip: {
                        label: "Show Tooltip",
                        value: false,
                        type: "boolean"
                    }, horizontal: {
                        label: "Draw horizontally",
                        value: false,
                        type: "boolean"
                    }
                },
                datasource: ds_model
            }, {
                id: 34223494,
                name: "Map",
                thumbnail: "http://" + host + "/thumbnails/map.png",
                structureOptions: {
                    label: {
                        label: "Label",
                        value: [],
                        type: "dimension",
                        metadata: {
                            types: [""]
                        }
                    },
                    lat: {
                        label: "Latitude",
                        value: [],
                        type: "dimension",
                        metadata: {
                            types: ["number"]
                        }
                    },
                    long: {
                        label: "Longitude",
                        value: [],
                        type: "dimension",
                        metadata: {
                            types: ["number"]
                        }
                    },
                    indicator: {
                        label: "Indicator",
                        value: [],
                        type: "dimension",
                        metadata: {
                            types: ["number"]
                        }
                    }
                },
                layoutOptions: {
                },
                datasource: ds_model
            },
            {
                id: 351574,
                name: "Pie Chart",
                thumbnail: "http://" + host + "/thumbnails/pie_chart.png",
                structureOptions: {
                    measure: {
                        label: "Measure",
                        value: [],
                        type: "dimension",
                        metadata: {
                            types: ["number"]
                        }
                    },
                    slice: {
                        label: "Slice",
                        value: [],
                        type: "dimension",
                        metadata: {
                            types: ["any"]
                        }
                    }
                },
                layoutOptions: {
                    tooltip: {
                        label: "Show Tooltip",
                        value: false,
                        type: "boolean"
                    }
                },
                datasource: ds_model
            },
            {
                id: 3144372,
                name: "Bubble Chart",
                thumbnail: "http://" + host + "/thumbnails/bubble_chart.png",
                structureOptions: {
                    label: {
                        label: "Label",
                        value: [],
                        type: "dimension",
                        metadata: {
                            types: ["string"]
                        }
                    },
                    xAxis: {
                        label: "Horizontal Axis",
                        value: [],
                        type: "dimension",
                        metadata: {
                            types: ["number"]
                        }
                    },
                    yAxis: {
                        label: "Vertical Axis",
                        value: [],
                        type: "dimension",
                        metadata: {
                            types: ["number"]
                        }
                    },
                    color: {
                        label: "Color",
                        value: [],
                        type: "dimension",
                        metadata: {
                            types: ["string"]
                        }
                    },
                    radius: {
                        label: "Radius",
                        value: [],
                        type: "dimension",
                        metadata: {
                            types: ["number"]
                        }
                    }
                },
                layoutOptions: {
                    hLabel: {
                        label: "Horizontal Label",
                        value: "X Name",
                        type: "string"
                    },
                    vLabel: {
                        label: "Vertical Label",
                        value: "Y Name",
                        type: "string"
                    },
                    ticks: {
                        label: "Ticks",
                        value: 10,
                        type: "number"
                    },
                    tooltip: {
                        label: "Show Tooltip",
                        value: false,
                        type: "boolean"
                    },
                    gridlines: {
                        label: "Gridlines",
                        value: true,
                        type: "boolean"
                    }
                },
                datasource: ds_model
            }, {
                id: 386595,
                name: "Area Chart",
                thumbnail: "http://" + host + "/thumbnails/area_chart.png",
                structureOptions: {
                    xAxis: {
                        label: "Drag & drop a interval data",
                        value: [],
                        type: "dimension",
                        metadata: {
                            types: [""]
                        }
                    },
                    yAxis: {
                        label: "Drag & drop a measure",
                        value: [],
                        type: "dimension",
                        metadata: {
                            types: ["number"]
                        }
                    },
                    addedSeries: {
                        label: "Drag & drop additional series",
                        value: [],
                        type: "dimension",
                        metadata: {
                            types: ["any"]
                        }
                    }
                },
                layoutOptions: {
                    hLabel: {
                        label: "Horizontal Label",
                        value: "",
                        type: "string"
                    }, vLabel: {
                        label: "Vertical Label",
                        value: "",
                        type: "string"
                    }, ticks: {
                        label: "Ticks",
                        value: 10,
                        type: "number"
                    }, tooltip: {
                        label: "Show Tooltip",
                        value: false,
                        type: "boolean"
                    }, gridlines: {
                        label: "Gridlines",
                        value: true,
                        type: "boolean"
                    }
                },
                datasource: ds_model
            },
            {
                id: 382774,
                name: "Scatter Chart",
                thumbnail: "http://" + host + "/thumbnails/scatter_chart.png",
                structureOptions: {
                    yAxis: {
                        label: "Vertical Axis",
                        value: [],
                        type: "dimension",
                        metadata: {
                            types: ["number"]
                        }
                    },
                    xAxis: {
                        label: "Horizontal Axis",
                        value: [],
                        type: "dimension",
                        metadata: {
                            types: ["number, ", "string or ", "date"]
                        }
                    },
                    group: {
                        label: "Groups",
                        value: [],
                        type: "dimension",
                        metadata: {
                            types: ["date, ", "number or ", "string"]
                        }
                    }
                },
                layoutOptions: {
                    hLabel: {
                        label: "Horizontal Label",
                        value: "X Name",
                        type: "string"
                    },
                    vLabel: {
                        label: "Vertical Label",
                        value: "Y Name",
                        type: "string"
                    },
                    gridlines: {
                        label: "Show Gridlines",
                        value: false,
                        type: "boolean"
                    },
                    ticks: {
                        label: "Ticks",
                        value: 5,
                        type: "number"
                    },
                    tooltip: {
                        label: "Show Tooltip",
                        value: false,
                        type: "boolean"
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