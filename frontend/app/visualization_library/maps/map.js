var map = function () { // map/openstreetmap module (js module pattern)

    var map = null;
    function draw(configuration, visualisationContainer) {
        console.log("### INITIALIZE VISUALISATION - MAP");
        if (map) {
            map = map.remove();
            map = null;
        }

        $('#' + visualisationContainer).empty();
        var label = configuration['Label'];
        var lat = configuration['Latitude'];
        var long = configuration['Longitude'];
        var indicator = configuration['Indicator'];
        if (!(configuration.dataModule && configuration.datasourceLocation
                && label && lat && long && indicator)) {
            return $.Deferred().resolve().promise();
        }

        if ((lat.length === 0) || (long.length === 0)) {
            return $.Deferred().resolve().promise();
        }

        map = new L.Map(visualisationContainer);
        L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>',
            zoom: 8
        }).addTo(map);
        var dataModule = configuration.dataModule;
        var latPropertyInfo = lat[0];
        var longPropertyInfo = long[0];
        var labelPropertyInfos = label;
        var indicatorPropertyInfos = indicator;
        var currColumn = 0;
        var latColumn = currColumn++;
        var longColumn = currColumn++;
        var labelColumns = _.range(currColumn, currColumn + labelPropertyInfos.length);
        currColumn += labelPropertyInfos.length;
        var indicatorColumns = _.range(currColumn, currColumn + indicatorPropertyInfos.length);
        currColumn += indicatorPropertyInfos.length;
        var dimensions = [];
        var labels = [];
        var indicators = [];
        var group = [];
        dimensions.push(latPropertyInfo);
        dimensions.push(longPropertyInfo);
        for (var i = 0; i < labelPropertyInfos.length; i++) {
            if (labelPropertyInfos[i].groupBy) {
                group.push(labelPropertyInfos[i]);
            } else {
                labels.push(labelPropertyInfos[i]);
            }
        }
        for (var i = 0; i < indicatorPropertyInfos.length; i++) {
            if (indicatorPropertyInfos[i].groupBy) {
                group.push(indicatorPropertyInfos[i]);
            } else {
                indicators.push(indicatorPropertyInfos[i]);
            }
        }

        var selection = {
            dimension: dimensions,
            multidimension: labels.concat(indicators),
            group: group
        };
        var location = configuration.datasourceLocation;
        var graph = configuration.datasourceGraph;
        return dataModule.parse(location, graph, selection).then(function (data) {
            console.log("CONVERTED INPUT DATA FOR MAP VISUALIZATION");
            console.dir(data);
            var minLat = 90;
            var maxLat = -90;
            var minLong = 180;
            var maxLong = -180;
            var minHue = 0;
            var maxHue = 120;
            var minIndicatorValues = [];
            var maxIndicatorValues = [];
            for (var j = 0; j < indicatorColumns.length; j++) {
                var minIndicatorValue = Number.MAX_VALUE;
                var maxIndicatorValue = Number.MIN_VALUE;
                for (var i = 1; i < data.length; ++i) {
                    var row = data[i];
                    var indicatorColumn = indicatorColumns[j]; // spaltenindex
                    var indicatorValue = row[indicatorColumn];
                    if (minIndicatorValue > indicatorValue) {
                        minIndicatorValue = indicatorValue;
                    }
                    if (maxIndicatorValue < indicatorValue) {
                        maxIndicatorValue = indicatorValue;
                    }
                }
                minIndicatorValues.push(minIndicatorValue);
                maxIndicatorValues.push(maxIndicatorValue);
            }

            if (indicatorColumns.length === 1) {
                var indicatorColumn = indicatorColumns[0];


                var columnsHeaders = data[0];
                var dataLayerOptions = {
                    recordsField: 'features',
                    latitudeField: columnsHeaders[0],
                    longitudeField: columnsHeaders[1],
                    locationMode: L.LocationModes.LATLNG,
                    displayOptions: {},
                    layerOptions: {
                        numberOfSides: 4,
                        radius: 10,
                        weight: 1,
                        color: '#000',
                        opacity: 0.2,
                        stroke: true,
                        fillOpacity: 0.7,
                        dropShadow: true,
                        gradient: true
                    },
                    tooltipOptions: {
                        iconSize: new L.Point(90, 76),
                        iconAnchor: new L.Point(-4, 76)
                    },
                    onEachRecord: function (layer, record, location) {
                        var $html = $(L.HTMLUtils.buildTable(record));
                        layer.bindPopup($html.wrap('<div/>').parent().html(), {
                            minWidth: 400,
                            maxWidth: 400
                        });
                    }
                };

                var minIndicatorValue = minIndicatorValues[0];
                var maxIndicatorValue = maxIndicatorValues[0];
                console.log("Min/max indicator value: " + minIndicatorValue + " -> " + maxIndicatorValue)

                var indicatorColorFunction = new L.HSLHueFunction(new L.Point(minIndicatorValue, 50), new L.Point(maxIndicatorValue, -25), {outputSaturation: '100%', outputLuminosity: '25%'});
                var indicatorFillColorFunction = new L.HSLHueFunction(new L.Point(minIndicatorValue, 50), new L.Point(maxIndicatorValue, -25), {outputSaturation: '100%', outputLuminosity: '50%'});

                var columnName = columnsHeaders[indicatorColumn];
                dataLayerOptions.displayOptions[columnName] = {
                    displayName: columnName,
                    color: indicatorColorFunction,
                    fillColor: indicatorFillColorFunction,
                    radius: 5
                }

                var inputData = {
                    features: rows(data),
                };
                var dataLayer = new L.DataLayer(inputData, dataLayerOptions);
                console.log("Map input data: ");
                console.dir(inputData);
                map.addLayer(dataLayer);
            } else {
                for (var i = 1; i < data.length; ++i) {
                    var row = data[i];
                    var lat = parseFloat(row[latColumn]);
                    var long = parseFloat(0.0 + row[longColumn]);
                    if (!lat || !long) {
                        console.warn("No lat or long in row:");
                        console.dir(row);
                        continue;
                    }
                    minLat = Math.min(minLat, lat);
                    maxLat = Math.max(maxLat, lat);
                    minLong = Math.min(minLong, long);
                    maxLong = Math.max(maxLong, long);
                    var label = labelColumns.length >= 0 ? row[labelColumns[0]] : '';
                    console.log("LatLong: " + lat + ", " + long);
                    var marker;
                    if (indicatorColumns.length > 0) {
                        var markeroptions = {
                            data: {},
                            chartOptions: {},
                            displayOptions: {},
                            weight: 1,
                            color: '#000000'
                        };
                        for (var j = 0; j < indicatorColumns.length; j++) {
                            var indicatorColumn = indicatorColumns[j]; // spaltenindex
                            var indicatorValue = row[indicatorColumn];
                            var name = 'datapoint' + j;
                            console.log("indicator [j]: " + indicatorColumn + " name: " + name + " value: " + indicatorValue);
                            markeroptions.data[name] = indicatorValue;
                            markeroptions.chartOptions[name] = {
                                color: 'hsl(240,100%,55%)',
                                fillColor: 'hsl(240,80%,55%)',
                                minValue: 0,
                                maxValue: maxIndicatorValues[j],
                                maxHeight: 20,
                                title: label,
                                displayText: function (value) {
                                    return value.toFixed(2);
                                }
                            };
                            markeroptions.displayOptions[name] = {
                                color: new L.HSLHueFunction(new L.Point(0, minHue), new L.Point(100, maxHue), {outputSaturation: '100%', outputLuminosity: '25%'}),
                                fillColor: new L.HSLHueFunction(new L.Point(0, minHue), new L.Point(100, maxHue), {outputSaturation: '100%', outputLuminosity: '50%'})
                            };
                        }
                        console.dir(markeroptions);
                        marker = new L.MapMarker(new L.LatLng(lat, long), markeroptions);
                    } else {
                        var markeroptions = {
                            title: label
                        };
                        marker = new L.Marker(new L.LatLng(lat, long), markeroptions);
                    }
                    marker.addTo(map);
                    console.log("Point: [" + lat + ", " + long + ", " + label + "]");
                }
            }
            console.log("Bounds: [" + minLat + ", " + maxLat + "], [" + minLong + ", " + maxLong + "]");
            if (minLat !== null && minLong !== null && maxLat !== null && maxLong !== null) {
                map.fitBounds([
                    [minLat, minLong],
                    [maxLat, maxLong]
                ]);
            }
        });
    }

    function tune(config) {
    }

    function get_SVG() {
        return '';
    }

    function export_as_PNG() {
        var dfd = new jQuery.Deferred();
        leafletImage(map, function (err, canvas) {
            var pngURL = canvas.toDataURL();
            var downloadURL = pngURL.replace(/^data:image\/png/, 'data:application/octet-stream');
            dfd.resolve(downloadURL);
        });
        return dfd.promise();
    }


    return {
        export_as_PNG: export_as_PNG,
        get_SVG: get_SVG,
        draw: draw,
        tune: tune
    };
}();
