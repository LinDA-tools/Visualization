App.VisualizationController = Ember.ArrayController.extend({
    configuration: {},
    setupVisualization: function(visualization) {
        console.log("Setting up visualization:");
        console.dir(visualization);
        
        // var mapping = templateMapping(visualizaiton)
        // var structureOptionMappings = mapping.structureOptionMappings
        // var layoutOptionMappings = mapping.layoutOptionMappings
        // var configuration = mapping.configuration

        // *** MOCK START
        // These values have to be returned by templateMapping
        // 
        // Configuration result that will be passed to visualization
        var configuration = {
            axis: {
                xAxis: [{
                        "URI1": "Reference Period"
                    }],
                yAxis: [{
                        "URI1": "Reference Area"
                    }, {
                        "URI2": "Observed value"
                    }],
            }
        };

        // Template mapping result
        var structureOptionMappings = [
            {template: "dimension-area", options: {label: "X Axis", value: configuration.axis.xAxis}}
        ];

        // *** MOCK END
        // TODO clear configuration views
        // this.createConfigurationView(structureOptionMappings, structureOptionsView);
        // this.createConfigurationView(layoutOptionMappings, this.get('layoutOptionsView'))
        this.set('configuration', configuration);
    },
    createConfigurationView: function(mappings, targetContainerView) {
        for (var i = 0; i < mappings.length; i++) {
            var mapping = mappings[i];
            // TODO: Find component for mapping
            // targetContainerView.pushObject(optionView);
        }
    },
    onNewModel: function() {
        var topSuggestion = this.get('firstObject');
        this.setupVisualization(topSuggestion);
    }.observes('model'),
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
            this.setupVisualization(visualization);
        }
    }
});