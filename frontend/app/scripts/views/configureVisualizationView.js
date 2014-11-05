App.ConfigureVisualizationView = Ember.ContainerView.extend({
    tagName: "ul",
    children: function() {
        this.clear();
        var mapping = this.get('mapping');
        console.log("Creating configuration views:");
        console.dir(mapping);
        var configArray = this.get('visualizationConfiguration');
        
        var optionNames = Object.getOwnPropertyNames(mapping);
        for (var i = 0; i < optionNames.length; i++) {
            var optionName = optionNames[i];
            var optionTemplate = mapping[optionName];
            var view = Ember.View.extend({
                tagName: "li",
                templateName: "vistemplates/" + 
                        optionTemplate.template,
                name: optionName,
                label: optionTemplate.label,
                content: optionTemplate.value,
                metadata: optionTemplate.metadata,
                contentObserver: function() {
                    var content = this.get('content');
                    console.log("Changed option " + optionName + ":");
                    console.dir(content);
                    
                    var configMap = configArray[0];
                    var content = this.get('content');
                    configMap[optionName] = content;
                    configArray.setObjects([configMap]);
                }.observes('content.@each').on('init')
            }).create();
            this.pushObject(view);
        }
    }.observes('mapping').on('init')
});