google.load('visualization', '1', {packages: ['corechart']});

var barchart = function() {

    var structureOptions = {
        xAxis: {label: "X Axis", template: 'dimension'},
        yAxis: {label: "Y Axes", template: 'multidimension'}
    };

    var tuningOptions = {
        title: {label: "Title", template: 'textField'},
        
        style: {label: "Style", template: 'selectField', 
            values: [{label: "Normal", id: "normal"}, {label: "Stacked", id: "stacked"}]
        },

        axis: {label: "Axes", template: 'box', options: {
                vLabel: {label: "Label (V)", template: 'textField'},
                hLabel: {label: "Label (H)", template: 'textField'},
                grid: {label: "Grid", template: 'textField'},
                scale: {label: "Scale", template: 'selectField', 
                    values: [{label: "Linear", id: "linear"}, {label: "Logarithmic", id: "logarithmic"}],
                    defaults:{id:"linear"}
                }
            }
        }, 
        color: {label: "Horizontal axes colors", template: 'box', options: {
                yAxisColors: {template: 'multiAxisColors', axis: 'yAxis'} // TODO
            }
        }
    };

    var chart = null;
    var data = null;

    function initialize(input, divId) {
        // Create and populate the data table.
        data = google.visualization.arrayToDataTable(input);
        chart = new google.visualization.BarChart(document.getElementById(divId));
    }

    function draw(config) {
        // Create and draw the skeleton of the visualization.
        var view = new google.visualization.DataView(data);
        var columns = [config.xAxis.id];
        var yAxes = config.yAxis;
        for (var i = 0; i < yAxes.length; i++) {
            columns.push(yAxes[i].id);
        }
        view.setColumns(columns);

        chart.draw(view,
                {title: config.title,
                    width: 600, height: 400}
        );
    }

    function tune(config) {
        // Tune the visualization.
        chart.draw(data,
                {title: config.title,
                    width: 600, height: 400,
                    vAxis: {title: config.axis.vLabel},
                    hAxis: {title: config.axis.hLabel,
                        logScale: (config.axis.scale.id === 'logarithmic') ? true : false,
                        gridlines: {
                            count: config.axis.grid
                        }
                    },
                    isStacked: (config.style.id === 'stacked') ? true : false,
                }
        );
    }

    return {
        structureOptions: structureOptions,
        tuningOptions: tuningOptions,
        initialize: initialize,
        draw: draw,
        tune: tune
    };
}();