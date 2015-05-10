/* global require, module */

var EmberApp = require('ember-cli/lib/broccoli/ember-app');

var app = new EmberApp();

app.import("bower_components/bootstrap/dist/js/bootstrap.js");
app.import("bower_components/bootstrap/dist/css/bootstrap.css");
app.import("bower_components/bootstrap/dist/css/bootstrap.css.map", {
  destDir: 'assets'
});
app.import("bower_components/fancytree/dist/skin-bootstrap/ui.fancytree.css");
app.import('bower_components/bootstrap/dist/fonts/glyphicons-halflings-regular.woff', {
  destDir: 'fonts'
});
app.import('bower_components/bootstrap/dist/fonts/glyphicons-halflings-regular.woff2', {
  destDir: 'fonts'
});

app.import("bower_components/underscore/underscore.js");

app.import('bower_components/jquery/dist/jquery.js');
app.import('bower_components/jqueryui/jquery-ui.js');
app.import("bower_components/jquery-csv/src/jquery.csv.js");

app.import("bower_components/datatables/media/js/jquery.dataTables.js");
//app.import("bower_components/datatables-responsive/js/dataTables.responsive.js");
//app.import("bower_components/datatables-responsive/css/dataTables.responsive.css");
app.import("bower_components/datatables/media/css/jquery.dataTables.css");
app.import('bower_components/datatables/media/images/sort_asc.png', {
  destDir: 'images'
});

app.import('bower_components/datatables/media/images/sort_desc.png', {
  destDir: 'images'
});

app.import('bower_components/datatables/media/images/sort_both.png', {
  destDir: 'images'
});

app.import("bower_components/canvg/dist/canvg.bundle.js");
app.import("bower_components/d3/d3.js");

app.import("bower_components/dimple/dist/dimple.v2.1.2.js", {
   exports: {
     'dimple': [
       'dimple'
     ]
   }
});


app.import("bower_components/leaflet/dist/leaflet-src.js");
app.import("bower_components/leaflet/dist/leaflet.css");
app.import("bower_components/leaflet/dist/images/marker-icon.png",{
  destDir: 'images'
});
app.import("bower_components/leaflet/dist/images/marker-icon-2x.png",
  {
    destDir: 'images'
  });
app.import("bower_components/leaflet/dist/images/marker-shadow.png",{
  destDir: 'images'
});
app.import("bower_components/leaflet/dist/images/layers.png",{
  destDir: 'images'
});
app.import("bower_components/leaflet/dist/images/layers-2x.png",{
  destDir: 'images'
});

app.import("bower_components/fancytree/dist/src/jquery.fancytree.js");
app.import("bower_components/fancytree/dist/src/jquery.fancytree.edit.js");
app.import("bower_components/fancytree/dist/src/jquery.fancytree.glyph.js");
app.import("bower_components/fancytree/dist/src/jquery.fancytree.wide.js");
app.import("bower_components/fancytree/dist/src/jquery.fancytree.filter.js");
app.import('bower_components/fancytree/dist/skin-lion/loading.gif', {
  destDir: 'assets'
});

app.import('bower_components/slick.js/slick/fonts/slick.woff', {
  destDir: 'assets/fonts'
});
app.import("bower_components/slick.js/slick/slick.js");
app.import("bower_components/slick.js/slick/slick.css");
app.import("bower_components/slick.js/slick/slick-theme.css");
app.import('bower_components/slick.js/slick/ajax-loader.gif', {
  destDir: 'assets'
})

app.import("vendor/leaflet-dvf/leaflet-dvf.js");
app.import("vendor/leaflet-dvf/leaflet-dvf.markers.js");
app.import("vendor/leaflet-image/leaflet-image.js");

module.exports = app.toTree();
