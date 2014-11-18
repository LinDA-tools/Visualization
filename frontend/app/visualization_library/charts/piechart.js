var piechart = function() {
    var chart = null;
    var seriesHeaders = [];
    var series = [];

    function draw(configuration, visualisationContainer) {
        console.log("### INITIALIZE VISUALISATION - PIE CHART");
        
        $('#' + visualisationContainer).empty();

        if (!(configuration.dataModule && configuration.datasourceLocation
                && configuration.slice)) {
            return;
        }

        if (configuration.slice.length === 0) {
            return;
        }

        var dataModule = configuration.dataModule;
        var location = configuration.datasourceLocation;

        var selection = {
            dimension: [],
            multidimension: configuration.slice,
            group: [],
            tooltip: configuration.tooltip
        };

        console.log("VISUALIZATION SELECTION FOR PIE CHART:");
        console.dir(selection);

        dataModule.parse(location, selection).then(function(inputData) {
            console.log("GENERATE INPUT DATA FORMAT FOR PIE CHART");
            console.dir(inputData);
            seriesHeaders = inputData[0];
            series = transpose(inputData);
            chart = c3.generate({
                bindto: '#' + visualisationContainer,
                data: {
                    columns: series,
                    type: 'pie'
                },
                tooltip: {
                    show: selection.tooltip,
                    format: {
                        value:function(value,ratio,id){
                            return d3.format('')(value); 
                    }
                }
                
                }
            });
        });

        console.log("###########");
    }

    function tune(config) {
        console.log("### TUNE PIE CHART");
        console.dir(chart);

        var groups;
        if (config.style.id === "stacked") {
            groups = [seriesHeaders.slice(1)];
            console.dir(groups);
        } else {
            groups = [];
        }

        chart.groups(groups);

        chart.labels({
            x: config.hLabel,
            y: config.vLabel
        });

        console.log("###########");
    }

    return {
        draw: draw,
        tune: tune
    };
}();