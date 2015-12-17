var stockProfileSchema = require('./stockProfileSchema');
var stockDayQuoteSchema = require('./stockDayQuoteSchema');
var stockQuotesArray = require("./stockQuotesArray");



module.exports.stockProfileSchema = stockProfileSchema();
module.exports.stockDayQuoteSchema = stockDayQuoteSchema();
module.exports.stockQuotesArray = stockQuotesArray();