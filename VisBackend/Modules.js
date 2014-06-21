var mongoose = require('mongoose');
var Schema = mongoose.Schema;

mongoose.connect('mongodb://localhost/visualization/');

var Datasource = mongoose.Schema({
    name: String,
    location: String,
    format: String
},
{collection: 'dataset'}
);

var CSVVisualization = mongoose.Schema({
    name: String,
    thumbnail: String,
    format: String
},
{collection: 'csv_visualization'});

var Tool = mongoose.Schema({
    name: String,
    tooluri: String,
    category: String,
    vocabulary: String,
    format: String
},
{collection: 'tool'});

var Vocabulary = mongoose.Schema({
    category: {type: Schema.Types.ObjectId, ref: 'Category'},
    name: String,
    endpoint: String,
    graph: String
},
{collection: 'vocabulary'});

var Category = mongoose.Schema({
    name: String,
    vocabularies: [{type: Schema.Types.ObjectId, ref: 'Vocabulary'}]
},
{collection: 'category'});

var DatasourceModel = mongoose.model('Datasource', Datasource);
var CSVVisualizationModel = mongoose.model('CSVVisualization', CSVVisualization);
var ToolModel = mongoose.model('Tool', Tool);
var VocabularyModel = mongoose.model('Vocabulary', Vocabulary);
var CategoryModel = mongoose.model('Category', Category);

exports.DatasourceModel = DatasourceModel;
exports.CSVVisualizationModel = CSVVisualizationModel;
exports.ToolModel = ToolModel;
exports.VocabularyModel = VocabularyModel;
exports.CategoryModel = CategoryModel;