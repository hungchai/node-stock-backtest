'use strict'

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
global.fs = require('fs');
global.moment = require('moment-timezone');

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
    co(function*(symbol, share) {
            symbol = '00700:HK';
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
            let holdprice = -1;
            
            let quotelength = closes.length;
            
            let buyrules = {};
            let sellrules = {};
            let backtestResult = [];
            

            //start
            var ROCP = yield talib.exec({
                name: "ROCP",
                startIdx: 0,
                endIdx: quotelength-1,
                high: highs,
                low: lows,
                close: closes,
                open: opens,
                inReal: closes,
                optInTimePeriod:3
            });
            console.log(ROCP["outReal"].length);
            
            var WILLR_9 = yield talib.exec({
                name: "WILLR",
                startIdx: 0,
                endIdx: quotelength-1,
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
            

            //buyrules["buy_ROCP<3"] = function(idx) {
            //    if (ROCP["outReal"][idx] != null)
            //    {
            //        if (ROCP["outReal"][idx] <= -0.03 )
            //            return true;
            //        else
            //            return false;
            //    }else
            //    {
            //        return false;
            //    }
            //};
            // buyrules["buy_1_WILLR"] = function(idx) {
            //     if (WILLR_9["outReal"][idx] != null)
            //     {
            //         if (WILLR_9["outReal"][idx] < -80)
            //             return true;
            //         else
            //             return false;
            //     }else
            //     {
            //         return false;
            //     }
            // };
             buyrules["buy_3_MACD_outMACDSignal_UPING"] = function(idx) {
                 if (MACD_3_50_10["outMACDHist"][idx] != null && MACD_3_50_10["outMACDHist"][idx-5] != null )
                 {
                     if (MACD_3_50_10["outMACDHist"][idx] >=0 && MACD_3_50_10["outMACDHist"][idx-1] < 0 &&  MACD_3_50_10["outMACDSignal"][idx] < 0 && MACD_3_50_10["outMACDSignal"][idx-5] < MACD_3_50_10["outMACDSignal"][idx] )
                         return true;
                     else
                         return false;
                 }else
                 {
                     return false;
                 }
             };
            sellrules["sell_macd"] = function(idx)
            {
                if (MACD_3_50_10["outMACDHist"][idx] != null)
                {
                    if (MACD_3_50_10["outMACDHist"][idx] <0 && MACD_3_50_10["outMACDHist"][idx-1] >= 0 )
                        return true;
                    else
                        return false;
                }else
                {
                    return false;
                }
            }
            sellrules["sell_2percent"] = function(idx)
            {

                    if ((closes[idx] - holdprice)/holdprice>=0.04)
                    {
                        return true;
                    }else if ((closes[idx] - holdprice)/holdprice<=(-0.04))
                    {
                        return true;
                    }
                    else{
                        return false;
                    }
            }
                    
            var idx = 0;
            for (idx; idx < quotelength - 1; idx++) {
                var dayResult = {};
                dayResult.date = moment(dates[idx].toISOString()).tz( "Asia/Hong_Kong").format();
                dayResult.close = closes[idx];
                dayResult.high = highs[idx];
                dayResult.low = lows[idx];
                dayResult.open = opens[idx];
                dayResult.volume = volumes[idx];
                dayResult.turnover = turnovers[idx];
                dayResult.holdprice = holdprice;
                dayResult.profit = 0;
                for(var buyruleName in buyrules)
                {
                  dayResult[buyruleName] = false;
                }
                for(var sellruleName in sellrules)
                {
                  dayResult[sellruleName] = false;
                }

                for(var buyruleName in buyrules)
                {
                    if (holdprice<0 && buyrules[buyruleName](idx))
                    {
                        holdprice = closes[idx];
                        dayResult.holdprice = closes[idx];
                        dayResult[buyruleName] = true;
                    }else if (buyrules[buyruleName](idx))
                    {
                        dayResult[buyruleName] = true;
                    }
                };
                for(var sellruleName in sellrules)
                {
                    if (holdprice>0 && sellrules[sellruleName](idx))
                    {
                        dayResult.profit = closes[idx]-holdprice;
                        dayResult[sellruleName] = true;
                        holdprice = -1;
                        break;
                    }
                };
                
                backtestResult.push(dayResult);
                dayResult = null;
            }
            //end
            
            return backtestResult;
        })
        .then(function(backtestResult) {
            var xlsResult = json2xls(backtestResult);
            fs.writeFileSync('./backtestResult.xlsx', xlsResult, 'binary');
            process.exit(0);
        })
        .catch(function(err, result) {
            console.log('err: ' + err + ', result: ' + result);
            process.exit(0);

        });
});