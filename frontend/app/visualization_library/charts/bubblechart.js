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
            return $.Deferred().resolve().promise();
        }
        if (configuration.label.length <= 0 || configuration.xAxis.length <= 0 || configuration.yAxis.length <= 0) {
            return $.Deferred().resolve().promise();
        }

        var dataModule = configuration.dataModule;
        var location = configuration.datasourceLocation;

        var dimensions = [];
        var multidimensions = [configuration.label[0], configuration.xAxis[0], configuration.yAxis[0]];
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

        return dataModule.parse(location, selection).then(function(input) {
            data = google.visualization.arrayToDataTable(input);
            console.log("Data:");
            console.dir(data);

            chart = new google.visualization.BubbleChart(document.getElementById(visualisationContainer));
            chart.draw(data, { title: configuration.title });
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
    
    function export_as_PNG() {
        var dfd = new jQuery.Deferred();
        var pngURL = chart.getImageURI();
        var downloadURL = pngURL.replace(/^data:image\/png/, 'data:application/octet-stream');

        dfd.resolve(downloadURL);

        return dfd.promise();
    }
    
   function export_as_SVG() {       
        var svg = $("#visualization").find('svg');
        console.log("google chart api - CHART SVG");
        console.dir(svg);
        
        svg.attr('version', "1.1");
        svg.attr('xmlns', "http://www.w3.org/2000/svg");
        svg.attr('xmlns:xlink', "http://www.w3.org/1999/xlink");
        
        var serializer = new XMLSerializer();
        var svg_ = serializer.serializeToString(svg[0]);
        
        var svgURL = 'data:application/octet-stream,' + escape(svg_);
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