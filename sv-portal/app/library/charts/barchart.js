google.load('visualization', '1', {packages: ['corechart']});

var barchart = function() {

    var structureOptions = {
        axis: {label: "Axes", template: 'tabgroup', options: { // TODO: box; tabgroup
                xAxis: {label: "Horizontal axis", template: 'dimension'},
                yAxis: {label: "Vertical axis", template: 'multidimension'}
            }
        }
    };    

    var tuningOptions = {
        title: {label: "Title", template: 'textField'},
        
        style: {label: "Style", template: 'selectField', 
            values: [{label: "Normal", id: "normal"}, {label: "Stacked", id: "stacked"}]
        },

        axis: {label: "Axes", template: 'box', options: {
                vLabel: {label: "Label (V)", template: 'textField'},
                hLabel: {label: "Label (H)", template: 'textField'},
                grid: {label: "Grid", template: 'textField'},
                scale: {label: "Scale", template: 'selectField', 
                    values: [{label: "Linear", id: "linear"}, {label: "Logarithmic", id: "logarithmic"}],
                    defaults:{id:"linear"}
                }
            }
        }, 
        color: {label: "Horizontal axes colors", template: 'box', options: {
                yAxisColors: {template: 'multiAxisColors', axis: 'yAxis'} // TODO
            }
        }
    };

    var chart = null;
    var data = null;

    function draw(visualisationConfiguration, visualisationContainer) {
        console.log("### INITIALIZE VISUALISATION");
        
        var dataModule = visualisationConfiguration.dataModule;
        var subset = visualisationConfiguration.selectedSubset;
        
        console.log("VISUALISATION CONFIGURATION");
        console.dir(visualisationConfiguration);
        
        var xAxis = visualisationConfiguration.axis.xAxis;   
        var yAxes = visualisationConfiguration.axis.yAxis.multiAxis; 
        
        var order = []; 
        
        order.push(xAxis.id);
        
        for (var i = 0; i < yAxes.length; i++) {
             order.push(yAxes[i].id);             
        }
        
        console.log("COLUMNS/PROPERTIES ORDER");
        console.dir(order);
        
        var location = visualisationConfiguration.datasourceInfo.location;
                       
        dataModule.parse(location, subset, order).then(function(inputData){
        console.log("CONVERTED INPUT DATA");
        console.dir(inputData);    
            
         // Create and populate the data table.
        data = google.visualization.arrayToDataTable(inputData);
                    
        chart = new google.visualization.BarChart(document.getElementById(visualisationContainer));     
        
        console.log("### DRAW VISUALISATION");
      
        chart.draw(data,
                { width: 600, height: 400 }
        );

       console.log("###########"); 
        
        
        }); 
            
       console.log("###########");   
    }   

  function tune(config) {
       console.log("### TUNE VISUALISATION");

        chart.draw(data,
                {title: config.title,
                    width: 600, height: 400,
                    vAxis: {title: config.axis.vLabel},
                    hAxis: {title: config.axis.hLabel,
                        logScale: (config.axis.scale.id === 'logarithmic') ? true : false,
                        gridlines: {
                            count: config.axis.grid
                        }
                    },
                    isStacked: (config.style.id === 'stacked') ? true : false,
                }
        );

        console.log("###########"); 
    }

    return {
        structureOptions: structureOptions,
        tuningOptions: tuningOptions,
        draw: draw,
        tune: tune
    };
}();