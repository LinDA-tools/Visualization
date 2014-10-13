// TREE VIEW
App.TreeBranchComponent = Ember.Component.extend({
    tagName: 'ul',
    classNames: ['tree-branch'],
    children: function() {
        var node = this.get('node');
        console.log("Getting children for:");
        console.dir(node);

        if (node.getChildren) {
            return node.getChildren(node);
        } else {
            return [];
        }
    }.property('node')
});

App.TreeNodeComponent = Ember.Component.extend({
    tagName: 'li',
    classNames: ['tree-node'],
    init: function() {
        this._super();
        console.log("Creating TreeNode for:");
        console.dir(this.get("node"));

        console.log("expanded: " + this.get('node.expanded'));
        console.dir(this.get('node'));
        this.set('isExpanded', this.get('node.expanded') || false);
    },
    toggle: function() {
        var selection = this.get('node.selected');
        console.log('SELECTION: ', selection);
        this.toggleProperty('isExpanded');
    },
    refreshSelection: function() {
        var sel = this.get('node.selected');
        var list = this.get('selection');
        var node = this.get('node');
        if (sel) {
            list.pushObject(node);
        } else {
            list.removeObject(node);
        }
    }.observes('selected').on('init'),
    refreshExpansion: function() {
        var expanded = this.get('isExpanded');
        var list = this.get('expansion');
        var node = this.get('node');

        var children = node.children;
        console.log("EXPANSION --- CHILDREN OF NODE " + node.ID);
        console.dir(children);

        if (expanded) {
            list.setObjects(children);
        } 

    }.observes('node.children').on('init'),
    
    refreshExpansion2: function() {
        var expanded = this.get('isExpanded');
        var node = this.get('node');

        var children = node.children;
        console.log("EXPANSION --- CHILDREN OF NODE " + node.ID);
        console.dir(children);

        if (!expanded) {
            console.dir("Clearing table")
//            list.removeObjects(children);
            this.set('expansion', []);
        }

    }.observes('isExpanded'),
    dragStart: function(event) {
        if (!this.get('draggable')) {
            return;
        }

        event.stopPropagation();
        var data = this.get('node.data');
        console.log('DRAGGABLE DATA');
        console.dir(data);
        console.log('DRAGGABLE DATA - STRING');
        console.dir(JSON.stringify(data));
        event.dataTransfer.setData('text/plain', JSON.stringify(data));
        event.dataTransfer.effectAllowed = "copy";
    }
});