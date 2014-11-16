function templateMapping(editObject) {
    //the input object might be the result of the recommendation algorithm
    //or the JSON with changed template data, i.e. {layoutOptions:{height:500}}
   console.log('Creating template mapping...');
   
   
   var layoutOptions = null;
   var structureOptions = null;
   var resultMapping = {
            layoutOptions: {},
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
       // if (editObject.hasOwnProperty("layoutOptions")) {
            layoutOptions = editObject.get("layoutOptions");
        //}

        //if (editObject.hasOwnProperty("structureOptions")) {
            structureOptions = editObject.get("structureOptions");
        //}

        //invoking an appropriate template for a tuning parameter
        if (layoutOptions !== null) {
            for (var prop in layoutOptions) {
                if (layoutOptions.hasOwnProperty(prop)) {
                    if (prop !== 'axis') {
                        resultMapping.layoutOptions[prop]={
                            template: mapDB[prop],
                            value: layoutOptions[prop].value,
                            label: layoutOptions[prop].label
                        };
                        //invokeTemplate(prop, layoutOptions[prop]);
                    } else {
                        var axisOptions = layoutOptions[prop];
                        for (var axisprop in axisOptions) {
                            resultMapping.layoutOptions[axisprop]={
                            template: mapDB[axisprop],
                            value: axisOptions[axisprop].value,
                            label: axisOptions[axisprop].label

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
            
             console.log('Template mapping result');
             console.dir(resultMapping);
           
    
        return resultMapping;

};
