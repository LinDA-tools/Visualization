App.DatasourceController = Ember.ObjectController.extend({
    treeContent: function() {
        var dataInfo = this.get('model'); // data sources
        if (!dataInfo || dataInfo.length === 0)
            return{};
        this.set('selectedDatasource', dataInfo);
        console.log('DATASOURCE');
        console.dir(dataInfo);
        return treeselection_data.initialize(dataInfo);
    }.property('model'),
    dataSelection: [],
    selectedDatasource: null,
    actions: {
        visualize: function() {
            var selection = this.get('dataSelection');
            var datasource = this.get('selectedDatasource');          
            var selected = treeselection_data.getDataSelection(selection, datasource);
            console.dir('FORMATTED DATA SELECTION');
            console.dir(selected);

            var self = this;
            var dataselection = this.store.createRecord('dataselection', selected);
            dataselection.save().then(function (responseDataselection) {
                console.log("Saved data selection. Transition to Visualization.");
                console.dir(responseDataselection);
                self.transitionToRoute('visualization', 'dataselection', responseDataselection.id);
            });
        }
    }
});
