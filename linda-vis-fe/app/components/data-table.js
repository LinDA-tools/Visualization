import Ember from "ember";
import table_data_module from "../utils/table-data-module";

export default Ember.Component.extend({
    tagName: 'table',
    list: [],
    columns: [],
    classNames: ['no-wrap'],
    table: null,
    setContent: function() {
        console.log("TABLE COMPONENT - GENERATING PREVIEW");

        var self = this;
        var selection = this.get('preview');
        var datasource = this.get('datasource');

        if (selection.length > 0) {
            var columns = table_data_module.getColumns(selection, datasource);

            table_data_module.getContent(selection, datasource).then(function(content) {

                if (self.get('table')) {
                    self.get('table').api().clear().destroy();
                    self.$().empty();
                }

                var table = self.$().dataTable({
                    responsive: {
                        details: {
                            type: 'inline'
                        }
                    },                 
                    "data": content.slice(1),
                    "columns": columns
                });
                self.set('table', table);
            });

        } else {
            if (self.get('table')) {
                self.get('table').api().clear().destroy();
                self.$().empty();
            }
        }
    }.observes('preview.[]').on('didInsertElement')
});

