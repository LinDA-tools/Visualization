var csv_data_module = function() {

// order: order of columns specified by the user
// subset: dummy; needed in case of RDF for the selected class(es)
// location: location of the input dataset

    function parse(location, selection) {
        console.log("CSV-DATA-MODULE PARSE");

        var dimension = selection.dimension;
        var multidimension = selection.multidimension;
        var group = selection.group;

        console.log('DIMENSION');
        console.dir(dimension);

        console.log('MULTIDIMENSION');
        console.dir(multidimension);

        console.log('GROUP');
        console.dir(group);

        if (group.length > 0) {
            //CASE 1: dimension and grouped multidimension -> 1 dim; 1 mdim; just 1 group value; 
            var dimension_ = dimension.concat(multidimension).concat(group);

            console.log('dimension_');
            console.dir(dimension_);

            return query(location, dimension_).then(function(result) {

                var result = group_by(result, dimension, multidimension, group);

                console.log('PARSE RESULT');
                console.dir(result);

            });
        } else {
            //CASES 2: dimension and/or multidimension -> 1 dim; 1..n mdim; 
            var dimension_ = dimension.concat(multidimension);
            var result = query(location, dimension_);
            console.log('PARSE RESULT');
            console.dir(result);
        }
        
        return result;
    }


    function group_by(result, dimension, multidimension, group) {
        console.log('GROUP BY -');

        console.log('DIMENSION');
        console.dir(dimension);

        console.log('MULTIDIMENSION');
        console.dir(multidimension);

        console.log('GROUP');
        console.dir(group);

        console.log('RESULT');
        console.dir(result);

        var group_ = [];
        var multidimension_ = [];
        var dimension_ = [];

        // columns order convention
        var dim_id = 0;
        var mdim_id = 1;
        var gr_id = 2;

        // TODO: das sortieren umsetzen
        //        result.sort(function(res1, res2) {
        //            if (res1[dim_id] < res2[dim_id]) {
        //                return 1;
        //            } else if (res1[dim_id] > res2[dim_id]) {
        //                return -1;
        //            } else {
        //                if (res1[gr_id] < res2[gr_id]) {
        //                    return 1;
        //                } else if (res1[gr_id] > res2[gr_id]) {
        //                    return -1;
        //                } else {
        //                    return 0;
        //                }
        //            }
        //        });

        for (var i = 0; i < result.length; i++) {
            var record = result[i];

            multidimension_.push(record[mdim_id]);

            if (!_.contains(group_, record[gr_id])) {
                group_.push(record[gr_id]);
            }

            if (!_.contains(dimension_, record[dim_id])) {
                dimension_.push(record[dim_id]);
            }

        }

        console.log("dimension_");
        console.dir(dimension_);

        console.log("multidimension_");
        console.dir(multidimension_);

        console.log("group_");
        console.dir(group_);


        var columns = [];

        columns.push(dimension_[0]);

        for (var i = 1; i < group_.length; i++) {
            columns.push(group_[i]);
        }

        console.log("HEAD");
        console.dir(columns);

        var result = [];

        result.push(columns);

        var multidimension__ = multidimension_.reverse();
        var record = multidimension__.pop();
        var dim_counter = 1;

        while (multidimension__.length > 0) {
            var row = [];

            row.push(dimension_[dim_counter]);

            if (dim_counter === dimension_) {
                dim_counter = 1;
            } else {
                dim_counter++;
            }

            for (var i = 1; i < columns.length; i++) {
                record = multidimension__.pop();
                row.push(record);
            }
            result.push(row);
        }
        console.log("FINAL RESULT");
        console.dir(result);

        return result;
    }

    function query(location, dimensions) {
        console.log('1 DIMENSION and 1 to n MULTIDIMENSION');

        return  $.get(location).then(function(data) {
            console.log("QUERY - csv to array");
            console.dir(data);
            return $.csv.toArrays(data, {onParseValue: $.csv.hooks.castToScalar});
        }).then(function(dataArray) {
            var result = convert(dataArray, dimensions);
            console.log("QUERY - convert");
            console.dir(result);
            return result;
        });
    }

    function read(location) {
        console.log("CSV-DATA-MODULE READ");

        var dataInfo = {}

        return  $.get(location).then(function(data) {
            return $.csv.toArrays(data, {onParseValue: $.csv.hooks.castToScalar});
        }).then(function(dataArray) {
            var dataset = {
                label: "Columns",
                id: "Columns",
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
                var order = columnsOrder[j].id; // TODO
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