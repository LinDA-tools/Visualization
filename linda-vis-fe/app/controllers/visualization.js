import Ember from "ember";
import template_mapping from "../utils/template-mapping";
import vis_registry from "../utils/visualization-registry";

/* global _ */
export default Ember.ArrayController.extend({
    isToggled: true,
    layoutOptions: {},
    structureOptions: {},
    slideShowContainer: Ember.ContainerView.create(),
    datasource: Ember.computed.alias("selectedVisualization.datasource"),
    visualizationConfiguration: [{}],
    visualizationSVG: '',
    exportFormats: ['SVG', 'PNG'],
    selectedFormat: 'PNG',
    configName: "",
    categorizedProperties: function() {
        var categorizedProperties = {};
        var selectedVisualization = this.get('selectedVisualization');
        var dataselection = selectedVisualization.get('dataselection');
        var propertyInfos = dataselection.get('propertyInfos');

        for (var i = 0; i < propertyInfos.length; i++) {
            var propertyInfo = propertyInfos[i];
            var category = propertyInfo.type;
            var datatype = propertyInfo.datatype;

            if (!categorizedProperties[category]) {
                categorizedProperties[category] = {
                    name: category,
                    datatype:datatype,
                    items: []
                };
            }
            categorizedProperties[category].items.push(propertyInfo);
        }

        console.log('CATEGORIZED PROPERTIES');
	console.dir(_.values(categorizedProperties));

        return _.values(categorizedProperties);
    }.property('selectedVisualization'),
    initializeVisualization: function() {
        console.log("VISUALIZATION CONTROLLER - INITIALIZE VISUALIZATION ... ");
        this.set('drawnVisualization', null);
        this.set('isToggled',true);

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

        var customMapping = template_mapping.templateMapping(selectedVisualization);

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
    setSuggestedVisualization: function() {
        var topSuggestion = this.get('firstObject');
        this.set('selectedVisualization', topSuggestion);
    }.observes('model.[]'),
    actions: {
        exportPNG: function() {
            var visualization = vis_registry.getVisualization(this.get('selectedVisualization').get("name"));
            visualization.export_as_PNG().then(function(pngURL) {
                window.open(pngURL);
            });
        },
        exportSVG: function() {
            var visualization = vis_registry.getVisualization(this.get('selectedVisualization').get("name"));
            var svgURL = visualization.export_as_SVG();
            window.open(svgURL);
        },
        export: function() {
            var visualization = vis_registry.getVisualization(this.get('selectedVisualization').get("visualizationName"));
            if (this.get('selectedFormat') === 'PNG') {
                visualization.export_as_PNG().then(function(pngURL) {
                    window.open(pngURL);
                });
            } else {
                var svgURL = visualization.export_as_SVG();
                window.open(svgURL);
            }
        },
        publish: function() {
            var visualization = vis_registry.getVisualization(this.get('selectedVisualization').get("visualizationName"));
            this.set('visualizationSVG', visualization.get_SVG());
        },
        save: function() {
            console.log("SAVE VISUALIZATION");
            // send actual visualization model to backend
            var selectedVisualization = this.get('selectedVisualization');
            console.dir(selectedVisualization);

            var configurationName = this.get('configName');

            // send current visualization configuration to backend
            console.log("The value is " + selectedVisualization.get('configurationName'));
            selectedVisualization.set('configurationName', configurationName);

            selectedVisualization.save().then(function() {
                console.log("SAVED SUCCESSFULLY");
            }, function(response) {
		if(response && response.status === 200) {
                    console.log("SAVED SUCCESSFULLY (but Ember didn't understand)");
                } else {
                    console.log("ERROR DURING SAVING");
                    console.log(response);
                }
            });
        },
        chooseVisualization: function(visualization) {
            this.set('selectedVisualization', visualization);
        },
        select: function() {
            console.log("CHANGE DATASELECTION");
            var selectedVisualization = this.get('selectedVisualization');
            var dataselectionID = selectedVisualization.get('dataselection').id;
            var datasourceID = selectedVisualization.get('dataselection.datasource').id;

            this.transitionToRoute('dataselection', dataselectionID, datasourceID);
        },
        toggle: function() {
            var toggled = this.get('isToggled');
            var controller = this;
            Ember.run(function(){
                if (toggled) {
                    controller.set('isToggled', false);
                } else {
                    controller.set('isToggled', true);

                }
            });

        }
    }
});

