google.load('visualization', '1', {packages: ['corechart']});

var columnchart = function() { // columnchart module (js module pattern)
    var structureOptions = [
        {name: 'title', template: 'textField'},
    ];
    
    var tuningOptions = [
        {name: 'title', template: 'textField'},
        {name: 'vAxisTitle', template: 'textField'},
        {name: 'hAxisTitle', template: 'textField'}
    ];

    function draw(input, config) {
        // Create and populate the data table.
        var data = google.visualization.arrayToDataTable(input);

        // Create and draw the visualization.
        new google.visualization.ColumnChart(document.getElementById('visualization')).
                draw(data,
                        {title: config["title"],
                            width: 600, height: 400 }
                );
    };
    
    function tune(input, config) {
        // Create and populate the data table.
        var data = google.visualization.arrayToDataTable(input);

        // Create and draw the visualization.
        new google.visualization.ColumnChart(document.getElementById('visualization')).
                draw(data,
                        {title: config["title"],
                            width: 600, height: 400,
                            hAxis: {title: config["hAxisTitle"]},
                            vAxis: {title: config["vAxisTitle"]}}
                );
    };

    return {
        structureOptions: structureOptions,
        tuningOptions: tuningOptions,
        draw: draw,
        tune:tune
    };
}();
