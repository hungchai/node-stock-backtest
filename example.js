'use strict'
global.config = require('./config/config.json');
global.talib = require('co-talib');
global.config = require('./config/config.json');
global.mongoose = require('mongoose');
global.MongoClient = require('mongodb').MongoClient;
global.co = require('co');
global.parallel = require('co-parallel');
global.thunkify = require('thunkify');
global.util = require('util');
global._ = require("underscore");
global.json2xls = require('json2xls');
global.fs = require('co-fs');
global.BacktestResult = require('./backtestRunner');

try {
    global.mongoURI = global.config.mongoDbConn;
}
catch (err) {
    global.mongoURI = global.config.mongoDbConn;
}

mongoose.connect(global.mongoURI);
console.log("TALib Version: " + talib.version);

var mongoSchema = require('./Schema');
var StockQuotesArrayModel = mongoose.model("StockQuotesArray");

mongoose.connection.on("open", function(err) {
    co(function*() {
        var symbol = '00700:HK';
        let stockQuotesArray = yield StockQuotesArrayModel.findBySymbol(symbol);
        let customRulesScript = yield fs.readFile('customRules.js', 'utf8');
        console.log(customRulesScript);
        var bt = new BacktestResult(stockQuotesArray,customRulesScript);
        let backtestResult =yield  bt.run();
        return backtestResult;
    }).
    then(function(backtestResult) {
        var xlsResult = json2xls(backtestResult);
        fs.writeFileSync('./backtestResult_' + (new Date()).toISOString + '.xlsx', xlsResult, 'binary');
        process.exit(0);
    }).catch(function(err, result) {
        console.log('err: ' + err + ', result: ' + result);
        process.exit(0);

    });

});