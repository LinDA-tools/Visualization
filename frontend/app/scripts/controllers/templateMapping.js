function templateMapping(editObject) {
    //the input object might be the result of the recommendation algorithm
    //or the JSON with changed template data, i.e. {tuningOptions:{height:500}}

   var tuningOptions = null;
   var structureOptions = null;
   var resultMapping = {
            tuningOptions: {},
            structureOptions: {},
            configuration: []
        };
    
        //Assuming there is a baseofmappings {option: template}
        var mapDB = {
            "dimensions": "dimension-area",
            "width": "tuning-width",
            "height":"tuning-height",
            "background_color": "tuning-bgc",
            "hLabel":"tuning-hlabel",
            "vLabel":"tuning-vlabel",
            "numGridlinesHor":"tuning-gridsHorizontal",
            "numGridlinesVer":"tuning-gridsVertical",
            "ticks":"tuning-ticks",
            "widthPx":"tuning-widthPx",
            "widthRatio":"tuning-widthRatio"
        };

        //retrieving the fields
       // if (editObject.hasOwnProperty("tuningOptions")) {
            tuningOptions = editObject.get("tuningOptions");
        //}

        //if (editObject.hasOwnProperty("structureOptions")) {
            structureOptions = editObject.get("structureOptions");
        //}

        //invoking an appropriate template for a tuning parameter
        if (tuningOptions !== null) {
            for (var prop in tuningOptions) {
                if (tuningOptions.hasOwnProperty(prop)) {
                    if (prop !== 'axis') {
                        resultMapping.tuningOptions[prop]={
                            template: mapDB[prop],
                            value: tuningOptions[prop],
                            label: prop,
                            name: prop
                            
                        };
                        //invokeTemplate(prop, tuningOptions[prop]);
                    } else {
                        var axisOptions = tuningOptions[prop];
                        for (var axisprop in axisOptions) {
                            resultMapping.tuningOptions[axisprop]={
                            template: mapDB[axisprop],
                            value: axisOptions[axisprop],
                            label: axisprop,
                            name: axisprop
                            
                        };
                            //invokeTemplate(axisprop, axisOptions[axisprop]);
                        }
                    }
                }
            }
        }
    
        var configurationObject = {};
        //invoking an appropriate template for a dimension parameter
        if (structureOptions !== null) {
	        var dimensions = structureOptions['dimensions'];
        
	        /*building the configuration object
	         * { xAxis : [],
	         *   yAxis:  []
	         * }  
	         */
	        for (var dimensionName in dimensions) {
	            configurationObject[dimensionName]=dimensions[dimensionName].value;

	            resultMapping.structureOptions[dimensionName] = dimensions[dimensionName];
	            resultMapping.structureOptions[dimensionName].template = mapDB['dimensions'];
            
	            /*resultMapping.mappingsStructure.push({
	                template: mapDB['dimensions'],

	                options: {
	                    label: prop,
	                    value: resultMapping.configuration[prop]
	                }
	            });*/
	            
	        }
	        resultMapping.configuration.push(configurationObject);
	    }
    
        return resultMapping;

};
