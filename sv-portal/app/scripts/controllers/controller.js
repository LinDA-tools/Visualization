
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
            console.log("SELECTFUNCT");
            console.dir(ds);
            this.set('selectedSource', ds);
            this.transitionToRoute('visualization', ds.id);
        }
    }
});

App.DatasourceController = Ember.ObjectController.extend({
});

App.VisualizationController = Ember.ArrayController.extend({
    needs: "application",
    applicationController: Ember.computed.alias("controllers.application"),
    tool: null,
    dimensions: null,
    data: null,
    isSelected: false,
    selectedWidget: null,
    config: {},
    createView: function(key, value, config, observer) {
        if (value.options) {
            for (var o in value.options) {
                console.log("value.options");
                console.log(value.options[o]);
                this.createView(o, value.options[o], config, observer);
            }
        }
    },
    createOptionViews: function(options, config, observer, container) {
        /*
         * This function creates from a (hierarchical) list of options a 
         * hierarchy of configuration views. Each container view has
         * a configuration map consisting of it's child options' values.
         * The configuration maps are initialized when the configuration views 
         * are built from the option lists. The values of the child maps are set
         * by the observer which is called from their child view.
         * A container view can be considered as a parent of a child view, e.g.
         * vAxis is a parent of gridLine etc. 
         * All configuration maps together constitute the global config.
         */
        // (e.g. hAxis, gridLines). 
        for (var option in options) {
            var optionvalue = options[option];
            var view;
            if (optionvalue.options) { // gruppe: verwendet ein bestimmtes template. das template ermöglicht es darin andere views anzuhängen. Es würde eine containerview ersetzen. Containerviews lassen sich nicht stylen aber dieses template schon.
                if (!config[option]) {
                    config[option] = {};
                }

                view = Ember.View.create({
                    tagName: "ul",
                    templateName: "vistemplates/" + optionvalue.template,
                    name: option,
                    parent: container,
                    childrenConfig: config[option],
                    label: optionvalue.label,
                    classNames: "optionContainer",
                    childrenViews: [], // hier werden die childviews gespeichtert
                    pushObject: function(child) { // diese funktion pusht die childviews in das array
                        console.log("Pushed " + child.name + " into " + this.name);
                        this.childrenViews.push(child);
                    }
                });
                
                this.createOptionViews(optionvalue.options, view.childrenConfig, observer, view);
            } else {
                if (!config[option]) {
                    config[option] = "";
                }
                var view = Ember.View.extend({
                    tagName: "li",
                    templateName: "vistemplates/" + optionvalue.template,
                    name: option,
                    label: optionvalue.label,
                    parent: container,
                    content: config[option],
                    contentObserver: observer.observes('content')
                }).create();
            }
            container.pushObject(view);
        }
    },
    getWidget: function(toolName) {
        switch (toolName) {
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
            case 'Map':
                return map;
        }
        return null;
    },
    actions: {
        configure: function(tool) { // select visualizations
            this.set('tool', tool);
            this.set('isSelected', true);
            var applicationController = this.get('applicationController');
            var ds = applicationController.get('selectedSource');
            console.log(tool.name);
            var c = this;
            $.get(ds._data.location, function(csvString) {
                var arrayData = $.csv.toArrays(csvString, {onParseValue: $.csv.hooks.castToScalar});
                c.set('data', arrayData);
                var names = arrayData[0];
                var dimensions = [];
                for (var i = 0; i < names.length; i++) {
                    var dimension = {};
                    dimension.id = i;
                    dimension.name = names[i];
                    dimensions.push(dimension);
                }
                c.set('dimensions', dimensions);
            });

            var selectedWidget = this.getWidget(tool.name);
            this.set('selectedWidget', selectedWidget);

            var options = selectedWidget.structureOptions;
            var config = this.get('config');
            var observer = function() {
                config[this.get('name')] = this.get('content');
            };

            var container = Ember.View.views['structureOptionsView'];
            container.clear();

            this.createOptionViews(options, config, observer, container);
        },
        draw: function() {
            var selectedWidget = this.get('selectedWidget')
            var data = this.get('data');
            var config = this.get('config');
            var divId = 'visualization';

            selectedWidget.initialize(data, divId);
            selectedWidget.draw(config);

            var options = selectedWidget.tuningOptions;

            // name and content are from the view
            var observer = function() {
                var parent = this.get('parent');
                var childrenConfig = this.get('parent').childrenConfig;
                // Key of the child view/configuration  
                // e.g. number for gridLines (this.get('name')="number")
                childrenConfig[this.get('name')] = this.get('content');
                selectedWidget.tune(config);
            };

            var container = Ember.View.views['tuningOptionsView']
            container.clear();
            container.childrenConfig = config;
            this.createOptionViews(options, config, observer, container);
        }
    }
});
