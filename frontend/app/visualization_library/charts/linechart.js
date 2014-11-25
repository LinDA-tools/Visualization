var linechart = function() {
    var chart = null;
    var seriesHeaders = [];
    var series = [];

    function draw(configuration, visualisationContainer) {
        console.log("### INITIALIZE VISUALISATION - LINE CHART");

        $('#' + visualisationContainer).empty();

        if (!(configuration.dataModule && configuration.datasourceLocation
                && configuration.xAxis && configuration.yAxis
                && configuration.group)) {
            return $.Deferred().resolve().promise();
        }

        if ((configuration.xAxis.length === 0) || (configuration.yAxis.length === 0)) {
            return $.Deferred().resolve().promise();
        }

        var dataModule = configuration.dataModule;
        var location = configuration.datasourceLocation;

        var selection = {
            dimension: configuration.xAxis,
            multidimension: configuration.yAxis,
            group: configuration.group,
            hLabel: configuration.hLabel,
            vLabel: configuration.vLabel,
            gridlines: configuration.gridlines,
            ticks: configuration.ticks,
            tooltip: configuration.tooltip
        };

        console.log("VISUALISATION CONFIGURATION FOR LINE CHART:");
        console.dir(selection);

        return dataModule.parse(location, selection).then(function(inputData) {
            console.log("GENERATE INPUT DATA FORMAT FOR LINE CHART");
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
                            count: selection.ticks,
                            format: function(val) {
                                if (!val && val !== 0) {
                                    return '';
                                }
                                return val.toLocaleString([], {
                                    useGrouping: false,
                                    maximumFractionDigits: 6
                                });
                            }
                        },
                        label: selection.vLabel
                    },
                    x: {
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
                        },
                        label: selection.hLabel
                    }
                },
                grid: {
                    x: {
                        show: selection.gridlines,
                        lines: [{value: 0}]
                    },
                    y: {
                        show: selection.gridlines,
                        lines: [{value: 0}]
                    }
                },
                tooltip: {
                    show: selection.tooltip
                },
                transition: {}
            });
        });
    }

    function tune(config) {
        console.log("### TUNE LINE CHART");
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
    }

    function export_as_PNG() {
        return exportC3.export_PNG();
    }

    function export_as_SVG() {
        return exportC3.export_SVG();
    }

    function get_SVG() {
        setTimeout(function() {
            return exportC3.get_SVG();
        }, 2000);
    }

    return {
        export_as_PNG: export_as_PNG,
        export_as_SVG: export_as_SVG,
        get_SVG: get_SVG,
        draw: draw,
        tune: tune
    };
}();