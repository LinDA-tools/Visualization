var csv_data_module = function() {

    function read(location) {     
        return  $.get(location);   
    }
    
    function parse(data) {  
        return $.csv.toArrays(data, {onParseValue: $.csv.hooks.castToScalar});
    }
    
    function dimensions(arrayData){ // Inhalt der Sturkturoptionen nicht die Label  
        var names = arrayData[0];
        var dimensions = [];
        
            for (var i = 0; i < names.length; i++) {
                    var dimension = {};
                    dimension.id = i;
                    dimension.label = names[i];
                    dimensions.push(dimension);
            } 
            
        return dimensions;
    }
    

    return {      
        read: read,
        parse: parse,
        dimensions:dimensions
    };
    
}();