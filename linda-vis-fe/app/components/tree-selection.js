import Ember from "ember";

/* global _ */
/*jshint loopfunc: true */
export default Ember.Component.extend({
    tagName: 'div',
    tree: null,
    setContent: function() {
        console.log("TREE SELECTION COMPONENT - CREATING SELECTION TREE");
        var content = this.get('treedata');
        var selection = this.get('selection');
        console.dir(JSON.stringify(selection));

        //selection = []; todo needs to be reset
        this.set('selection', selection);

        var self = this;

        this.$(this.get('element')).fancytree({
            extensions: ["filter", "glyph", "edit", "wide"],
            source: content,
            checkbox: true,
            icons:false,
            selectMode: 3,
            glyph: {
                map: {               
                    checkbox: "glyphicon glyphicon-unchecked",
                    checkboxSelected: "glyphicon glyphicon-check",
                    checkboxUnknown: "glyphicon glyphicon-share",
                    error: "glyphicon glyphicon-warning-sign",
                    expanderClosed: "glyphicon glyphicon-plus-sign",
                    expanderLazy: "glyphicon glyphicon-plus-sign",
                    expanderOpen: "glyphicon glyphicon-minus-sign",
                    loading: "glyphicon glyphicon-refresh"
                }
            },
            wide: {
                iconWidth: "0.3em", 
                iconSpacing: "0.5em", 
                levelOfs: "1.5em"
            },
            filter: {
                mode: "dimm",
                autoApply: true
            },
            lazyLoad: function(event, data) {
                console.log("TREE SELECTION COMPONENT - LOADING CHILDREN");
                console.log("DATA");
                console.dir(data);
                var node = data.node;
                var node_path = self.getNodePath(node);

                data.result = data.node.data._children.loadChildren(node_path.slice().reverse());
            },
            select: function(event, data) {
                console.log("TREE SELECTION COMPONENT - GENERATING PREVIEWS");
                var tree = data.tree;
                var node = data.node;
                var branch_root = self.getBranchRoot(node);
                var branch_root_title = branch_root.title;
                var selected = tree.getSelectedNodes();
              
                if (node.selected) {
                    tree.filterBranches(function(node) {
                        if (node.title === branch_root_title) {
                            return true;
                        } else {
                            node.hideCheckbox = true;
                            node.render(true);
                        }
                    });              

                    for (var i = 0; i < selected.length; i++) {
                        var node_ = selected[i];
                        var node_path = self.getNodePath(node_).slice().reverse();
                        var path_labels = self.getNodePath(node_).slice().reverse();
                        var node_label = node_.title;
                        var node_key = node_.key;
                        var node_type = node_.data.type;
                        var node_role = node_.data.role;
                        var node_datatype = node_.data.datatype;

                        var already_selected = _.some(selection, function(value) {
                            return _.isEqual(value.parent, node_path);
                        });

                        if (!already_selected && (node_.hideCheckbox === false) && (node_type !== 'Class')) {

                            selection.pushObject(
                                    {
                                        label: node_label,
                                        key: node_key,
                                        type: node_type,
                                        role: node_role,
                                        parent: path_labels,
                                        datatype:node_datatype
                                    }
                            );
                        }
                    }
                } else {
                   
                    selection = _.filter(selection, function(item) {

                        var is_selected = false;

                        for (var i = 0; i < selected.length; i++) {
                            var node_ = selected[i];
                            var node_path = self.getNodePath(node_).slice().reverse();

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
                            node.hideCheckbox = self.hideCheckbox(type);
                            node.render(true);
                        });
                    }
                }

                self.set('selection', selection);
            }
        });
    }.observes('treedata').on('didInsertElement'),
    getNodePath: function(node) {
        var node_path_with_labels = [];
        node_path_with_labels.push({id: node.key, label: node.title});

        while (node.parent !== null) {
            node_path_with_labels.push({id: node.parent.key, label: node.parent.title});
            node = node.parent;
        }

        node_path_with_labels.pop();

        return  node_path_with_labels;
    },
    getBranchRoot: function(node) {
        while (node.parent.title !== "root") {
            node = node.parent;
        }
        return node;
    },
    hideCheckbox: function(type) {
        switch (record) {
            case "Ratio":
            case "Interval":
            case "Nominal":
            case "Angular":
            case "Geographic Latitude":
            case "Geographic Longitude":
            case "Class":
                return false;
            case "Resource":
            case "Nothing":
                return true;
        }
        console.error("Unknown category: '" + type + "'");
        return null;
    }
});
