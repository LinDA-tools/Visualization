function templateMapping(editObject) {
    //the input object might be the result of the recommendation algorithm
    //or the JSON with changed template data, i.e. {layoutOptions:{height:500}}
    console.log('CREATING TEMPLATE MAPPING ...');

    var resultMapping = {
        layoutOptions: {},
        structureOptions: {}
    };
    
    //retrieving the fields
    var layoutOptions = editObject.get("layoutOptions");
    var structureOptions = editObject.get("structureOptions");

    //invoking an appropriate template for a dimension parameter
    resultMapping["layoutOptions"] = mapping(layoutOptions);

    //invoking an appropriate template for a tuning parameter
    resultMapping["structureOptions"] = mapping(structureOptions);

    return resultMapping;
}

function mapping(options) {
    var result = {};
    
    //Assuming there is a baseofmappings {option: template}
    var mapDB = {
        "dimension": "dimension-area",
        "color": "tuning-bgc",
        "string": "textField",
        "boolean": "tuning-check",
        "number": "tuning-numinput"
    };
    
    if (options !== null) {
        for (var prop in options) {
            if (options.hasOwnProperty(prop)) {
                result[prop] = {
                    template: mapDB[options[prop].type],
                    value: options[prop].value,
                    label: options[prop].label,
                    metadata: options[prop].metadata
                };
            }
        }
    }
    
    console.log('TEMPLATE MAPPING RESULT');
    console.dir(result);

    return result;
}

