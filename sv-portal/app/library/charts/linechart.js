google.load('visualization', '1', {packages: ['corechart']});

var linechart = function() {

    var structureOptionsCSV = {
        axis: {label: "Axes", template: 'box', options: {
                xAxis: {label: "Horizontal axis", template: 'dimension'},
                yAxis: {label: "Vertical axis", template: 'multidimension'}
            }
        }
    };

    var structureOptionsRDF = {
        axis: {label: "Axes", template: 'tabgroup', options: {
                xAxis: {label: "Horizontal axis", template: 'dimension'},
                yAxis: {label: "Vertical axis", template: 'multidimensionGrouped'}
            }
        }
    };

    var tuningOptions = {
        title: {label: "Title", template: 'textField'},
        lineStyle: {label: "Line style", template: 'selectField',
            values: [{label: "Straight", id: "straight"}, {label: "Curved", id: "curved"}],
            defaults: {id: "straight"}
        },
        axis: {label: "Axes", template: 'box', options: {
                vLabel: {label: "Label (V)", template: 'textField'},
                hLabel: {label: "Label (H)", template: 'textField'},
                grid: {label: "Grid", template: 'textField'},
                scale: {label: "Scale", template: 'selectField',
                    values: [{label: "Linear", id: "linear"}, {label: "Logarithmic", id: "logarithmic"}],
                    defaults: {id: "linear"}
                }
            }
        },
        color: {label: "Line colors", template: 'box', options: {
                yAxisColors: {template: 'multiAxisColors', axis: 'yAxis'} // TODO
            }
        }
    };

    var chart = null;
    var data = null;

    function initialize(input, divId) {
        // Create and populate the data table.
        data = google.visualization.arrayToDataTable(input);
        console.log('INITIALIZE');
        console.dir(input);
        chart = new google.visualization.LineChart(document.getElementById(divId));
    }

    function draw(config) {
        // Create and draw the skeleton of the visualization.
        var view = new google.visualization.DataView(data);
        var columns = [config.axis.xAxis.id];
        console.log('DRAW - config.axis.xAxis.id' + config.axis.xAxis.id);
        var yAxes = config.axis.yAxis.multiAxis;
        console.dir(yAxes);

        for (var i = 0; i < yAxes.length; i++) {
            console.log('yAxis: ' + yAxes[i].id);
            columns.push(yAxes[i].id);
        }

        view.setColumns(columns);

        chart.draw(view, {
            curveType: "none",
            width: 600, height: 400
        });
    }

    function drawRDF() {
        chart.draw(data, {
            curveType: "none",
            width: 600, height: 400
        });
    }

    function tune(config) {
        // Tune the visualization.
        chart.draw(data, {
            title: config.title,
            curveType: (config.lineStyle.id === 'curved') ?"function" : "none",
            width: 600, height: 400,
            vAxis: {title: config.axis.vLabel,
                logScale: (config.axis.scale.id === 'logarithmic') ? true : false,
                gridlines: {
                    count: config.axis.grid
                }
            },
            hAxis: {title: config.axis.hLabel}
        });
    }

    return {
        structureOptionsCSV: structureOptionsCSV,
        structureOptionsRDF: structureOptionsRDF,
        tuningOptions: tuningOptions,
        initialize: initialize,
        draw: draw,
        drawRDF: drawRDF,
        tune: tune
    };
}();