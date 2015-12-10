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
    if (err != undefined)
        console.log(err.message);
    else
        console.log("connected");
        
    console.log(util.inspect(talib.explain("ADX"), { depth:3 }));  
    var marketContents = fs.readFileSync('./examples/marketdata.json','utf8'); 
    var marketData = JSON.parse(marketContents);

    talib.execute({
    name: "ADX",
    startIdx: 0,
    endIdx: marketData.close.length - 1,
    high: marketData.high,
    low: marketData.low,
    close: marketData.close,
    optInTimePeriod: 9
}, function (result) {

    // Show the result array
    console.log("ADX Function Results:");
    console.log(result);

});
});