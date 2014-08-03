var csv_data_module = function() {

// order: order of columns specified by the user
// subset: dummy; needed in case of RDF for the selected class(es)
// location: location of the input dataset

    function parse(location, subset, order) {
     console.log("CSV-DATA-MODULE PARSE");
        return  $.get(location).then(function(data) {
            return $.csv.toArrays(data, {onParseValue: $.csv.hooks.castToScalar});
        }).then(function(dataArray) {
            return convert(dataArray, order);
        });
     console.log("###########");      
    }

    function read(location) {
        console.log("CSV-DATA-MODULE READ");
        
        var dataInfo = {}
        
        return  $.get(location).then(function(data) {
            return $.csv.toArrays(data, {onParseValue: $.csv.hooks.castToScalar});
        }).then(function(dataArray) {           
            var dataset = {
                label: "CSV Data",
                id: "CSV Data",
                properties: [] //columns
            };

            var names = dataArray[0];

            for (var i = 0; i < names.length; i++) {
                var column = {};
                    column.id = i;
                    column.label = names[i];
                    dataset.properties.push(column);               
            }
            
            dataInfo.dataset = dataset;
            
            console.log('DATA INFO');
            console.dir(dataInfo);
            return {dataInfo: dataInfo, location: location};
        });       
     console.log("###########");  
    }

    function convert(arrayData, columnsOrder) {
      console.log("CSV-DATA-MODULE CONVERT");
      var result = [];
      var row = [];
        
      console.log("DATA");
      console.dir(arrayData);
      console.log("COLUMN ORDER");
      console.dir(columnsOrder);

      for (var i = 0; i < arrayData.length; i++) {
            var record = [];
            row = arrayData[i];
            for (var j = 0; j < columnsOrder.length; j++) {
                var order = columnsOrder[j]; // TODO
                record.push(row[order]);
            }
            result.push(record);
        }          
       console.log("###########");  
       return result;
    }
    
    return {
        read: read,
        parse: parse
    };
}();