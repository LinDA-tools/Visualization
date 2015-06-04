import util from "./util";
import exportVis from "./export-visualization";

/* global dimple */
/* global $ */
var columnchart = function () {
    var seriesHeaders = [];
    var series = [];

    function draw(configuration, visualisationContainerID) {
        console.log("### INITIALIZE VISUALISATION - COLUMN CHART");

        var container = $('#' + visualisationContainerID);
        container.empty();

        var xAxis = configuration['Horizontal Axis'];
        var yAxis = configuration['Vertical Axis'];
        var group = configuration['Groups'];

        if (!(configuration.dataModule && configuration.datasourceLocation && xAxis && yAxis && group)) {
            return $.Deferred().resolve().promise();
        }

        if ((xAxis.length === 0) || (yAxis.length === 0)) {
            return $.Deferred().resolve().promise();
        }

        var dataModule = configuration.dataModule;
        var location = configuration.datasourceLocation;
        var graph = configuration.datasourceGraph;
        var gridlines = configuration.Gridlines;
        var tooltip = configuration.Tooltip;
        var hLabel = configuration["Horizontal Label"];
        var vLabel = configuration["Vertical Label"];

        var selection = {
            dimension: yAxis, // measure
            multidimension: xAxis.concat(group), // categories
            gridlines: gridlines,
            tooltip: tooltip,
            hLabel: hLabel,
            vLabel: vLabel
        };

        console.log("VISUALIZATION SELECTION FOR COLUMN CHART:");
        console.dir(selection);

        var svg = dimple.newSvg('#' + visualisationContainerID, container.width(), container.height());

        return dataModule.parse(location, graph, selection).then(function (inputData) {
            seriesHeaders = inputData[0];
            series = util.createRows(inputData);
            console.log("GENERATE INPUT DATA FORMAT FOR COLUMN CHART");
            console.dir(series);

            var chart = new dimple.chart(svg, series);

            var categoryAxis;
            var measureAxis;
            if (configuration.horizontal) {
                categoryAxis = "y";
                measureAxis = "x";
            } else {
                categoryAxis = "x";
                measureAxis = "y";
            }

            var dim1 = chart.addCategoryAxis(categoryAxis, seriesHeaders.slice(1, 1 + xAxis.length + group.length));  // x axis: more categories
            var dim2 = chart.addMeasureAxis(measureAxis, seriesHeaders[0]);  // y axis: one measure (scale)

            if (group.length > 0) { // simple column groups
                chart.addSeries(seriesHeaders[seriesHeaders.length - 1], dimple.plot.bar);
            } else {
                chart.addSeries(null, dimple.plot.bar);
            }
            chart.addLegend("10%", "5%", "80%", 20, "right");

            if (selection.hLabel === "" || selection.hLabel === "Label") {
                selection.hLabel = seriesHeaders[1];
            }
            if (selection.vLabel === "" || selection.vLabel ==="Label") {
                selection.vLabel = seriesHeaders[0];
            }
            dim1.title = selection.hLabel;
            dim2.title = selection.vLabel;

            dim1.ticks = selection.gridlines;
            dim2.ticks = selection.gridlines;

            //tooltip
            if (selection.tooltip === false) {
                chart.addSeries(series, dimple.plot.bar).addEventHandler("mouseover", function () {
                });
            }

            chart.draw();
        });
    }

    function export_as_PNG() {
        return exportVis.export_PNG();
    }

    function export_as_SVG() {
        return exportVis.export_SVG();
    }

    function get_SVG() {
        return exportVis.get_SVG();
    }


    return {
        export_as_PNG: export_as_PNG,
        export_as_SVG: export_as_SVG,
        get_SVG: get_SVG,
        draw: draw
    };
}();

export default columnchart;
