'use strict'
var talib = require('co-talib');
var co = require('co');
var thunkify = require('thunkify');
var util = require('util');
var _ = require("underscore");
var moment = require('moment-timezone');

class BacktestRunner {
    constructor(stockQuotesArray, customRulesScript) {
        this.stockQuotesArray = stockQuotesArray;
        this.customRulesScript = customRulesScript;
        console.log("TALib Version: " + talib.version);
    }


    run() {
        //Reserved variable names
        var closes = this.stockQuotesArray.closes;
        var highs = this.stockQuotesArray.highs;
        var lows = this.stockQuotesArray.lows;
        var opens = this.stockQuotesArray.opens;
        var volumes = this.stockQuotesArray.volumes;
        var turnovers = this.stockQuotesArray.turnovers;
        var dates = this.stockQuotesArray.dates;
        var holdprice = -1;
        var quotelength = closes.length;
        var buyrules = [];
        var sellrules = [];

        let backtestResult = [];

        let customRulesScript = this.customRulesScript;
        return function (callback) {
            co(function*() {
                //importance
                //eval(customRulesScript);
                var myFunction = new Function("talib", "co", "closes", "highs", "lows", "opens", "volumes", "turnovers", "dates", "quotelength", "buyrules", "sellrules", 'return function(callback) {co(function*() {'
                    + customRulesScript + ' return "1"})'
                    + '.then(function(val) {callback(null, val)})'
                    + '.catch(function(err, result) {console.log("err: " + err + ", result: " + result);callback(err, result);});}');
                //importance

                var customRulesScriptReady = yield myFunction(talib, co, closes, highs, lows, opens, volumes, turnovers, dates, quotelength, buyrules, sellrules);

                var idx = 0;
                for (idx; idx < quotelength - 1; idx++) {
                    var dayResult = {};
                    dayResult.date = moment(dates[idx].toISOString()).tz("Asia/Hong_Kong").format();
                    dayResult.close = closes[idx];
                    dayResult.high = highs[idx];
                    dayResult.low = lows[idx];
                    dayResult.open = opens[idx];
                    dayResult.volume = volumes[idx];
                    dayResult.turnover = turnovers[idx];
                    dayResult.holdprice = holdprice;
                    dayResult.profit = 0;
                    for (var buyruleName in buyrules) {
                        dayResult[buyruleName] = false;
                    }
                    for (var sellruleName in sellrules) {
                        dayResult[sellruleName] = false;
                    }

                    for (var buyruleName in buyrules) {
                        if (holdprice < 0 && buyrules[buyruleName](idx)) {
                            holdprice = closes[idx];
                            dayResult.holdprice = closes[idx];
                            dayResult[buyruleName] = true;
                        }
                        else if (buyrules[buyruleName](idx)) {
                            dayResult[buyruleName] = true;
                        }
                    }
                    ;
                    for (var sellruleName in sellrules) {
                        if (holdprice > 0 && sellrules[sellruleName](idx)) {
                            dayResult.profit = closes[idx] - holdprice;
                            dayResult[sellruleName] = true;
                            holdprice = -1;
                            break;
                        }
                    }
                    ;

                    backtestResult.push(dayResult);
                    dayResult = null;
                }
                //end

                return backtestResult;
            })
                .then(function (backtestResult) {
                    callback(null, backtestResult);
                })
                .catch(function (err, result) {
                    console.log('err: ' + err + ', result: ' + result);
                    callback(err, result);
                });

        }
    }
}
;

module.exports = BacktestRunner;