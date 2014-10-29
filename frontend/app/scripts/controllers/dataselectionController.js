App.DataselectionController = Ember.ArrayController.extend({
    itemController: 'datasource',
    treeContent: function() {
        var dataInfo = this.get('model'); // data sources

        if (!dataInfo || dataInfo.length === 0)
            return{};

        console.log("dataInfo");
        console.dir(dataInfo);

        return tree_data.create(dataInfo);
    }.property('model'),
    tableContent: [],
    dataselection: [],
    selectedDatasource: null,
    selectedClass: null,
    selectedPaths: [],
    actions: {
        visualize: function() {
            var self = this;
            var dataselection = this.store.createRecord('dataselection', {
                // This will be used to store the selection
            });
            dataselection.save().then(function(responseDataselection) {
                console.log("Saved selection. Transition to Visualization.");
                console.dir(responseDataselection);
                self.transitionToRoute('visualization', responseDataselection.id)
            });
        }
    }
});

App.DatasourceController = Ember.ObjectController.extend({});
