'use strict'
var config = require('./config/config.json');
var mongoose = require('mongoose');
var MongoClient = require('mongodb').MongoClient;
var co = require('co');
var parallel = require('co-parallel');
var thunkify = require('thunkify');
var util = require('util');
var _ = require("underscore");
var json2xls = require('json2xls');
var coFs = require('co-fs');
var fs = require('fs');
var BacktestResult = require('./backtestRunner');

try {
    var mongoURI = config.mongoDbConn;
}
catch (err) {
    var mongoURI = config.mongoDbConn;
}

mongoose.connect(mongoURI)
;

var mongoSchema = require('./Schema');
var StockQuotesArrayModel = mongoose.model("StockQuotesArray");

mongoose.connection.on("open", function (err) {
    co(function*() {
        var symbol = '00700:HK';
        let stockQuotesArray = yield StockQuotesArrayModel.findBySymbol(symbol);
        let customRulesScript = yield coFs.readFile('customRules.js', 'utf8');
        var bt = new BacktestResult(stockQuotesArray, customRulesScript);
        let backtestResult = yield bt.run();
        return backtestResult;
    }).
        then(function (backtestResult) {
            var xlsResult = json2xls(backtestResult);
            fs.writeFileSync('./backtestResult.xlsx', xlsResult, 'binary');
            process.exit(0);
        }).catch(function (err, result) {
            console.log('err: ' + err + ', result: ' + result);
            process.exit(0);

        });

});