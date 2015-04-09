import util from "./util";

/* global $ */
/* global _ */
var csv_data_module = function () {
    var saved_location;
    var saved_data;

    function parse(location, graph, selection) {
        console.log('CSV DATA MODULE');
        var dimension = selection.dimension;
        var multidimension = selection.multidimension;
      
        return queryInstances(location, null, dimension.concat(multidimension));     
    }

    function queryInstances(location, dummy, selection) {
        console.log('QUERY INSTANCES');

        var dataPromise;
        if (saved_location === location) {
            dataPromise = $.Deferred().resolve(saved_data).promise();
        } else {
            dataPromise = $.get(location);
        }

        return  dataPromise.then(function (data) {
            saved_location = location;
            saved_data = data;
            return $.csv.toArrays(data, {onParseValue: util.toScalar});
        }).then(function (dataArray) {
            var columns = [];
            for (var i = 0; i < selection.length; i++) {
                var column = _.rest(selection[i].parent);
                columns.push(column[0]);
            }
            return convert(dataArray, columns);
        });
    }

    function queryClasses() {
        console.log('QUERY CLASSES');

        var dfd = new $.Deferred();
        var dataInfo = {
            id: "Columns",
            label: "Columns",
            type: "Class",
            grandchildren: true
        };
        dfd.resolve([dataInfo]);
        return dfd.promise();
    }

    function queryProperties(location, dummy1, dummy2, _properties) {
        console.log('QUERY PTOPERTIES');

        var dfd = new $.Deferred();

        if (_properties.length > 0) {
            dfd.resolve([]);
            return dfd.promise();
        } else {
            return $.get(location).then(function (data) {
                return $.csv.toArrays(data, {onParseValue: util.toScalar, start: 0, end: 2});
            }).then(function (dataArray) {
                var names = dataArray[0];
                var values = dataArray[1];
                var columns = [];

                for (var i = 0; i < names.length; i++) {
                    var dataInfo = {
                        id: i.toString(),
                        label: names[i],
                        grandchildren: false,
                        role: null,
                        special: false,
                        type: util.predictValueSOM(values[i])
                    };
                    columns.push(dataInfo);
                }
                return columns;
            });
        }
    }

    function convert(arrayData, columnsOrder) {
        console.log('CONVERT');

        var result = [];
        var row = [];

        for (var i = 0; i < arrayData.length; i++) {
            var record = [];
            row = arrayData[i];
            for (var j = 0; j < columnsOrder.length; j++) {
                var order = parseInt(columnsOrder[j].id);
                record.push(row[order]);
            }
            result.push(record);
        }
        return result;
    }

   
    return {
        queryClasses: queryClasses,
        queryProperties: queryProperties,
        queryInstances: queryInstances,
        parse: parse
    };
}();

export default csv_data_module;

