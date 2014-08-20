var mongoose = require('mongoose');
var Schema = mongoose.Schema;

mongoose.connect('mongodb://localhost/visualization/');

var Datasource = mongoose.Schema({
    name: String,
    location: Schema.Types.Mixed,
    format: String,
    metadata:String
},
{collection: 'dataset'}
);

var Widget = mongoose.Schema({
    name: String,
    thumbnail: String,
    category: String    
},
{collection: 'widget'});

var Vocabulary = mongoose.Schema({
    name: String,
    endpoint: String,
    graph: String,
    category: String
},
{collection: 'vocabulary'});

var DatasourceModel = mongoose.model('Datasource', Datasource);
var WidgetModel = mongoose.model('Widget', Widget);
var VocabularyModel = mongoose.model('Vocabulary', Vocabulary);

exports.DatasourceModel = DatasourceModel;
exports.WidgetModel = WidgetModel;
exports.VocabularyModel = VocabularyModel;
