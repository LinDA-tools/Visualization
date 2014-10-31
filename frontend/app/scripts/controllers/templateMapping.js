function templateMapping(editObject) {
    //the input object might be the result of the recommendation algorithm
    //or the JSON with changed template data, i.e. {tuningOptions:{height:500}}

    var tuningOptions = null;
    var structureOptions = null;

    //retrieving the fields
    if (editObject.hasOwnProperty("tuningOptions")) {
        tuningOptions = editObject["tuningOptions"];
    }

    if (editObject.hasOwnProperty("structureOptions")) {
        structureOptions = editObject["structureOptions"];
    }

    //invoking an appropriate template for a tuning parameter
    if (tuningOptions !== null) {
        for (var prop in tuningOptions) {
            if (tuningOptions.hasOwnProperty(prop)) {
                if (typeof(tuningOptions[prop]) !== 'object') {
                    invokeTemplate(prop, tuningOptions[prop]);
                } else {
                    var axisOptions = tuningOptions[prop];
                    for (var axisprop in axisOptions) {
                        invokeTemplate(axisprop, axisOptions[axisprop]);
                    }
                }
            }
        }
    }

    //invoking an appropriate template for a dimension parameter
    if (structureOptions !== null) {
        var dimensions = structureOptions['dimensions'];
        for (var prop in dimensions) {
            invokeTemplate(prop, dimensions[prop]);
        }
    }

};



