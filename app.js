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
    
    let stockQuotesArray = yield StockQuotesArrayModel.findBySymbol('00003:HK');
        
    util.print(stockQuotesArray); 
    
    })
    .then
    (function (val) {

    })
    .catch(function (err, result) {
        console.log('err: ' + err + ', result: ' + result);
        process.exit(0);

    });
});