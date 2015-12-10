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

console.log("TALib Version: " + talib.version);

var stockDAO = require('./DAL/stockDAO.js');
require('./Schema/stockDayQuoteSchema.js')();
require('./Schema/stockProfileSchema.js')();
require('./Schema/stockQuotesArray.js')();

var StockProfileModel = mongoose.model("StockProfile");
var StockQuotesArrayModel = mongoose.model("StockQuotesArray");

try {
    global.mongoURI = global.config.mongoDbConn;
}
catch (err) {
    global.mongoURI = global.config.mongoDbConn;
}
mongoose.connect(global.mongoURI);


mongoose.connection.on("open", function (err) {
    if (err != undefined)
        console.log(err.message);
    else
        console.log("connected");
});