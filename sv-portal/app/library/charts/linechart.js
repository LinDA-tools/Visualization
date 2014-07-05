google.load('visualization', '1', {packages: ['corechart']});

var linechart = function() {

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
        chart = new google.visualization.LineChart(document.getElementById(divId));
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

        draw(data, {curveType: "function",
                  width: 500, height: 400,
                  vAxis: {maxValue: 10}}
          );
    }

    function tune(config) {
        // Tune the visualization.
        chart.draw(data,
                {title: config["title"],
                    width: 600, height: 400,
                    vAxis: {title: config["vAxisTitle"]},
                    hAxis: {title: config["hAxisTitle"]}}
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