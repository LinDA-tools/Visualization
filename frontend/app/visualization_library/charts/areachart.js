var areachart = function() {
    var chart = null;
    var seriesHeaders = [];
    var series = [];

    function draw(configuration, visualisationContainer) {
        console.log("### INITIALIZE VISUALISATION - AREA CHART");
        
        $('#' + visualisationContainer).empty();

        if (!(configuration.dataModule && configuration.datasourceLocation
                && configuration.xAxis && configuration.yAxis
                && configuration.group)) {
            return;
        }

        if ((configuration.xAxis.length === 0) || (configuration.yAxis.length === 0)) {
            return;
        }

        var dataModule = configuration.dataModule;
        var location = configuration.datasourceLocation;

        var selection = {
            dimension: configuration.xAxis,
            multidimension: configuration.yAxis,
            group: configuration.group,
            hLabel: configuration.hLabel,
            vLabel: configuration.vLabel,
            tooltip: configuration.tooltip,
            gridlines: configuration.gridlines,
            ticks: configuration.ticks
        };

        console.log("VISUALIZATION SELECTION FOR AREA CHART:");
        console.dir(selection);

        dataModule.parse(location, selection).then(function(inputData) {
            console.log("GENERATE INPUT DATA FORMAT FOR AREA CHART");
            console.dir(inputData);
            seriesHeaders = inputData[0];
            series = transpose(inputData);
            chart = c3.generate({
                bindto: '#' + visualisationContainer,
                data: {
                    columns: series,
                    x: seriesHeaders[0],
                    type: 'area-spline'
                },
                axis: {
                    x: {
                        label: selection.hLabel,
                        tick: {
                            fit: true,
                            count: selection.ticks,
                            format: function(val) {
                                if (!val && val !== 0) {
                                    return '';
                                }
                                return val.toLocaleString([], {
                                    useGrouping: false,
                                    maximumFractionDigits: 2
                                });
                            }
                        }
                    },
                    y: {
                        label: selection.vLabel,
                        tick: {
                            count: selection.ticks
                        }
                    }
                },
                grid: {
                    x: {
                        show: selection.gridlines
                    },
                    y: {
                        show: selection.gridlines
                    }
                },
                tooltip: {
                    show: selection.tooltip
                }
            });
        });

        console.log("###########");
    }

    function tune(config) {
        console.log("### TUNE AREA CHART");
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