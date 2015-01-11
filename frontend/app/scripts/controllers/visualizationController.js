App.VisualizationController = Ember.ArrayController.extend({
    layoutOptions: {},
    structureOptions: {},
    slideShowContainer: Ember.ContainerView.create(),
    datasource: Ember.computed.alias("selectedVisualization.datasource"),
    visualizationConfigurationArray: [{}],
    visualizationSVG: '',
    categorizedProperties: function () {
        var categorizedProperties = {};

        var selectedVisualization = this.get('selectedVisualization');
        var dataselection = selectedVisualization.get('dataselection')
        var propertyInfos = dataselection.get('propertyInfos');

        for (var i = 0; i < propertyInfos.length; i++) {
            var propertyInfo = propertyInfos[i];
            var category = propertyInfo.scaleOfMeasurement;

            if (!categorizedProperties[category]) {
                categorizedProperties[category] = {
                    name: category,
                    items: []
                }
            }

            categorizedProperties[category].items.push(propertyInfo);
        }

        return _.values(categorizedProperties);
    }.property('selectedVisualization'),
    createVisualization: function () {
        this.set('drawnVisualization', null);

        var selectedVisualization = this.get('selectedVisualization');
        console.log("Visualization changed: ");
        console.dir(selectedVisualization);

        // Reset configuration map
        var configArray = [{}];
        this.set('visualizationConfigurationArray', configArray);

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
        console.log('mapping.structureOptions');
        console.dir(mapping.structureOptions);

        console.log('mapping.layoutOptions');
        console.dir(mapping.layoutOptions);

        this.set('structureOptions', mapping.structureOptions);
        this.set('layoutOptions', mapping.layoutOptions);

        // Ensures that bindings on drawnVisualizations are triggered only now
        this.set('drawnVisualization', selectedVisualization);
    }.observes('selectedVisualization'),
    refreshSlideshow: function () {
        console.log("Refreshing slideshow");
        var container = this.get('slideShowContainer');
        container.removeAllChildren();
        var slideshow = App.SlideShowView.create({slides: this.get("model")});
        container.pushObject(slideshow);
    }.observes("model"),
    setSuggestedVisualization: function () {
        var topSuggestion = this.get('firstObject');
        console.log("Setting top suggestion");
        console.dir(topSuggestion);
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