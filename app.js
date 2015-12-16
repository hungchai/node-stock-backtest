'use strict'
//global.talib = require('talib');
global.talib = require('./co-talib');
global.config = require('./config/config.json');
global.mongoose = require('mongoose');
global.MongoClient = require('mongodb').MongoClient;
global.co = require('co');
global.parallel = require('co-parallel');
global.thunkify = require('thunkify');
global.util = require('util');
global._ = require("underscore");
global.json2xls = require('json2xls');
global.fs = require('fs');

try {
    global.mongoURI = global.config.mongoDbConn;
}
catch (err) {
    global.mongoURI = global.config.mongoDbConn;
}

mongoose.connect(global.mongoURI);
console.log("TALib Version: " + talib.version);
require('./Schema/stockDayQuoteSchema')();
require('./Schema/stockProfileSchema')();
require('./Schema/stockQuotesArray')();


var StockDayQuoteModel = mongoose.model("StockDayQuote");
var StockProfileModel = mongoose.model("StockProfile");
var StockQuotesArrayModel = mongoose.model("StockQuotesArray");

mongoose.connection.on("open", function(err) {
    co(function*(symbol, share) {
            symbol = '00003:HK';
            share = 1000;

            let stockQuotesArray = yield StockQuotesArrayModel.findBySymbol(symbol);
            //Reserved variable names
            let closes = stockQuotesArray.closes;
            let highs = stockQuotesArray.highs;
            let lows = stockQuotesArray.lows;
            let opens = stockQuotesArray.opens;
            let volumes = stockQuotesArray.volumes;
            let turnovers = stockQuotesArray.turnovers;
            let dates = stockQuotesArray.dates;
            let positionsize = 1;
            let quotelength = closes.length;

            let buyrules = {};
            let sellrules = {};

            console.log(quotelength);
            //start
            var idx = 0;
            for (idx; idx < quotelength - 1; idx++) {


            }
            //end


            var WILLR_9 = yield talib.exec({
                name: "WILLR",
                startIdx: 0,
                endIdx: quotelength,
                high: highs,
                low: lows,
                close: closes,
                open: opens,
                inReal: closes,
                optInTimePeriod: 9
            });
            console.log(WILLR_9["outReal"].length);

            var RSI_9 = yield talib.exec({
                name: "RSI",
                startIdx: 0,
                endIdx: quotelength - 1,
                high: highs,
                low: lows,
                close: closes,
                open: opens,
                inReal: closes,
                optInTimePeriod: 9
            });
            console.log(RSI_9["outReal"].length);

            var MACD_3_50_10 = yield talib.exec({
                name: "MACD",
                startIdx: 0,
                endIdx: quotelength - 1,
                inReal: closes,
                optInFastPeriod: 3,
                optInSlowPeriod: 50,
                optInSignalPeriod: 10
            });
            console.log(MACD_3_50_10["outMACDHist"].length);
        })
        .then(function(val) {
            process.exit(0);
        })
        .catch(function(err, result) {
            console.log('err: ' + err + ', result: ' + result);
            process.exit(0);

        });
});