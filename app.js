'use strict'
global.talib = require('talib');
global.config = require('./config/config.json');
global.mongoose = require('mongoose');
global.MongoClient = require('mongodb').MongoClient;
global.co = require('co');
global.parallel = require('co-parallel');
global.thunkify = require('thunkify');
global.util = require('util');
global. _ = require("underscore");
global.json2xls = require('json2xls');
global.fs = require('fs');

var talibExecute = thunkify((parameter, callback) => {
    talib.execute(parameter, function (result) {
        callback(null, result.result);
    })
});

try {
    global.mongoURI = global.config.mongoDbConn;
}
catch (err) {
    global.mongoURI = global.config.mongoDbConn;
}

mongoose.connect(global.mongoURI);
console.log("TALib Version: " + talib.version);
require('./Schema/stockDayQuoteSchema.js')();
require('./Schema/stockProfileSchema.js')();
require('./Schema/stockQuotesArray.js')();


var StockDayQuoteModel = mongoose.model("StockDayQuote");
var StockProfileModel = mongoose.model("StockProfile");
var StockQuotesArrayModel = mongoose.model("StockQuotesArray");

mongoose.connection.on("open", function (err) {
    co(function*() {
    let symbol = '00003:HK';
    let share = 1000;
    
    let stockQuotesArray = yield StockQuotesArrayModel.findBySymbol(symbol);

    let closes = stockQuotesArray.closes;

    console.log(stockQuotesArray);          
    var resultWILLR = yield talibExecute({
                name: "WILLR",
                startIdx: 0,
                endIdx: stockQuotesArray.closes.length - 1,
                high: stockQuotesArray.highs,
                low: stockQuotesArray.lows,
                close: stockQuotesArray.closes,
                open: stockQuotesArray.opens,
                inReal: stockQuotesArray.closes,
                optInTimePeriod: 9
            });
      console.log(resultWILLR);          
    
    })
    .then
    (function (val) {

    })
    .catch(function (err, result) {
        console.log('err: ' + err + ', result: ' + result);
        process.exit(0);

    });
});