google.load('visualization', '1', {packages: ['corechart']});

var barchart = function() {

    var structureOptions = {
        xAxis: {label: "X Axis", template: 'dimension'},
        yAxis: {label: "Y Axes", template: 'multidimension'}
    };

    var tuningOptions = {
        title: {label: "Title", template: 'textField'},
        vAxis: {label: "Vertical axis", template: 'box', options: {
                title: {label: "Label", template: 'textField'},
                gridLineNumber: {label: "Grid lines Number", template: 'textField'},
                gridLineColor: {label: "Grid lines Color", template: 'textField'}
            },
        },
        hAxis: {label: "Horizontal axis", template: 'box', options: {
                title: {label: "Label", template: 'textField'},
                gridLineNumber: {label: "Grid lines Number", template: 'textField'},
                gridLineColor: {label: "Grid lines Color", template: 'textField'}
            }
        },
        style: {label: "Style", template: 'textField', values: ['normal', 'stacked']}

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
                    vAxis: {title: config.vAxis.title},
                    hAxis: {title: config.hAxis.title},
                    isStacked: (config.style === 'stacked') ? true : false,
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