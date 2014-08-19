App.ApplicationController = Ember.ArrayController.extend({
    itemController: 'datasource',
    addSource: false,
    selectedSource: null,
    actions: {
        show: function() {
            this.set('addSource', true);
        },
        hide: function() {
            this.set('addSource', false);
        },
        showHub: function() {
            this.set('addHub', true);
        },
        hideHub: function() {
            this.set('addHub', false);
        },
        addHub: function() {
            var name = this.get('name');
            var url = this.get('url');
            var datahub = this.store.createRecord('datahub', {
                name: name,
                url: url
            });

            this.set('name', '');
            this.set('url', '');

            datahub.save();
        },
        add: function() {
            var name = this.get('name');
            var uri = this.get('uri');
            var graph = this.get('graph');
            var datasource = this.store.createRecord('datasource', {
                name: name,
                endpoint: uri,
                graph: graph
            });

            this.set('name', '');
            this.set('uri', '');
            this.set('graph', '');

            datasource.save();
        },
        select: function(ds) {
            this.set('selectedSource', ds);
            this.transitionToRoute('visualization', ds.id);
        }
    }
});

App.DatasourceController = Ember.ObjectController.extend({});

App.VisualizationController = Ember.ArrayController.extend({
    needs: ["application"],
    applicationController: Ember.computed.alias("controllers.application"),
    dataInfo: {},
    dataSubset: null,
    dimensions: function() { // computed property; die wird den childviews übergeben      
        var dataSubset = this.get('dataSubset');
        if (!dataSubset) {
            return [];
        }

        var properties = _.values(dataSubset.properties);
        console.log("CHANGED PROPERTIES");
        console.dir(propertdataInfoies);
        return properties;
    }.property('dataSubset'),
    q: null,
    visualisationWidget: null,
    visualisationContainer: "visualisation", // div, visualisation.hbs
    visualisationConfiguration: {},
    createOptionViews: function(options, visualisationConfiguration, observer, container) {
        console.log("### CREATE VISUALISATION CONFIGURATION VIEW");
        console.log('OPTIONS');
        console.dir(options);

        for (var optionName in options) {
            var option = options[optionName];
            var view;

            console.log('OPTION NAME: ' + optionName);
            console.log('OPTION MAP');
            console.dir(option);

            if (!visualisationConfiguration[optionName]) {
                visualisationConfiguration[optionName] = this.getOptionDefaultValue(option);
            }

            if (option.suboptions) {
                view = Ember.View.create({
                    tagName: "li",
                    templateName: "vistemplates/" + option.template,
                    name: optionName,
                    parent: container,
                    childrenConfig: visualisationConfiguration[optionName],
                    label: option.label,
                    optionvalue: option,
                    classNames: "optionContainer",
                    childrenViews: [],
                    pushObject: function(child) {
                        console.log("Pushed " + child.name + " into " + this.name)
                        this.childrenViews.push(child);
                    }
                });
                this.createOptionViews(option.suboptions, visualisationConfiguration[optionName], observer, view);
            } else {
                var view = Ember.View.extend({
                    tagName: "li",
                    templateName: "vistemplates/" + option.template,
                    name: optionName,
                    values: option.values,
                    label: option.label,
                    optionvalue: option,
                    parent: container,
                    content: visualisationConfiguration[optionName], // initial value; later user input
                    contentObserver: observer.observes('content')
                }).create();
            }
            container.pushObject(view);
        }
        console.log("###########");
    },
    getOptionDefaultValue: function(option) {
        switch (option.template) {
            case 'treeView':
            case 'box':
                return {};
            case 'area':
                return [];
            case 'selectField':
                return option.values[0];
            default:
                return "";
        }
    },
    getWidget: function(widgetName) {
        switch (widgetName) {
            case 'Bar Chart':
                return barchart;
            case 'Column Chart':
                return columnchart;
            case 'Line Chart':
                return linechart;
            case 'Area Chart':
                return areachart;
            case 'Pie Chart':
                return piechart;
            case 'Bubble Chart':
                return bubblechart;
            case 'Scatter Chart':
                return scatterchart;
            case 'Map Chart':
                return mapchart;
            case 'Map (OpenStreetMap)':
                return map;
        }
        return null;
    },
    getDataModule: function(datasource) {
        switch (datasource.get('format')) {
            case 'csv':
                return csv_data_module;
            case 'sparql':
                return sparql_data_module;
        }
        return null;
    },
    treeContent: {},
    actions: {
        configure: function(selection) {
            console.log("### CONFIGURE VISUALISATION")

            var controller = this;
            var visualisationConfiguration = this.get('visualisationConfiguration');

            var applicationController = this.get('applicationController');
            var dataset = applicationController.get('selectedSource');
            console.log("SELECTED DATASOURCE");
            console.dir(dataset);
            console.log("FORMAT");
            console.log(dataset.get('format'));
            console.log("LOCATION");
            console.log(dataset.get('location'));

            var visualisationWidget = this.getWidget(selection.name);
            this.set('visualisationWidget', visualisationWidget);
            console.log("SELECTED WIDGET");
            console.dir(visualisationWidget);

            var module = this.getDataModule(dataset);
            console.log("MODULE");
            console.dir(module);
            visualisationConfiguration.dataModule = module;

            var l = visualisationWidget.structureOptions;
            console.log("OPTIONS");
            console.dir(l);

            module.read(dataset.get("location")).then(function(datasourceInfo) {
                var dataInfo = datasourceInfo.dataInfo;
                controller.set('treeContent', tree_data.create(dataInfo));

                visualisationConfiguration.datasourceInfo = datasourceInfo; // TODO: vielleicht reicht ja das data module
            });

            var observer = function() {
                console.log("CONFIG VIS OBSERVER");
                console.log("setting " + this.get('name') + " to: ");
                var parent = this.get('parent');
                var childrenConfig = parent.childrenConfig;
                childrenConfig[this.get('name')] = this.get('content');
                console.log("USER SELECTION");
                console.dir(this.get('content'));
                console.log("CHILDREN CONFIG");
                console.dir(childrenConfig);
            };

            var container = Ember.View.views['structureOptionsView'];
            container.clear();
            container.childrenConfig = visualisationConfiguration;

            this.createOptionViews(l, visualisationConfiguration, observer, container);

            console.log("###########");
        },
        draw: function() {
            console.log("### DRAW VISUALISATION");
            var visualisationWidget = this.get('visualisationWidget');
            var visualisationConfiguration = this.get('visualisationConfiguration');
            var visualisationContainer = this.get('visualisationContainer');

            console.log('SUBSET DRAW');
            console.dir(this.get('dataSubset'));
            visualisationConfiguration.selectedSubset = this.get('dataSubset');

            visualisationWidget.draw(visualisationConfiguration, visualisationContainer);

            var options = visualisationWidget.tuningOptions;

            var observer = function() {
                console.log("OBSERVER - TUNE");
                console.log("setting " + this.get('name') + " to: ");
                console.dir(this.get('content'));
                var parent = this.get('parent');
                var childrenConfig = parent.childrenConfig;
                childrenConfig[this.get('name')] = this.get('content');
                visualisationWidget.tune(visualisationConfiguration);
                console.log("CHILDREN CONFIG");
                console.dir(childrenConfig);
            };

            var container = Ember.View.views['tuningOptionsView'];
            container.clear();
            container.childrenConfig = visualisationConfiguration;
            this.createOptionViews(options, visualisationConfiguration, observer, container);

            console.log("###########");
        }
    }
});
