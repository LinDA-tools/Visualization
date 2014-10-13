App.DataTableComponent = Ember.Component.extend({
    tagName: 'table',
    content: [],
    columns: [],
    table: null,
    setContent: function() {
        console.log('SET TABLE CONTENT - TABLE COMPONENT');

        var self = this;

        var list = this.get('list');
        console.log('LIST -- IN TABLECOMPONENT');
        console.dir(list);

        if (list.length > 0) {
            var columns = table_data.getColumns(list);
            console.log('RETRIEVED TABLE COLUMNS -- IN TABLECOMPONENT');
            console.dir(columns);

            table_data.getContent(list).then(function(content) {
                console.log('RETRIEVED TABLE CONTENT -- IN TABLECOMPONENT');
                console.dir(content);
                var table = self.get('table');

                if (table) {
                    table.api().clear().destroy();
                    $(self.get('element')).empty();
                }

                var table = $(self.get('element')).dataTable({
                    "data": content,
                    "columns": columns
                });

                self.set('table', table);
            });
        } else {
            var table = self.get('table');

            if (table) {
                table.api().clear().destroy();
                $(self.get('element')).empty();
            }
        }


    }.observes('list.[]')
});