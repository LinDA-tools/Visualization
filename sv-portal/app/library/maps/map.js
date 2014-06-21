
var map = function() { // map/openstreetmap module (js module pattern)

    var structureOptions = [
        {name: 'latitude', template: ''},
        {name: 'longitude', template: ''}
    ];
    
    var tuningOptions = [];
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
        map.setView([51.505, -0.09], 13); // aus dem input und aus der config (tuning)
        L.marker([51.5, -0.09]).addTo(map);
        L.marker([51.51, -0.09]).addTo(map);
        L.marker([51.52, -0.09]).addTo(map);
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