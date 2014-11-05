var linechart = function() {
    var chart = null;
    var seriesHeaders = [];
    var series = [];

    function draw(configuration, visualisationContainer) {
        console.log("### INITIALIZE VISUALISATION");
        
        $('#' + visualisationContainer).empty();

        if (!(configuration.dataModule && configuration.datasourceLocation
                && configuration.xAxis && configuration.yAxis
                && configuration.group)) {
            return;
        }
        var dataModule = configuration.dataModule;
        var location = configuration.datasourceLocation;

        console.log("VISUALISATION CONFIGURATION");
        console.dir(configuration);


        var selection = {
            dimension: configuration.xAxis,
            multidimension: configuration.yAxis,
            group: configuration.group
        };
        console.log("SELECTION");
        console.dir(selection);


        dataModule.parse(location, selection).then(function(inputData) {
            console.log("CONVERTED INPUT DATA");
            console.dir(inputData);
            seriesHeaders = inputData[0];
            series = transpose(inputData);
            chart = c3.generate({
                bindto: '#' + visualisationContainer,
                data: {
                    columns: series,
                    x: seriesHeaders[0],
                    type: 'line'
                },
                axis: {
                    y: {
                        tick: {
                            format: function(val) {
                                if (!val && val !== 0) {
                                    return '';
                                }
                                return val.toLocaleString([], {
                                    useGrouping: false,
                                    maximumFractionDigits: 6
                                });
                            }
                        }
                    }
                },
                grid: {
                    y: {
                        lines: [{value: 0}]
                    }
                },
                tooltip: {
                    show: false
                }
            });
        });

        console.log("###########");
    }

    function tune(config) {
        console.log("### TUNE VISUALISATION");
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