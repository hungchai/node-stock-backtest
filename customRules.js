
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


                buyrules["buy_3_MACD_outMACDSignal_UP"] = function(idx) {
                    if (MACD_3_50_10["outMACDHist"][idx] != null && MACD_3_50_10["outMACDHist"][idx - 5] != null) {
                        if (MACD_3_50_10["outMACDHist"][idx] >= 0 && MACD_3_50_10["outMACDHist"][idx - 1] < 0 && MACD_3_50_10["outMACDSignal"][idx] < 0 && MACD_3_50_10["outMACDSignal"][idx - 5] < MACD_3_50_10["outMACDSignal"][idx])
                            return true;
                        else
                            return false;
                    }
                    else {
                        return false;
                    }
                };
                sellrules["sell_macd"] = function(idx) {
                    if (MACD_3_50_10["outMACDHist"][idx] != null) {
                        if (MACD_3_50_10["outMACDHist"][idx] < 0 && MACD_3_50_10["outMACDHist"][idx - 1] >= 0)
                            return true;
                        else
                            return false;
                    }
                    else {
                        return false;
                    }
                };
