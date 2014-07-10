
var map = function() { // map/openstreetmap module (js module pattern)

    var structureOptions = {
        label: {label: 'Label', template: 'dimension'},
        lat: {label: 'Latitude', template: 'dimension'},
        long: {label: 'Longitude', template: 'dimension'}
    };

    var tuningOptions = {};
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

        console.dir(data);

        var labelColumn = config.label.id;
        var latColumn = config.lat.id;
        var longColumn = config.long.id;

        var minLat = null;
        var maxLat = null;
        var minLong = null;
        var maxLong = null;

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
            var marker = L.marker({lat: lat, lng: long}, {title: label});
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
        structureOptions: structureOptions,
        tuningOptions: tuningOptions,
        initialize: initialize,
        draw: draw,
        tune: tune
    };
}();