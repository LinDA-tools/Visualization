var piechart = function() {
    var chart = null;
    var seriesHeaders = [];
    var series = [];

    function draw(configuration, visualisationContainer) {
        console.log("### INITIALIZE VISUALISATION - PIE CHART");

        $('#' + visualisationContainer).empty();

        if (!(configuration.dataModule && configuration.datasourceLocation
                && configuration.slice)) {
            return $.Deferred().resolve().promise();
        }

        if (configuration.slice.length === 0) {
            return $.Deferred().resolve().promise();
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

        return dataModule.parse(location, selection).then(function(inputData) {
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
                        value: function(value, ratio, id) {
                            return d3.format('')(value);
                        }
                    }
                }
            });
        });
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
    }

    function export_as_PNG() {
       return exportC3.export_PNG();
    }

    function export_as_SVG() {
       return exportC3.export_SVG();
    }
    
    function get_SVG(){
        return exportC3.get_SVG();
    }

    return {
        export_as_PNG: export_as_PNG,
        export_as_SVG: export_as_SVG,
        get_SVG: get_SVG,
        draw: draw,
        tune: tune
    };
}();