google.load('visualization', '1', {packages: ['corechart']});

var bubblechart = function() { // bubble chart module (js module pattern)

    var chart = null;
    var data = null;


    function draw(configuration, visualisationContainer) {
        console.log("### INITIALIZE VISUALISATION - BUBBLE CHART");

        $('#' + visualisationContainer).empty();

        if (!(configuration.dataModule && configuration.datasourceLocation
                && configuration.label && configuration.xAxis && configuration.yAxis
                && configuration.color && configuration.radius)) {
            console.log("Missing Data")
            return;
        }
        if (configuration.label.length <= 0 || configuration.xAxis.length <= 0 || configuration.yAxis.length <= 0) {
            console.log("Missing Data")
            return;
        }

        var dataModule = configuration.dataModule;
        var location = configuration.datasourceLocation;

        var dimensions = [];
        var multidimensions = [configuration.label[0], configuration.xAxis[0], configuration.yAxis[0]]
        if (configuration.color.length > 0) {
            multidimensions.push(configuration.color[0]);
        }
        if (configuration.radius.length > 0) {
            multidimensions.push(configuration.radius[0]);
        }

        var selection = {
            dimension: dimensions,
            multidimension: multidimensions,
            group: []
        };

        dataModule.parse(location, selection).then(function(input) {

            data = google.visualization.arrayToDataTable(input);
            
            console.log("Data:");
            console.dir(data);
            
            chart = new google.visualization.BubbleChart(document.getElementById(visualisationContainer));

            chart.draw(data,
                    {title: configuration.title,
                        width: 600, height: 400}
            );
        });
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
        draw: draw,
        tune: tune
    };
}();