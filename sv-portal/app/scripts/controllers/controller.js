
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
    createOptionViews: function(options, config, observer) {
        var container = Ember.View.views['optionsView']
        container.clear();
        for (var i = options.length - 1; i >= 0; i--) {
            var option = options[i];
            var view = Ember.View.extend({
                templateName: "vistemplates/" + option.template,
                name: option.name,
                content: config[option.name],
                contentObserver: observer.observes('content')
            }).create()
            container.pushObject(view);
        }
    },
    getWidget: function(toolName) {
        switch (toolName) {
            case 'Bar Chart':
                return barchart;
            case 'Column Chart':
                return columnchart;
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

            console.log('SWITCH')
            console.log(tool.name)

            var selectedWidget = this.getWidget(tool.name);
            this.set('selectedWidget', selectedWidget);

            var options = selectedWidget.structureOptions;
            var config = this.get('config');
            var observer = function() {
                config[this.get('name')] = this.get('content');
            }

            this.createOptionViews(options, config, observer);
        },
        draw: function() {
            var selectedWidget = this.get('selectedWidget')
            var data = this.get('data');
            var config = this.get('config');

            console.log('doDraw');
            console.dir(config);

            var divId = 'visualization';
            selectedWidget.initialize(data, divId);
            selectedWidget.draw(config);

            var options = selectedWidget.tuningOptions;
            var observer = function() {
                config[this.get('name')] = this.get('content');
                selectedWidget.tune(config);
            }
            this.createOptionViews(options, config, observer);
        }
    }
});
