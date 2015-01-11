App.VisualizationOptionsView = Ember.ContainerView.extend({
    options: null, // structure or layout options
    config: null, // visualization configuration
    tagName: "ul",
    children: function () {
        this.clear();

        var options = this.get('options');
        var configArray = this.get('config');

        if ((configArray === null) || (options === null)) {
            return;
        }

        console.log("Creating visualization configuration view...");
        console.log('Structure options: ');
        console.dir(options);
        console.log('Visualization configuration: ');

        // Ensures that config changes are only propagated when endPropertyChanges is called, i.e. after the for loop
        configArray.beginPropertyChanges();

        try {
            var optionNames = Object.getOwnPropertyNames(options);
            for (var i = 0; i < optionNames.length; i++) {

                var optionName = optionNames[i];
                console.log('Option name: ');
                console.dir(optionName);

                var optionTemplate = options[optionName];
                console.log('Option template: ');
                console.dir(optionTemplate);
                console.dir(optionTemplate.value);

                var view = Ember.View.extend({
                    tagName: "li",
                    templateName: "vistemplates/" +
                            optionTemplate.template,
                    name: optionName,
                    label: optionTemplate.label,
                    content: optionTemplate.value,
                    metadata: optionTemplate.metadata ? optionTemplate.metadata.types : "",
                    maxCardinality: optionTemplate.maxCardinality,
                    contentObserver: function () {
                        var content = this.get('content');
                        var name = this.get('name');
                        console.log("Changed option " + name + ":");
                        console.dir(content);


                        var configMap = configArray[0];
                        configMap[name] = content;
                        configArray.setObjects([configMap]);
                        optionTemplate.value = content;
                    }.observes('content.@each').on('init')
                }).create();
                this.pushObject(view);
            }
        } finally {
            // Inside finally block to make sure that this is executed even if the for loop crashes
            configArray.endPropertyChanges();
        }
    }.observes('options').on('init')
});