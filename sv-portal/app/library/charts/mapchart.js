google.load('visualization', '1', {packages: ['corechart']});

var mapchart = function() { // bubble chart module (js module pattern)

    var structureOptions = {
        axis: {label: "Axes", template: 'box', options: {
                region: {label: "Region", template: 'dimension'},
                value: {label: "Value", template: 'dimension'}
            }
        }
    };

    var tuningOptions = {
        title: {label: "Chart title", template: 'textField'}
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
        var columns = [config.region.id, config.value.id]
        view.setColumns(columns);

        chart.draw(view, {
            title: config.title,
            width: 600,
            height: 400
        });
    }

    function tune(config) {
        // Tune the visualization.
        chart.draw(data, {
            title: config.title,
            width: 600,
            height: 400,
        });
    }

    return {
        structureOptions: structureOptions,
        tuningOptions: tuningOptions,
        initialize: initialize,
        draw: draw,
        tune: tune
    };
}();