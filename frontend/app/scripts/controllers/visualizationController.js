App.VisualizationController = Ember.ArrayController.extend({
    layoutOptions: {},
    structureOptions: {},
    visualizationConfiguration: [{}],
    createVisualization: function() {
        var selectedVisualization = this.get('selectedVisualization');
        console.log("Creating visualization: ");
        console.dir(selectedVisualization);

        var mapping = {
            structureOptions: {
            }
        };

        var structureOptions = selectedVisualization.get('structureOptions');
        console.log("structureOptions");
        console.dir(structureOptions);
        var dimensions = structureOptions.dimensions;
        console.log("dimensions");
        console.dir(dimensions);
        var dimensionNames = Object.getOwnPropertyNames(dimensions);
        for (i = 0; i < dimensionNames.length; i++) {
            var dimensionName = dimensionNames[i];
            var dimension = dimensions[dimensionName];
            dimension.template = "dimension-area";
            mapping.structureOptions[dimensionName] = dimension;
        }
        console.log('mapping.structureOptions');
        console.dir(mapping.structureOptions);

        this.set('structureOptions', mapping.structureOptions);
    }.observes('selectedVisualization'),
    drawVisualization: function() {
        var config = this.get('visualizationConfiguration')[0];
        console.log("Configuration changed");
        console.dir(config);

        var selectedVisualization = this.get('selectedVisualization');
        console.log("selectedVisualization")
        console.dir(selectedVisualization);
        var dataselection = selectedVisualization.get('dataselection');
        console.log("dataselection")
        console.dir(dataselection);
        var datasource = dataselection.get('datasource');
        var format = datasource.get('format');
        console.log("datasource")
        console.dir(datasource);
        config.datasourceLocation = datasource.get('location');
        switch (format) {
            case 'rdf':
                config.dataModule = sparql_data_module;
                break;
            case 'csv':
                config.dataModule = csv_data_module;
                break;
            default:
                console.error("Unknown DS format: " + format);
                return;
        }
        // var name = selectedVisualization.get('name');
        var name = "Line Chart";
        var visualization = visualizationRegistry.getVisualization(name);
        console.log("Visualization " + name);
        console.dir(visualization);
        console.dir(config);
        visualization.draw(config, "visualisation");
    }.observes('visualizationConfiguration.@each'),
    setSuggestedVisualization: function() {
        var topSuggestion = this.get('firstObject');
        console.log("Setting top suggestion");
        console.dir(topSuggestion);
        this.set('selectedVisualization', topSuggestion);
    }.observes('model'),
    dimensionMappingContent: function() {
        var visualization = this.get('selectedVisualization');
        var dataselection = visualization.get('dataselection'); // data sources

        if (!dataselection)
            return {};

        console.log("dataselection");
        console.dir(dataselection);

        var treedata = dimension_data.create(dataselection);
        console.log("treedata: ");
        console.dir(treedata);
        return treedata;
    }.property('selectedVisualization'),
    actions: {
        export: function() {
        },
        publish: function() {
        },
        save: function() {
        },
        share: function() {
        },
        chooseVisualization: function(visualization) {
            this.set('selectedVisualization', visualization);
        }
    }
});