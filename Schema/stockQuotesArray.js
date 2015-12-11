var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = function () {
    var stockQuotesArraySchema = new Schema({
        "_id" : String,
        opens: [Number],
        closes: [Number],
        highs: [Number],
        lows: [Number],
        volumes: [Number],
        turnovers: [Number],
        dates: [Date]
    });
    stockQuotesArraySchema.index({ _id: 1}); // schema level, ensure index
    
    stockQuotesArraySchema.statics.findBySymbol = function(symbol){
        return function(callback){
            mongoose.model('StockQuotesArray').findOne({"_id":symbol}).exec(callback);
        }
    };
    
    stockQuotesArraySchema.statics.findAll = function(){
        return function(callback){
            mongoose.model('StockQuotesArray').find({}).exec(callback);
        }
    }
    mongoose.model('StockQuotesArray', stockQuotesArraySchema, 'stockQuotesArray');
};