var treeselection_data = function() {
    var _location = "";
    var _graph = "";
    var _format = "";
    var _data_module = "";    

    function initialize(dataInfo) {
        console.log('INITIALIZING SELECTION TREE');
        console.dir(dataInfo);

        _location = decodeURIComponent(dataInfo.get('location'));
        _graph = decodeURIComponent(dataInfo.get('graph'));
        _format = dataInfo.get('format');
        _data_module = getDataModule(_format);

        return _data_module.queryClasses(_location, _graph).then(function(data) {
            return createTreeContent(data);
        });
    }

    function createTreeContent(data) {
        console.log('CREATING TREE CONTENT');
        var treeContent = [];

        for (var i = 0; i < data.length; i++) {
            var record = data[i];
            
            var id = record.id;
            var label = record.label;
            var type = record.type;
            var grandchildren = record.grandchildren;
            
            console.log("RECORD");
            console.dir(record);

            treeContent.push({
                title: label,
                key: id,
                lazy: grandchildren,
                icon: categorize(type),
                _children: {
                    loadChildren: function(node_path) {
                        console.log('LOADING CHILDREN');

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
        console.log('TREE CONTENT:');
        console.dir(treeContent);

        return treeContent;
    }
        
    function categorize(record) {
        switch (record) {
            case "Class":
                return '../images/Class.png';
            case "Quantitative":
                return '../images/Number.png';
            case "Interval":
                return '../images/Date.png';
            case "Nominal":               
            case "Categorical":
                 return '../images/String.png';
            case "Resource":                
            case "Nothing":
                return '../images/Resource.png';
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
        initialize: initialize
    };
}();

