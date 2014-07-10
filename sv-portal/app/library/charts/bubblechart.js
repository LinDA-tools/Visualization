google.load('visualization', '1', {packages: ['corechart']});

var bubblechart = function() { // bubble chart module (js module pattern)

    var structureOptions = {
        label: {label: "Label", template: 'dimension'},
        xAxis: {label: "X Axis", template: 'dimension'},
        yAxis: {label: "Y Axis", template: 'dimension'},
        color: {label: "Gradient/category", template: 'dimension'},
        radius: {label: "Radius", template: 'dimension'}
    };

    var tuningOptions = {
        title: {label: "Chart title", template: 'textField'},
        axes: {label: "Axes", template: 'box',
            options: {
                vLabel: {label: "Title (V)", template: 'textField'},
                hLabel: {label: "Title (H)", template: 'textField'},
                vGrid: {label: "Grid (V)", template: 'textField'},
                hGrid: {label: "Grid (H)", template: 'textField'}
                /*, color: {label: "Color", template: 'textField'}*/
            }
        }
    };

    var chart = null;
    var data = null;


    function initialize(input, divId) {
        // Create and populate the data table.
        data = google.visualization.arrayToDataTable(input);
        chart = new google.visualization.BubbleChart(document.getElementById(divId));
    }

    function draw(config) {
        // Create and draw the skeleton of the visualization.
        var view = new google.visualization.DataView(data);
        var columns = [config.label.id, config.xAxis.id, config.yAxis.id, config.color.id, config.radius.id];
        view.setColumns(columns);

        chart.draw(view,
                {title: config.title,
                    width: 600, height: 400}
        );
    }

    function tune(config) {
        // Tune the visualization.
        chart.draw(data,
                {title: config["title"],
                    width: 600, height: 400,
                    vAxis: {title: config.axes.vLabel, 
                        gridlines: {
                            count: config.axes.vGrid
                        }
                    },
                    hAxis: {title: config.axes.hLabel,
                        gridlines: {
                            count: config.axes.hGrid
                        }
                    },
                    bubble: {textStyle: {fontSize: 11}}
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