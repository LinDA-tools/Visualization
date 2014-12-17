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
                        label: "Drag & drop a ordinal value",
                        value: [],
                        type:"dimension",
                        metadata: {
                            types: ["dates or ", "other continuous values"]
                        }
                    },
                    yAxis: {
                        label: "Drag & drop a measure",
                        value: [],
                        type:"dimension",
                        metadata: {
                            types: ["number"]
                        }
                    },
                    addedSeries: {
                        label: "Drag & drop additional series",
                        value: [],
                        type:"dimension",
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
            }, {
                id: 282534,
                name: "Column Chart",
                thumbnail: "http://" + host + "/thumbnails/column_chart.png",
                structureOptions: {
                    xAxis: {
                        label: "Drag & drop categories",
                        value: [],
                        type:"dimension",
                        metadata: {
                            types: ["string"]
                        }
                    }, yAxis: {
                        label: "Drag & drop a measure",
                        value: [],
                        type:"dimension",
                        metadata: {
                            types: ["number"]
                        }
                    }, group: {
                        label: "Group by",
                        value: [],
                        type:"dimension",
                        metadata: {
                            types: ["any"]
                        }
                    }, stackedGroup: {
                        label: "Build stacked groups by",
                        value: [],
                        type:"dimension",
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
                        type:"dimension",
                        metadata: {
                            types: ["number, ", "string or ", "date"]
                        }
                    },
                    lat: {
                        label: "Latitude",
                        value: [],
                        type:"dimension",
                        metadata: {
                            types: ["number"]
                        }
                    },
                    long: {
                        label: "Longitude",
                        value: [],
                        type:"dimension",
                        metadata: {
                            types: ["number"]
                        }
                    },
                    indicator: {
                        label: "Indicator",
                        value: [],
                        type:"dimension",
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
                        label: "Drag & drop measure",
                        value: [],
                        type:"dimension",
                        metadata: {
                            types: ["number"]
                        }
                    },
                    slice: {
                        label: "Drag & drop series",
                        value: [],
                        type:"dimension",
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
                        type:"dimension",
                        metadata: {
                            types: ["string"]
                        }
                    },
                    xAxis: {
                        label: "Horizontal Axis",
                        value: [],
                        type:"dimension",
                        metadata: {
                            types: ["number"]
                        }
                    },
                    yAxis: {
                        label: "Vertical Axis",
                        value: [],
                        type:"dimension",
                        metadata: {
                            types: ["number"]
                        }
                    },
                    color: {
                        label: "Color",
                        value: [],
                        type:"dimension",
                        metadata: {
                            types: ["string"]
                        }
                    },
                    radius: {
                        label: "Radius",
                        value: [],
                        type:"dimension",
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
                        label: "Drag & drop a ordinal value",
                        value: [],
                        type:"dimension",
                        metadata: {
                            types: ["dates or ", "other continuous values"]
                        }
                    },
                    yAxis: {
                        label: "Drag & drop a measure",
                        value: [],
                        type:"dimension",
                        metadata: {
                            types: ["number"]
                        }                    
                    },
                    addedSeries: {
                        label: "Drag & drop additional series",
                        value: [],
                        type:"dimension",
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
                        type:"dimension",
                        metadata: {
                            types: ["number"]
                        }
                    },
                    xAxis: {
                        label: "Horizontal Axis",
                        value: [],
                        type:"dimension",
                        metadata: {
                            types: ["number, ", "string or ", "date"]
                        }
                    },
                    group: {
                        label: "Groups",
                        value: [],
                        type:"dimension",
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

app.put('/visualizations/:id', function(req, res) {
    var id = req.param("id");
    console.log('VISUALIZATION MODEL');
    console.dir(req.body);
    //res.send('hello world');
});

http.createServer(app).listen(3002, function() {
    console.log("visualisation_backend: Express server listening on port 3002");
});

process.on('uncaughtException', printError);