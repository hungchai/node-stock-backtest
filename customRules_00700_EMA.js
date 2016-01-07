                var EMA_Fast = yield talib.exec({
                    name: 'EMA',
                    startIdx: 0,
                    endIdx: quotelength - 1,
                    inReal: closes,
                    optInTimePeriod:7
                });
                var EMA_Middle = yield talib.exec({
                    name: 'EMA',
                    startIdx: 0,
                    endIdx: quotelength - 1,
                    inReal: closes,
                    optInTimePeriod: 15
                });
                var EMA_Slow = yield talib.exec({
                    name: 'EMA',
                    startIdx: 0,
                    endIdx: quotelength - 1,
                    inReal: closes,
                    optInTimePeriod: 30
                });
                
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
               customHeaders["RSI_9"] = function(idx) {
                    return RSI_9["outReal"][idx];
                };
                customHeaders["EMA_fast"] = function(idx) {
                    return EMA_Fast["outReal"][idx];
                };
                
                customHeaders["EMA_Middle"] = function(idx) {
                    return EMA_Middle["outReal"][idx];
                };
                customHeaders["EMA_Slow"] = function(idx) {
                    return EMA_Slow["outReal"][idx];
                };

                buyrules["buy_EMA_fast>EMA_Middle"] = function(idx, holdprice) {
                   if (RSI_9["outReal"][idx] != null)
                   {
                       if (RSI_9["outReal"][idx]<60 && EMA_Fast["outReal"][idx] > EMA_Middle["outReal"][idx])
                       {
                           return true;
                       }else
                       {
                           return false;
                       }
                   }else
                   {
                       return false;
                   }
                };
                
                sellrules["win_2%"] = function(idx, holdprice) {
                    if (((highs[idx] - holdprice) / holdprice) >= 0.02) {
                        return true;
                    }
                    else {
                        return false;
                    }
                };
                 sellrules["loss_1%"] = function(idx, holdprice) {
                    if (((highs[idx] - holdprice) / holdprice) <= -0.01) {
                        return true;
                    }
                    else {
                        return false;
                    }
                };
