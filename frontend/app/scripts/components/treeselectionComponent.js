App.TreeSelectionComponent = Ember.Component.extend({
    tagName: 'div',
    tree: null,
    setContent: function() {
        console.log("TREE SELECTION COMPONENT - CREATING SELECTION TREE");
        var content = this.get('treedata');
        var selection = this.get('selection');
        var self = this;

        $(this.get('element')).fancytree({
            source: content,
            checkbox: true,
            selectMode: 3,
            lazyLoad: function(event, data) {
                console.log("TREE SELECTION COMPONENT - LOADING CHILDREN");
                var node = data.node;
                var node_path = self.getNodePath(node);

                data.result = data.node.data._children.loadChildren(node_path);
            },
            select: function(event, data) {
                console.log("TREE SELECTION COMPONENT - GENERATING PREVIEWS");
                var node = data.node;
                var node_path = self.getNodePath(node);
                var node_label = node.title;

                console.log('SELECTION BEFORE');
                console.dir(selection);
                
                if (node.selected) {
                    selection.pushObject({label: node_label, parent: node_path.reverse()});
                } else {
                    selection = _.filter(selection, function(item) {
                        return item.label !== node_label;
                    });
                }
                
                console.log('SELECTION AFTER');
                console.log(selection);
                
                self.set('selection', selection);
            }
        });
    }.observes('treedata').on('didInsertElement'),
    getNodePath: function(node) {
        var node_path = [];
        node_path.push(node.key);

        while (node.parent !== null) {
            node_path.push(node.parent.key);
            node = node.parent;
        }

        node_path.pop(); // root id is not relevant
        return node_path;
    }
});  