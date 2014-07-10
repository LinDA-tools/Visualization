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
    initialize: false,
    customize: false,
    selectedWidget: null,
    formats: ["PDF", "SVG", "PNG"],
    selectedFormat: "",
    exportedCode: "",
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
                    optionvalue: optionvalue,
                    classNames: "optionContainer",
                    childrenViews: [], // hier werden die childviews gespeichtert
                    pushObject: function(child) { // diese funktion pusht die childviews in das array
                        console.log("Pushed " + child.name + " into " + this.name)
                        this.childrenViews.push(child);
                    }
                });

                this.createOptionViews(optionvalue.options, view.childrenConfig, observer, view);
            } else {
                if (!config[option]) {

                    if (optionvalue.values) {
                        config[option] = optionvalue.values[0];
                    } else {
                        config[option] = "";
                    }
                }

                console.log("VALUES:" + optionvalue.values)
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
            case 'Map':
                return map;
        }
        return null;
    },
    actions: {
        configure: function(tool) { // select visualizations
            this.set('tool', tool);
            this.set('initialize', true);
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

            Ember.$('html,body').animate({
                scrollTop: $("#wf-init-vis").offset().top
            });
        },
        draw: function() {
            var selectedWidget = this.get('selectedWidget')
            var data = this.get('data');
            this.set('customize', true);
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
            
            var exportedCode='<svg width="600" height="400" aria-label="A chart." style="overflow: hidden;"><defs id="defs"><clipPath id="_ABSTRACT_RENDERER_ID_0"><rect x="115" y="77" width="371" height="247"></rect></clipPath></defs><rect x="0" y="0" width="600" height="400" stroke="none" stroke-width="0" fill="#ffffff"></rect><g><rect x="499" y="77" width="88" height="76" stroke="none" stroke-width="0" fill-opacity="0" fill="#ffffff"></rect><g><rect x="499" y="77" width="88" height="13" stroke="none" stroke-width="0" fill-opacity="0" fill="#ffffff"></rect><g><text text-anchor="start" x="517" y="88.05" font-family="Arial" font-size="13" stroke="none" stroke-width="0" fill="#222222">Austria</text></g><rect x="499" y="77" width="13" height="13" stroke="none" stroke-width="0" fill="#3366cc"></rect></g><g><rect x="499" y="98" width="88" height="13" stroke="none" stroke-width="0" fill-opacity="0" fill="#ffffff"></rect><g><text text-anchor="start" x="517" y="109.05" font-family="Arial" font-size="13" stroke="none" stroke-width="0" fill="#222222">Bulgaria</text></g><rect x="499" y="98" width="13" height="13" stroke="none" stroke-width="0" fill="#dc3912"></rect></g><g><rect x="499" y="119" width="88" height="13" stroke="none" stroke-width="0" fill-opacity="0" fill="#ffffff"></rect><g><text text-anchor="start" x="517" y="130.05" font-family="Arial" font-size="13" stroke="none" stroke-width="0" fill="#222222">Denmark</text></g><rect x="499" y="119" width="13" height="13" stroke="none" stroke-width="0" fill="#ff9900"></rect></g><g><rect x="499" y="140" width="88" height="13" stroke="none" stroke-width="0" fill-opacity="0" fill="#ffffff"></rect><g><text text-anchor="start" x="517" y="151.05" font-family="Arial" font-size="13" stroke="none" stroke-width="0" fill="#222222">Greece</text></g><rect x="499" y="140" width="13" height="13" stroke="none" stroke-width="0" fill="#109618"></rect></g></g><g><rect x="115" y="77" width="371" height="247" stroke="none" stroke-width="0" fill-opacity="0" fill="#ffffff"></rect><g clip-path="url(#_ABSTRACT_RENDERER_ID_0)"><g><rect x="115" y="77" width="1" height="247" stroke="none" stroke-width="0" fill="#cccccc"></rect><rect x="208" y="77" width="1" height="247" stroke="none" stroke-width="0" fill="#cccccc"></rect><rect x="300" y="77" width="1" height="247" stroke="none" stroke-width="0" fill="#cccccc"></rect><rect x="393" y="77" width="1" height="247" stroke="none" stroke-width="0" fill="#cccccc"></rect><rect x="485" y="77" width="1" height="247" stroke="none" stroke-width="0" fill="#cccccc"></rect><rect x="115" y="311" width="371" height="1" stroke="none" stroke-width="0" fill="#cccccc"></rect><rect x="115" y="257" width="371" height="1" stroke="none" stroke-width="0" fill="#cccccc"></rect><rect x="115" y="204" width="371" height="1" stroke="none" stroke-width="0" fill="#cccccc"></rect><rect x="115" y="151" width="371" height="1" stroke="none" stroke-width="0" fill="#cccccc"></rect><rect x="115" y="98" width="371" height="1" stroke="none" stroke-width="0" fill="#cccccc"></rect></g><g><rect x="116" y="291" width="246" height="5" stroke="none" stroke-width="0" fill="#3366cc"></rect><rect x="116" y="250" width="284" height="5" stroke="none" stroke-width="0" fill="#3366cc"></rect><rect x="116" y="209" width="291" height="5" stroke="none" stroke-width="0" fill="#3366cc"></rect><rect x="116" y="168" width="295" height="5" stroke="none" stroke-width="0" fill="#3366cc"></rect><rect x="116" y="127" width="363" height="5" stroke="none" stroke-width="0" fill="#3366cc"></rect><rect x="116" y="86" width="351" height="5" stroke="none" stroke-width="0" fill="#3366cc"></rect><rect x="116" y="297" width="73" height="5" stroke="none" stroke-width="0" fill="#dc3912"></rect><rect x="116" y="256" width="67" height="5" stroke="none" stroke-width="0" fill="#dc3912"></rect><rect x="116" y="215" width="80" height="5" stroke="none" stroke-width="0" fill="#dc3912"></rect><rect x="116" y="174" width="79" height="5" stroke="none" stroke-width="0" fill="#dc3912"></rect><rect x="116" y="133" width="72" height="5" stroke="none" stroke-width="0" fill="#dc3912"></rect><rect x="116" y="92" width="95" height="5" stroke="none" stroke-width="0" fill="#dc3912"></rect><rect x="116" y="303" width="184" height="5" stroke="none" stroke-width="0" fill="#ff9900"></rect><rect x="116" y="262" width="206" height="5" stroke="none" stroke-width="0" fill="#ff9900"></rect><rect x="116" y="221" width="183" height="5" stroke="none" stroke-width="0" fill="#ff9900"></rect><rect x="116" y="180" width="185" height="5" stroke="none" stroke-width="0" fill="#ff9900"></rect><rect x="116" y="139" width="180" height="5" stroke="none" stroke-width="0" fill="#ff9900"></rect><rect x="116" y="98" width="169" height="5" stroke="none" stroke-width="0" fill="#ff9900"></rect><rect x="116" y="309" width="184" height="5" stroke="none" stroke-width="0" fill="#109618"></rect><rect x="116" y="268" width="173" height="5" stroke="none" stroke-width="0" fill="#109618"></rect><rect x="116" y="227" width="171" height="5" stroke="none" stroke-width="0" fill="#109618"></rect><rect x="116" y="186" width="165" height="5" stroke="none" stroke-width="0" fill="#109618"></rect><rect x="116" y="145" width="199" height="5" stroke="none" stroke-width="0" fill="#109618"></rect><rect x="116" y="104" width="194" height="5" stroke="none" stroke-width="0" fill="#109618"></rect></g><g><rect x="115" y="77" width="1" height="247" stroke="none" stroke-width="0" fill="#333333"></rect><rect x="115" y="323" width="371" height="1" stroke="none" stroke-width="0" fill="#333333"></rect></g></g><g></g><g><g><text text-anchor="middle" x="115.5" y="343.05" font-family="Arial" font-size="13" stroke="none" stroke-width="0" fill="#444444">0</text></g><g><text text-anchor="middle" x="208" y="343.05" font-family="Arial" font-size="13" stroke="none" stroke-width="0" fill="#444444">500,000</text></g><g><text text-anchor="middle" x="300.5" y="343.05" font-family="Arial" font-size="13" stroke="none" stroke-width="0" fill="#444444">1,000,000</text></g><g><text text-anchor="middle" x="393" y="343.05" font-family="Arial" font-size="13" stroke="none" stroke-width="0" fill="#444444">1,500,000</text></g><g><text text-anchor="middle" x="485.5" y="343.05" font-family="Arial" font-size="13" stroke="none" stroke-width="0" fill="#444444">2,000,000</text></g><g><text text-anchor="end" x="102" y="315.7500000000019" font-family="Arial" font-size="13" stroke="none" stroke-width="0" fill="#444444">2,002.8</text></g><g><text text-anchor="end" x="102" y="262.45000000000374" font-family="Arial" font-size="13" stroke="none" stroke-width="0" fill="#444444">2,004.1</text></g><g><text text-anchor="end" x="102" y="209.14999999999628" font-family="Arial" font-size="13" stroke="none" stroke-width="0" fill="#444444">2,005.4</text></g><g><text text-anchor="end" x="102" y="155.84999999999815" font-family="Arial" font-size="13" stroke="none" stroke-width="0" fill="#444444">2,006.7</text></g><g><text text-anchor="end" x="102" y="102.55" font-family="Arial" font-size="13" stroke="none" stroke-width="0" fill="#444444">2,008.0</text></g></g></g><g></g></svg>';
            this.set('exportedCode', exportedCode);
            Ember.$('html,body').animate({
                scrollTop: $("#wf-customize-vis").offset().top
            });
        },
        export: function() {

        }
    }
});
