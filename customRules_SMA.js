
                var ROCP = yield talib.exec({
                    name: "ROCP",
                    startIdx: 0,
                    endIdx: quotelength - 1,
                    high: highs,
                    low: lows,
                    close: closes,
                    open: opens,
                    inReal: closes,
                    optInTimePeriod: 3
                });
                //console.log(ROCP["outReal"].length);

                var WILLR_9 = yield talib.exec({
                    name: "WILLR",
                    startIdx: 0,
                    endIdx: quotelength - 1,
                    high: highs,
                    low: lows,
                    close: closes,
                    open: opens,
                    inReal: closes,
                    optInTimePeriod: 9
                });
                //console.log(WILLR_9["outReal"].length);

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
                //console.log(RSI_9["outReal"].length);

                var MACD_3_50_10 = yield talib.exec({
                    name: "MACD",
                    startIdx: 0,
                    endIdx: quotelength - 1,
                    inReal: closes,
                    optInFastPeriod: 3,
                    optInSlowPeriod: 50,
                    optInSignalPeriod: 10
                });
                //console.log(MACD_3_50_10["outMACDHist"].length);


                buyrules["buy_WILLR_9_-70"] = function(idx, holdprice) {
                    if (WILLR_9["outReal"][idx] != null) {
                        if (WILLR_9["outReal"][idx] <= -70)
                            return true;
                        else
                            return false;
                    }
                    else {
                        return false;
                    }
                };
                sellrules["win_4%"] = function(idx, holdprice) {
                    if ((closes[idx] - holdprice)/holdprice >= 0.03) {

                        return true;
                    }
                    else if
                    ((closes[idx] - holdprice)/holdprice <= -0.04) {

                        return true;
                    }else
                    {
                        return false;
                    }
                };
