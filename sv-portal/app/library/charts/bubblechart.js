google.load('visualization', '1', {packages: ['corechart']});

var bubblechart = function() { // bubble chart module (js module pattern)

    var structureOptions = {
        xAxis: {label: "X Axis", template: 'dimension'},
        vAxis: {label: "Vertical axis", template: 'box',
            options: {
                title: {label: "Title", template: 'textField'},
                gridLines: {label: "Grid lines", template: 'box',
                    options: {
                        number: {label: "Number", template: 'intSlider'},
                        color: {label: "Color", template: 'color'}
                    }
                }
            }
        },
        yAxis: {label: "Y Axis", template: 'dimension'},
        radius: {label: "Radius", template: 'dimension'}
    };

    var tuningOptions = {
        title: {label: "Chart title", template: 'textField'},
        vAxis: {label: "Vertical axis", template: 'box',
            options: {
                title: {label: "Title", template: 'textField'},
                gridLines: {label: "Grid lines", template: 'box',
                    options: {
                        number: {label: "Number", template: 'intSlider'},
                        color: {label: "Color", template: 'color'}
                    }
                }
            }
        },
        hAxis: {label: "Horizontal axis", template: 'box',
            options: {
                title: {label: "Title", template: 'textField'},
                gridLines: {label: "Grid lines", template: 'box',
                    options: {
                        number: {label: "Number", template: 'intSlider'},
                        color: {label: "Color", template: 'color'}
                    }
                }
            }
        },
    };

    var chart = null;
    var data = null;


    function initialize(input, divId) {
        // Create and populate the data table.
        data = google.visualization.arrayToDataTable(input);
        chart = new google.visualization.BubbleChart(document.getElementById(divId));
    }

    function draw(config) {
        // Create and draw the skeleton of the visualization.
        var view = new google.visualization.DataView(data);
        var columns = [config.xAxis.id, config.yAxis.id, config.radius.id];
        view.setColumns(columns);

        chart.draw(view,
                {title: config.title,
                    width: 600, height: 400}
        );
    }

    function tune(config) {
        // Tune the visualization.
        chart.draw(data,
                {title: config["title"],
                    width: 600, height: 400,
                    vAxis: {title: config.vAxis.title},
                    hAxis: {title: config.hAxis.title},
                    bubble: {textStyle: {fontSize: 11}}
                }

        );
    }

    return {
        structureOptions: structureOptions,
        tuningOptions: tuningOptions,
        initialize: initialize,
        draw: draw,
        tune: tune
    };
}();