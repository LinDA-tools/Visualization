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
    needs: "application",
    applicationController: Ember.computed.alias("controllers.application"),
    tool: null,
    classInfo: [],
    selectedClass: null,
    dimensions: function() { // computed property; die wird den childviews übergeben
        var selectedClass = this.get('selectedClass');
        if (!selectedClass) {
            return [];
        }

        var properties = _.values(selectedClass.properties);
        console.dir("properties:");
        console.dir(properties);
        return properties;
    }.property('selectedClass'),
    q: null,
    initialize: false,
    customize: false,
    selectedWidget: null,
    formats: ["PDF", "SVG", "PNG"],
    selectedFormat: "",
    exportedCode: "",
    config: {},
    isSelectedClass: function(cls) {
        return (cls === this.get('selectedClass'));
    },
    createOptionViews: function(options, config, observer, container) {
        for (var option in options) {
            var optionvalue = options[option];
            var view;
            if (optionvalue.options) {
                if (!config[option]) {
                    config[option] = {};
                }

                view = Ember.View.create({
                    tagName: "li",
                    templateName: "vistemplates/" + optionvalue.template,
                    name: option,
                    parent: container,
                    childrenConfig: config[option],
                    label: optionvalue.label,
                    optionvalue: optionvalue,
                    classNames: "optionContainer",
                    childrenViews: [],
                    pushObject: function(child) {
                        console.log("Pushed " + child.name + " into " + this.name)
                        this.childrenViews.push(child);
                    }
                });
                this.createOptionViews(optionvalue.options, config[option], observer, view);
            } else {
                if (!config[option]) {
                    if (optionvalue.values) {
                        config[option] = optionvalue.values[0];
                    } else if (optionvalue.template === 'multidimensionGrouped' || optionvalue.template === 'multidimension') {
                        config[option] = {};
                    } else {
                        config[option] = "";
                    }
                }

                var view = Ember.View.extend({
                    tagName: "li",
                    templateName: "vistemplates/" + optionvalue.template,
                    name: option,
                    values: optionvalue.values,
                    label: optionvalue.label,
                    optionvalue: optionvalue,
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
    getQueryOptions: function(options, config, map) {
        for (var option in options) {
            var optionvalue = options[option];
            console.dir(optionvalue.template);
            console.dir(config);
            console.log(option);
            console.log(config[option]);
            if (optionvalue.template === "multidimensionGrouped") {
                // aus der config wird das was unter der structure otpion gespeichert ist rausgeholt
                map.multidimension = {
                    key: option,
                    property: config[option].cube,
                    index: optionvalue.index
                }; //Array (property uri+label+axis)
                var group = config[option].group;
                if (group) {
                    map.group = {
                        key: option,
                        property: group,
                        index: optionvalue.index
                    }
                }
            }

            if (optionvalue.template === "dimension") {
                map.dimension.push({
                    key: option,
                    property: config[option],
                    index: optionvalue.index
                });
            }

            if (optionvalue.options) {
                var result = this.getQueryOptions(optionvalue.options, config[option], map);
            }

        }
        return map;
    },
    actions: {
        configure: function(tool) {
            this.set('tool', tool);
            this.set('initialize', true);
            var applicationController = this.get('applicationController');
            var ds = applicationController.get('selectedSource');

            var selectedWidget = this.getWidget(tool.name);
            this.set('selectedWidget', selectedWidget);


            console.log(tool.name, ds);
            console.log("FORMAT: " + ds.get('format'));

            var module = this.getDataModule(ds);
            console.log("MODULE");
            console.dir(module);

            var c = this;
            var options = null;

            // CSV
            if (ds.get('format') === 'csv') {
                options = selectedWidget.structureOptionsCSV;
                if (!options) {
                    options = selectedWidget.structureOptions;
                }

                module.read(ds.get("location")).then(function(data) {
                    var inputdata = module.parse(data);
                    var dimensions = module.dimensions(inputdata);

                    console.dir(inputdata);
                    console.dir(dimensions);

                    c.set('classInfo', inputdata);
                    c.set('dimensions', dimensions);
                });

                //RDF
            } else if (ds.get('format') === 'sparql') {
                options = selectedWidget.structureOptionsRDF;
                if (!options) {
                    options = selectedWidget.structureOptions;
                }

                module.read(ds.get("location")).then(function(classInfo) {
                    console.dir(classInfo);

                    c.set('classInfo', classInfo); //array
                });

            }

            var config = this.get('config');
            var observer = function() {
                console.log("setting " + this.get('name') + " to: ");
                console.dir(this.get('content'));
                var parent = this.get('parent');
                var childrenConfig = parent.childrenConfig;
                childrenConfig[this.get('name')] = this.get('content');
            };

            var container = Ember.View.views['structureOptionsView'];
            container.clear();
            container.childrenConfig = config;

            this.createOptionViews(options, config, observer, container);

            Ember.$('html,body').animate({
                scrollTop: $("#wf-init-vis").offset().top
            });
        },
        selectClass: function(selectedClass) {
            this.set('selectedClass', selectedClass); // ändert die computed property dimension
        },
        draw: function() {
            var selectedWidget = this.get('selectedWidget')
            var data = this.get('classInfo');
            this.set('customize', true);
            var config = this.get('config');
            var divId = 'visualization';
            var applicationController = this.get('applicationController');
            var ds = applicationController.get('selectedSource');
            var selectedClass = this.get('selectedClass');
            var module = this.getDataModule(ds);
            var c = this;
            console.log("MODULE");
            console.dir(module);

            // CSV
            if (ds.get('format') === 'csv') {
                if (config.axis && config.axis.yAxis) {
                    c.set('groupInstances', config.axis.yAxis.multiAxis);
                } else {
                    c.set('groupInstances', []);
                }

                selectedWidget.initialize(data, divId);
                selectedWidget.draw(config);

            } else if (ds.get('format') === 'sparql') {
                // durchlaufe structure options von widget
                var options = selectedWidget.structureOptionsRDF;
                var queryOptions = {
                    dimension: []
                };

                this.getQueryOptions(options, config, queryOptions);

                module.parse(ds.get("location"), selectedClass, queryOptions).then(function(visInput) {
                    //c.set('groupInstances', config.groupInstances);
                    c.set('groupInstances', []);

                    selectedWidget.initialize(visInput, divId);
                    selectedWidget.drawRDF();
                }, function(error) {
                    console.log(error);
                });
            }


            var options = selectedWidget.tuningOptions;

            var observer = function() {
                var parent = this.get('parent');
                var childrenConfig = parent.childrenConfig;
                childrenConfig[this.get('name')] = this.get('content');
                selectedWidget.tune(config);
            };


            var container = Ember.View.views['tuningOptionsView']
            container.clear();
            container.childrenConfig = config;
            this.createOptionViews(options, config, observer, container);

            var exportedCode = '';
            this.set('exportedCode', exportedCode);
            Ember.$('html,body').animate({
                scrollTop: $("#wf-customize-vis").offset().top
            });
        },
        export: function() {

        }
    }
});
