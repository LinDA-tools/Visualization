google.load('visualization', '1', {packages: ['corechart']});
var barchart = function() {

    var chart = null;
    var data = null;

    function draw(configuration, visualisationContainer) {
        console.log("### INITIALIZE VISUALISATION - BAR CHART");

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
            dimension: configuration.yAxis,
            multidimension: configuration.xAxis,
            group: []
        };

        console.log("VISUALIZATION SELECTION FOR COLUMN CHART:");
        console.dir(selection);

        return dataModule.parse(location, selection).then(function(input) {
            data = google.visualization.arrayToDataTable(input);
            chart = new google.visualization.BarChart(document.getElementById(visualisationContainer));
            chart.draw(data, {title: configuration.title});
        });
    }
    function tune(config) {
        console.log("### TUNE VISUALISATION");
        chart.draw(data,
                {title: config.title,
                    vAxis: {title: config.axis.vLabel},
                    hAxis: {title: config.axis.hLabel,
                        logScale: (config.axis.scale.id === 'logarithmic') ? true : false,
                        gridlines: {
                            count: config.axis.grid
                        }
                    },
                    isStacked: (config.style.id === 'stacked') ? true : false,
                }
        );
    }

    function export_as_PNG() {
        var dfd = new jQuery.Deferred();
        var pngURL = chart.getImageURI();
        var downloadURL = pngURL.replace(/^data:image\/png/, 'data:application/octet-stream');

        dfd.resolve(downloadURL);

        return dfd.promise();
    }

    function export_as_SVG() {         
        var svg = get_SVG();
        var svgURL = 'data:application/octet-stream,' + escape(svg);
        console.log("google chart api- SVG URL");
        console.dir(svgURL);

        return(svgURL);
    }

    function get_SVG() {
        var svg = $("#visualization").find('svg');
        console.log("google chart api - CHART SVG");
        console.dir(svg);
        
         if (svg.length === 0) {
            return;
        }
        
        svg.attr('version', "1.1");
        svg.attr('xmlns', "http://www.w3.org/2000/svg");
        svg.attr('xmlns:xlink', "http://www.w3.org/1999/xlink");
        
        var serializer = new XMLSerializer();
        var svg_ = serializer.serializeToString(svg[0]);
        return svg_ ;
    }

    return {
        export_as_PNG: export_as_PNG,
        export_as_SVG: export_as_SVG,
        get_SVG: get_SVG,
        draw: draw,
        tune: tune
    };
}();