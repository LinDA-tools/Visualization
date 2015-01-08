App.TreeSelectionComponent = Ember.Component.extend({
    tagName: 'div',
    content: [],
    tree: null,
    setContent: function() {
        console.log("TREE SELECTION COMPONENT");
        var content = this.get('treedata');

        $(this.get('element')).fancytree({
            source: content,
            checkbox: true,
            lazyLoad: function(event, data) {
                console.log("DATA");
                console.dir(data);

                var node = data.node;
                var node_path = [];
             
                node_path.push(node.key);

                while (node.parent !== null) {
                    var parent = node.parent;
                    var key = parent.key;
                    node_path.push(key);
                    node = parent;
                }

                node_path.pop(); // root id is not relevant

                data.result = data.node.data._children.loadChildren(node_path);
            }  
        });
    }.observes('treedata').on('didInsertElement')
});   