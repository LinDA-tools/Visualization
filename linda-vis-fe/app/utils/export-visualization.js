/* global $ */
var exportVis = function() {

    function export_PNG() {
        var svg = get_SVG();
        var image = $('<img />', {'id': 'chart', "style": "display:none", 'src': 'data:image/svg+xml,' + encodeURIComponent(svg)});
        image.appendTo($('#visualization'));
        var dfd = new $().Deferred();

       $("#chart").one("load", function() {
            var canvas = $('<canvas/>', {'id': 'canvas'});
            canvas[0].width = 1050;
            canvas[0].height = 510;
            canvas.appendTo($('#visualization'));         
            var context = canvas[0].getContext('2d');
      
            // Generate a PNG with canvg. 
            context.drawSvg(svg, 0, 0, 1050, 510);

            var pngURL = canvas[0].toDataURL("image/png");
            var downloadURL = pngURL.replace(/^data:image\/png/, 'data:application/octet-stream');
          
            dfd.resolve(downloadURL);

            canvas.remove();
           $(this).remove();
        }).each(function() {
            if (this.complete){
                $(this).load();
	    }
        });

        var imgURL = dfd.promise();
    
        return(imgURL);
    }

    function export_SVG() {
        var svg = get_SVG();
        var svgURL = 'data:application/octet-stream,' + encodeURIComponent(svg);
       
        return(svgURL);
    }

    function get_SVG(cssFilename) {
        var svg = $("#visualization").find('svg');
    
        if (svg.length === 0) {
            return;
        }

        var serializer = new XMLSerializer();      
        var svg_ = serializer.serializeToString(svg[0]);

        svg.find('defs').remove();

        svg.attr('version', "1.1");
        svg.attr('xmlns', "http://www.w3.org/2000/svg");
        svg.attr('xmlns:xlink', "http://www.w3.org/1999/xlink");

        if (cssFilename) {
            var css = "";

            // Take all the styles from your visualization library and make them inline. 
            $().each(document.styleSheets, function(sheetIndex, sheet) {
               
                if ((sheet.href !== null) && endsWith(sheet.href, cssFilename)) {
                    $().each(sheet.cssRules || sheet.rules, function(ruleIndex, rule) {
                      
                        css += rule.cssText + "\n";
                    });
                }
            });
        
            var style = $('<style />', {"type": "text/css"});
            style.prependTo(svg);                            
            svg_ = svg_.replace('</style>', '<![CDATA[' + css + ']]></style>');         
        } 

        return svg_;
    }

    function endsWith(str, suffix) {
        return str.indexOf(suffix, str.length - suffix.length) !== -1;
    }

    return {
        export_PNG: export_PNG,
        export_SVG: export_SVG,
        get_SVG: get_SVG
    };

}();

export default exportVis;
