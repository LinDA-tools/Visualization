App.VisualizationController = Ember.ArrayController.extend({
    layoutOptions: {},
    structureOptions: {},
    slideShowContainer: Ember.ContainerView.create(),
    datasource: Ember.computed.alias("selectedVisualization.datasource"),
    visualizationConfiguration: [{}],
    visualizationSVG: '',
    exportFormats: ['SVG', 'PNG'],
    selectedFormat:'PNG',
    categorizedProperties: function () {
        var categorizedProperties = {};
        var selectedVisualization = this.get('selectedVisualization');
        var dataselection = selectedVisualization.get('dataselection');
        var propertyInfos = dataselection.get('propertyInfos');

        for (var i = 0; i < propertyInfos.length; i++) {
            var propertyInfo = propertyInfos[i];
            var category = propertyInfo.scaleOfMeasurement;

            if (!categorizedProperties[category]) {
                categorizedProperties[category] = {
                    name: category,
                    items: []
                };
            }
            categorizedProperties[category].items.push(propertyInfo);
        }

        return _.values(categorizedProperties);
    }.property('selectedVisualization'),
    initializeVisualization: function () {
        console.log("VISUALIZATION CONTROLLER - INITIALIZE VISUALIZATION ... ");
        this.set('drawnVisualization', null);

        var selectedVisualization = this.get('selectedVisualization');
        console.log('SELECTED VISUALIZATION');
        console.dir(selectedVisualization);

        // Reset configuration map
        var configArray = [{}];
        this.set('visualizationConfiguration', configArray);
                
        if (!selectedVisualization) {
            return;
        }

        var mapping = {
            structureOptions: {},
            layoutOptions: {}
        };

        var customMapping = templateMapping(selectedVisualization);

        mapping.structureOptions = customMapping.structureOptions;
        mapping.layoutOptions = customMapping.layoutOptions;
        
        console.log('MAPPING - STRUCTURE OPTIONS');
        console.dir(mapping.structureOptions);

        console.log('MAPPING - LAYOUT OPTIONS');
        console.dir(mapping.layoutOptions);

        this.set('structureOptions', mapping.structureOptions);
        this.set('layoutOptions', mapping.layoutOptions);
        
        // Ensures that bindings on drawnVisualizations are triggered only now
        this.set('drawnVisualization', selectedVisualization);
    }.observes('selectedVisualization'),
    refreshSlideshow: function () {
        var container = this.get('slideShowContainer');
        container.removeAllChildren();
        var slideshow = App.SlideShowView.create({slides: this.get("model")});
        container.pushObject(slideshow);
    }.observes("model"),
    setSuggestedVisualization: function () {
        var topSuggestion = this.get('firstObject');     
        this.set('selectedVisualization', topSuggestion);
    }.observes('model'),
    actions: {
        exportPNG: function () {
            var visualization = visualizationRegistry.getVisualization(this.get('selectedVisualization').get("name"));
            visualization.export_as_PNG().then(function (pngURL) {
                window.open(pngURL);
            });
        },
        exportSVG: function () {
            var visualization = visualizationRegistry.getVisualization(this.get('selectedVisualization').get("name"));
            var svgURL = visualization.export_as_SVG();
            window.open(svgURL);
        },
        export: function() {
            var visualization = visualizationRegistry.getVisualization(this.get('selectedVisualization').get("visualizationName"));
            if (this.get('selectedFormat')==='PNG'){
                visualization.export_as_PNG().then(function (pngURL) {
                    window.open(pngURL);
                });
            } else {
                var svgURL = visualization.export_as_SVG();
                window.open(svgURL);
            }
        },
        publish: function() {
            var visualization = visualizationRegistry.getVisualization(this.get('selectedVisualization').get("visualizationName"));
            this.set('visualizationSVG',visualization.get_SVG());
        },
        save: function () {
            // send actual visualization model to backend
            var selectedVisualization = this.get('selectedVisualization');
            console.log("Saved visualization");
            console.dir(selectedVisualization);

            // send current visualization configuration to backend
            selectedVisualization.save();
        },
        chooseVisualization: function (visualization) {
            this.set('selectedVisualization', visualization);
        }
    }
});