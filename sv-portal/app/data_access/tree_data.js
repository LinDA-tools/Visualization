var tree_data = function() {
    // first level: csv dummy or classes second ... n level: class properties or columns
    // iterate over subsets (in case of csv is just one subset; in case of RDF the subset are the classes        
    function create(dataInfo) {
        console.log("CREATING TREE CONTENT");
        console.dir(dataInfo);

        var treeContent = {
            ID: '0000',
            label: 'ROOT',
            children: []
        };


        for (var i in dataInfo) { // iterate over subset IDs (=keys)
            var subset = dataInfo[i];
            console.log("SUBSET: " + i);
            console.dir(subset);

            var parent = [];

            treeContent.children.push({
                ID: subset.id,
                label: subset.label,
                children: (subset.properties ? branch(subset.properties, parent.concat([subset.id]), []) : [])
            });
        }

        console.log("TREE DATA");
        console.dir(treeContent);

        return treeContent;
    }

    function branch(properties, parent, children) {
        console.log('BRANCH');
        console.dir(children);

        for (var i = 0; i < properties.length; i++) {
            var property = properties[i];
            children.push({
                ID: property.id,
                label: property.label,
                draggable: {
                    parent: parent,
                    id: property.id,
                    label: property.label
                },
                children: (property.properties ? branch(property.properties, parent.concat([property.id]), []) : [])
            });
        }

        return children;
    }

    return {
        create: create
    };
}();

