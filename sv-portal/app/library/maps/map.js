
var map = function() { // map/openstreetmap module (js module pattern)

    var structureOptionsRDF = {
        axis: {label: "Map options", template: 'tabgroup', options: {
                label: {label: 'Set label', template: 'dimension'},
                lat: {label: 'Set latitude', template: 'dimension'},
                long: {label: 'Set longitude', template: 'dimension'},
                indicator: {label: 'Set indicator', template: 'multidimension'}
            }
        }
    };
    var structureOptionsCSV = {
        axis: {label: "Map options", template: 'box', options: {
                label: {label: 'Set label', template: 'dimension'},
                lat: {label: 'Set latitude', template: 'dimension'},
                long: {label: 'Set longitude', template: 'dimension'},
                indicator: {label: 'Set indicator', template: 'multidimension'}
            }
        }
    };

    var map = null;
    var data = null;

    function initialize(input, divId) {
        data = input;
        map = L.map(divId)
        // create a map in the "visualization" div
        L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
            maxZoom: 18
        }).addTo(map);
    }

    function draw(config) {
        if (data.length === 0) {
            console.error("No data given!");
        }


        console.log("CONFIG - MAP:");
        console.dir(config);
        console.dir(data);

        var labelColumn = config.axis.label.id;
        var latColumn = config.axis.lat.id;
        var longColumn = config.axis.long.id;
        var indicatorColumns = config.axis.indicator.multiAxis;
        console.log("indicator: " + indicatorColumns.length);
        console.log(indicatorColumns);
        
        var maxIndicatorValue = 1;
        for (var i = 1; i < data.length; ++i) {
            var row = data[i];
            for (var j = 0; j < indicatorColumns.length; j++) {
                var indicatorColumn = indicatorColumns[j].id; // spaltenindex
                var indicatorValue = row[indicatorColumn];
                if(maxIndicatorValue < indicatorValue) {
                    maxIndicatorValue = indicatorValue;
                }
            }
        }

        var minLat = null;
        var maxLat = null;
        var minLong = null;
        var maxLong = null;

        var minHue = 120;
        var maxHue = 0;
            
        for (var i = 1; i < data.length; ++i) {
            var row = data[i];
            var lat = parseFloat(row[latColumn]);
            var long = parseFloat(0.0 + row[longColumn]);
            if (!lat || !long) {
                continue;
            }
            minLat = Math.max(minLat, lat);
            maxLat = Math.min(maxLat, lat);
            minLong = Math.max(minLat, long);
            maxLong = Math.min(maxLat, long);
            var label = row[labelColumn];

            console.log("LatLong: " + lat + ", " + long);


            var markeroptions = {
                data: {
                },
                chartOptions: {
                },
                displayOptions: {
                },
                weight: 1,
                color: '#000000'
            }

            for (var j = 0; j < indicatorColumns.length; j++) {
                var indicatorColumn = indicatorColumns[j].id; // spaltenindex
                var indicatorValue = row[indicatorColumn];
                var name = 'datapoint' + j;

                console.log("indicator [j]: " + indicatorColumn + " name: " + name + " value: " + indicatorValue);
                markeroptions.data[name] = indicatorValue;
                markeroptions.chartOptions[name] = {
                    color: 'hsl(240,100%,55%)',
                    fillColor: 'hsl(240,80%,55%)',
                    minValue: 0,
                    maxValue: maxIndicatorValue,
                    maxHeight: 20,
                    title: label,
                    displayText: function(value) {
                        return value.toFixed(2);
                    }
                };
                markeroptions.displayOptions[name] = {
                    color: new L.HSLHueFunction(new L.Point(0, minHue), new L.Point(100, maxHue), {outputSaturation: '100%', outputLuminosity: '25%'}),
                    fillColor: new L.HSLHueFunction(new L.Point(0, minHue), new L.Point(100, maxHue), {outputSaturation: '100%', outputLuminosity: '50%'})
                };
            }
            console.dir(markeroptions);
            var marker = new L.BarChartMarker(new L.LatLng(lat, long), markeroptions);
            //var marker = L.marker({lat: lat, lng: long}, {title: label});
            marker.addTo(map);
            //console.log("Point: [" + lat + ", " + long + ", " + label + "]")
        }
        //console.log("Bounds: [" + minLat + ", " + maxLat + "], [" + minLong + ", " + maxLong + "]")
        map.fitBounds([
            [minLat, minLong],
            [maxLat, maxLong]
        ]);
    }
    
    function drawRDF() {
        if (data.length === 0) {
            console.error("No data given!");
        }


        console.log("DRAW RDF - MAP:");
        console.dir(data);

        var labelColumn = 0;
        var latColumn = 1;
        var longColumn = 2;
        var indicatorColumns = [];
        for (var i = 3; i<data.length; i++){
                   indicatorColumns.push(i);  
        }
        
        console.log("indicator: " + indicatorColumns.length);
        console.log(indicatorColumns);

        var maxIndicatorValue = 1;
        for (var i = 1; i < data.length; ++i) {
            var row = data[i];
            for (var j = 0; j < indicatorColumns.length; j++) {
                var indicatorColumn = indicatorColumns[j].id; // spaltenindex
                var indicatorValue = row[indicatorColumn];
                if(maxIndicatorValue < indicatorValue) {
                    maxIndicatorValue = indicatorValue;
                }
            }
        }

        var minLat = null;
        var maxLat = null;
        var minLong = null;
        var maxLong = null;

        var minHue = 120;
        var maxHue = 0;

        for (var i = 1; i < data.length; ++i) {
            var row = data[i];
            var lat = parseFloat(row[latColumn]);
            var long = parseFloat(0.0 + row[longColumn]);
            if (!lat || !long) {
                continue;
            }
            minLat = Math.max(minLat, lat);
            maxLat = Math.min(maxLat, lat);
            minLong = Math.max(minLat, long);
            maxLong = Math.min(maxLat, long);
            var label = row[labelColumn];

            console.log("LatLong: " + lat + ", " + long);


            var markeroptions = {
                data: {
                },
                chartOptions: {
                },
                displayOptions: {
                },
                weight: 1,
                color: '#000000'
            }


            for (var j = 0; j < indicatorColumns.length; j++) {
                var indicatorColumn = indicatorColumns[j]; // spaltenindex
                var indicatorValue = row[indicatorColumn];
                var name = 'datapoint' + j;

                console.log("indicator [j]: " + indicatorColumn + " name: " + name + " value: " + indicatorValue);
                if(!indicatorValue) {
                    continue;
                }
                
                markeroptions.data[name] = indicatorValue;
                markeroptions.chartOptions[name] = {
                    color: 'hsl(240,100%,55%)',
                    fillColor: 'hsl(240,80%,55%)',
                    minValue: 0,
                    maxValue: maxIndicatorValue,
                    maxHeight: 20,
                    title: label,
                    displayText: function(value) {
                        return value.toFixed(2);
                    }
                };
                markeroptions.displayOptions[name] = {
                    color: new L.HSLHueFunction(new L.Point(0, minHue), new L.Point(100, maxHue), {outputSaturation: '100%', outputLuminosity: '25%'}),
                    fillColor: new L.HSLHueFunction(new L.Point(0, minHue), new L.Point(100, maxHue), {outputSaturation: '100%', outputLuminosity: '50%'})
                };
            }
            console.dir(markeroptions);
            var marker = new L.BarChartMarker(new L.LatLng(lat, long), markeroptions);
            //var marker = L.marker({lat: lat, lng: long}, {title: label});
            marker.addTo(map);
            //console.log("Point: [" + lat + ", " + long + ", " + label + "]")
        }
        //console.log("Bounds: [" + minLat + ", " + maxLat + "], [" + minLong + ", " + maxLong + "]")
        map.fitBounds([
            [minLat, minLong],
            [maxLat, maxLong]
        ]);
    }

    function tune(config) {
    }

    return {
        structureOptionsCSV: structureOptionsCSV,
        structureOptionsRDF: structureOptionsRDF,
        initialize: initialize,
        draw: draw,
                drawRDF: drawRDF,

        tune: tune
    };
}();