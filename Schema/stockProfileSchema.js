var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = function () {
    var stockProfileSchema = new Schema({
        "_id" : Schema.Types.ObjectId,
        "symbol" : String,
        "chiName": String,
        "engName": String,
        "lastupdate" : Date
    });
    mongoose.model('StockProfile', stockProfileSchema, 'stockProfile');
};