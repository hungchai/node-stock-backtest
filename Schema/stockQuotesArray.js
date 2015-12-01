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

    mongoose.model('StockQuotesArray', stockQuotesArraySchema, 'stockQuotesArray');
};