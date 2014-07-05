google.load('visualization', '1', {packages: ['geochart']});

var mapchart = function() { 

    var structureOptions = [
        {name: 'xAxis', template: 'dimension'},
        {name: 'yAxis', template: 'multidimension'},
        {name: 'title', template: 'textField'}
    ];

    var tuningOptions = [
        {name: 'title', template: 'textField'},
        {name: 'vAxisTitle', template: 'textField'},
        {name: 'hAxisTitle', template: 'textField'}
    ];

    var chart = null;
    var data = null;

    function initialize(input,divId) {
        // Create and populate the data table.
        data = google.visualization.arrayToDataTable(input);
        chart = new google.visualization.GeoChart(document.getElementById(divId));
    }

    function draw(config) {     
        chart.draw(data, options);
    }

    function tune(config) {
        // Tune the visualization.
        chart.draw(data, options);
    }

    return {
        structureOptions: structureOptions,
        tuningOptions: tuningOptions,
        initialize: initialize,
        draw: draw,
        tune: tune
    };
}();