import columnchart from "./column-chart";
import linechart from "./line-chart";
import areachart from "./area-chart";
import piechart from "./pie-chart";
import bubblechart from "./bubble-chart";
import scatterchart from "./scatter-chart";
import map from "./map";

var visualizationRegistry = {
    getVisualization: function(widgetName) {
        switch (widgetName) {           
            case 'BarChart':
                return columnchart;
            case 'LineChart':
                return linechart;
            case 'AreaChart':
                return areachart;
            case 'PieChart':
                return piechart;
            case 'BubbleChart':
                return bubblechart;
            case 'ScatterChart':
                return scatterchart;      
            case 'Map':
                return map;
        }
        return null;
    }
};

export default visualizationRegistry;
