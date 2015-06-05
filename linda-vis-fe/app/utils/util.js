var util = function () {

function transpose(table) {
    var columnHeaders = table[0];
    var columns = [];
    for (var i = 0; i < columnHeaders.length; i++) {
        var column = [];
        for (var j = 0; j < table.length; j++) {
            column.push(table[j][i]);
        }
        columns.push(column);
    }
    return columns;
}

function createRows(table) {
    var rows = [];
    var columnHeaders = table[0];

    for (var i = 1; i < table.length; i++) {
        var columns = {};
        var row = table[i];
        for (var j = 0; j < row.length; j++) {
            var name = columnHeaders[j];
            columns[name] = row[j];
        }
        rows.push(columns);
    }
    return rows;
}


var floatPattern = /^-?[0-9]+\.[0-9]+$/;
var intPattern = /^-?[0-9]+$/;

function toScalar(value) {
    if (floatPattern.test(value)) {
        var float = parseFloat(value);
        if (isNaN(float)) {
            return value;
        } else {
            return float;
        }
    } else if (intPattern.test(value)) {
        var integer = parseInt(value);
        if (isNaN(integer)) {
            return value;
        } else {
            return integer;
        }
    } else {
        var date = Date.parse(value);
        if (isNaN(date)) {
            return value;
        } else {
            return new Date(date).toISOString();
        }
    }
}

function predictValueSOM(value) {
    var jsType = typeof (value);
    switch (jsType) {
        case "number":
            return "Ratio";
        case "object":
            var asString = Object.prototype.toString.call(value);
            switch (asString) {
                case '[object Date]':
                case '[invalid Date]':
                    return 'Interval';
            }
            break;
    }

    return "Nominal";
}

    var cleanAxis = function(axis, interval){
        if (axis.shapes.length>0){
            //first tick
            var del = 0;
            if (interval> 1 ){
                axis.shapes.selectAll("text").each(function (d){
                    //remove all but nth label
                    if (del % interval !==0){
                        this.remove();
                        //delete a corresponding tick
                        axis.shapes.selectAll("line").each(function (d2){
                            if (d === d2){
                                this.remove();
                            }
                        });
                    }
                    del +=1;
                });
            }
        }
    };

 return {
        predictValueSOM: predictValueSOM,
        toScalar: toScalar,
        transpose: transpose,
        createRows: createRows,
        cleanAxis: cleanAxis
    };

}();

export default util;
