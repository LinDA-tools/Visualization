
var mongoose = require('mongoose');

var Schema = mongoose.Schema;

mongoose.connect('mongodb://localhost/visualization/');

var Datasource = mongoose.Schema({
    name: String,
    endpoint: String,
    graph: String
},
{collection: 'datasource'});

var Tool = mongoose.Schema({
    name: String,
    tooluri: String,
    category: String,
    vocabulary: String,
    format: String
},
{collection: 'tool'});

var Vocabulary = mongoose.Schema({
    name: String,
    endpoint: String,
    graph: String
},
{collection: 'vocabulary'});

var DatasourceModel = mongoose.model('Datasource', Datasource);

var ToolModel = mongoose.model('Tool', Tool);

var VocabularyModel = mongoose.model('Vocabulary', Vocabulary);

exports.DatasourceModel = DatasourceModel;

exports.ToolModel = ToolModel;

exports.VocabularyModel = VocabularyModel;