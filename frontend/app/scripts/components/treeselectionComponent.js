App.TreeSelectionComponent = Ember.Component.extend({
    tagName: 'div',
    tree: null,
    setContent: function() {
        console.log("TREE SELECTION COMPONENT - CREATING SELECTION TREE");
        var content = this.get('treedata');
        var selection = this.get('selection');
        var self = this;

        $(this.get('element')).fancytree({
            extensions: ["filter"],
            source: content,
            checkbox: true,
            selectMode: 3,
            filter: {
                mode: "dimm",
                autoApply: true
            },
            lazyLoad: function(event, data) {
                console.log("TREE SELECTION COMPONENT - LOADING CHILDREN");
                console.log("DATA");
                console.dir(data);
                var node = data.node;
                var node_path = self.getNodePath(node).path;

                data.result = data.node.data._children.loadChildren(node_path);
            },
            select: function(event, data) {
                console.log("TREE SELECTION COMPONENT - GENERATING PREVIEWS");
                var tree = data.tree;
                var node = data.node;
                var branch_root = self.getBranchRoot(node);
                var branch_root_title = branch_root.title;

                console.log('NODE');
                console.dir(node);

                if (node.selected) {
                    tree.filterBranches(function(node) {
                        if (node.title === branch_root_title) {
                            return true;
                        } else {
                            node.hideCheckbox = true;
                            node.render(true);
                        }
                    });

                    var selected = tree.getSelectedNodes();

                    for (var i = 0; i < selected.length; i++) {
                        var node_ = selected[i];
                        var node_path = self.getNodePath(node_).path.reverse();
                        var path_labels = self.getNodePath(node_).path_with_labels.reverse();
                        var node_label = node_.title;
                        var node_key = node_.key;
                        var node_type = node_.data.type;

                        var already_selected = _.some(selection, function(value) {
                            return _.isEqual(value.parent, node_path);
                        });

                        if (!already_selected
                                && (node_.hideCheckbox === false)
                                && (node_type !== 'Class')) {

                            selection.pushObject(
                                    {
                                        label: node_label,
                                        key: node_key,
                                        type: node_type,
                                        parent: node_path,
                                        parent_labels: path_labels
                                    }
                            );
                        }
                    }
                } else {
                    var selected = tree.getSelectedNodes();
                    selection = _.filter(selection, function(item) {

                        var is_selected = false;

                        for (var i = 0; i < selected.length; i++) {
                            var node_ = selected[i];
                            var node_path = self.getNodePath(node_).path.reverse();

                            if (!is_selected) {
                                is_selected = _.isEqual(item.parent, node_path);
                            }
                        }

                        return is_selected;
                    });

                    if (selected.length === 0) {
                        tree.clearFilter();
                        tree.visit(function(node) {
                            var type = node.data.type;
                            node.hideCheckbox = self.showCheckbox(type);
                            node.render(true);
                        });
                    }
                }

                console.log('DATA SELECTION');
                console.dir(selection);

                self.set('selection', selection);
            }
        });
    }.observes('treedata').on('didInsertElement'),
    getNodePath: function(node) {
        var node_path_with_labels = [];
        var node_path = [];

        node_path.push(node.key);
        node_path_with_labels.push({id: node.key, label: node.title});

        while (node.parent !== null) {
            node_path.push(node.parent.key);
            node_path_with_labels.push({id: node.parent.key, label: node.parent.title});
            node = node.parent;
        }

        node_path.pop(); // root id is not relevant
        node_path_with_labels.pop();

        return {path: node_path, path_with_labels: node_path_with_labels};
    },
    getBranchRoot: function(node) {
        while (node.parent.key !== "root_1") {
            node = node.parent;
        }
        return node;
    },
    showCheckbox: function(type) {
        switch (type) {
            case "Quantitative":
                return false;
            case "Interval":
                return false;
            case "Categorical":
            case "Nominal":
                return false;
            case "Class":
                return false;
            case "Resource":
            case "Nothing":
                return true;
        }
        return null;
    }
});  