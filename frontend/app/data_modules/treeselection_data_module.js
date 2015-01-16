var treeselection_data = function() {
    var _location = "";
    var _graph = "";
    var _format = "";
    var _data_module = "";

    function initialize(dataInfo) {
        console.log('SELECTION TREE COMPONENT - INITIALIZING TREE');
        console.dir(dataInfo);

        _location = dataInfo.get('location');
        _graph = dataInfo.get('graph');
        _format = dataInfo.get('format');
        _data_module = getDataModule(_format);

        return _data_module.queryClasses(_location, _graph).then(function(data) {
            return createTreeContent(data);
        });
    }

    function createTreeContent(data) {
        console.log('SELECTION TREE COMPONENT - CREATING TREE CONTENT');
        var treeContent = [];

        for (var i = 0; i < data.length; i++) {
            var record = data[i];
            var id = record.id;
            var label = record.label;
            var type = record.type;
            var role = record.role;
            var grandchildren = record.grandchildren;

            treeContent.push({
                title: label,
                key: id,
                lazy: grandchildren,
                icon: getCategory(type),
                type: type,
                role: role,
                hideCheckbox: showCheckbox(type),
                _children: {
                    loadChildren: function(node_path) {
                        var _class = "";
                        var _properties = "";

                        if (node_path.length > 1) {
                            _class = node_path.pop();
                            _properties = node_path.reverse();
                        } else {
                            _class = node_path.pop();
                            _properties = [];
                        }

                        return _data_module.queryProperties(_location, _graph, _class, _properties).then(function(data) {
                            console.dir(data);
                            return createTreeContent(data);
                        });
                    }
                }
            });
        }
        console.log('SELECTION TREE COMPONENT - TREE CONTENT:');
        console.dir(treeContent);

        return treeContent;
    }

    function getDataSelection(selection, datasource) {
        var dataSelection = {datasource: datasource, propertyInfos: []};

        for (var i = 0; i < selection.length; i++) {
            var record = selection[i];

            dataSelection['propertyInfos'].push({
                id: record.key,
                label: record.label,
                parent: record.parent,
                role: record.role,
                scaleOfMeasurement: record.type
            });
        }

        return dataSelection;
    }

    function getCategory(record) {
        switch (record) {
            case "Quantitative":
                return '../images/quantitative_.png';
            case "Interval":
                return '../images/interval_.png';
            case "Categorical":
            case "Nominal":
                return '../images/categorical_.png';
            case "Class":
                return '../images/class_.png';
            case "Resource":
            case "Nothing":
                return '../images/resource.png';
        }
        console.error("Unknown category of record  '" + record + "'");
        return null;
    }

    function showCheckbox(record) {
        switch (record) {
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
        console.error("Unknown category of record  '" + record + "'");
        return null;
    }

    function getDataModule(format) {
        switch (format) {
            case 'csv':
                return csv_data_module;
            case 'rdf':
                return sparql_data_module;
        }
        console.error("Unknown data format '" + format + "'");
        return null;
    }

    return {
        initialize: initialize,
        getDataSelection: getDataSelection
    };
}();

