var dimension_data = function() {
    function create(dataselection) {
        console.log("Setting up tree for selection: ");
        console.dir(dataselection);
        var treeContent = Ember.Object.create({
            ID: '0000',
            label: 'ROOT',
            children: [],
            type: 'root',
            hasCheckbox: false,
            selected: false,
            getChildren: function(node) {
                return node.children;
            },
            data: {}
        });
        var datasource = dataselection.get('datasource');
        console.log("datasource");
        console.dir(datasource);
        var location = datasource.get('location');
        var format = datasource.get('format');
        var selectedClass = dataselection.get('selectedClass');
        console.log("selectedClass")
        console.dir(selectedClass)
        var propertypaths = dataselection.get('propertypaths');
        console.log("propertypaths");
        console.dir(propertypaths);

        var parent = [selectedClass.uri]

        for (var i = 0; i < propertypaths.length; i++) {
            var propertypath = propertypaths[i];
            treeContent.children.push(Ember.Object.create({
                ID: propertypath[0].uri,
                label: propertypath[0].label,
                draggable: "true",
                hasCheckbox: false,
                children: [],
                type: "item",
                isLeaf: true,
                getChildren: function(node) {
                    return [];
                },
                data: {
                    parent: parent,
                    id: propertypath[0].uri,
                    label: propertypath[0].label,
                    format: format,
                    location: location
                }
            }));
        }
        console.log("treeContent")

        return treeContent;
    }

    return {
        create: create
    };
}();