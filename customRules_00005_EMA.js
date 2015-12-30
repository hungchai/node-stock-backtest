                var EMA_5 = yield talib.exec({
                    name: 'EMA',
                    startIdx: 0,
                    endIdx: quotelength - 1,
                    inReal: closes,
                    optInTimePeriod: 5
                });
                var EMA_10 = yield talib.exec({
                    name: 'EMA',
                    startIdx: 0,
                    endIdx: quotelength - 1,
                    inReal: closes,
                    optInTimePeriod: 10
                });
                var EMA_20 = yield talib.exec({
                    name: 'EMA',
                    startIdx: 0,
                    endIdx: quotelength - 1,
                    inReal: closes,
                    optInTimePeriod: 20
                });
                
                customHeaders["EMA_5"] = function(idx) {
                    return EMA_5["outReal"][idx];
                };
                
                customHeaders["EMA_10"] = function(idx) {
                    return EMA_10["outReal"][idx];
                };
                customHeaders["EMA_20"] = function(idx) {
                    return EMA_20["outReal"][idx];
                };

                buyrules["buy_EMA_5>EMA_10>EMA_20"] = function(idx, holdprice) {
                   if (EMA_10["outReal"][idx-1] != null)
                   {
                       if (EMA_5["outReal"][idx] > EMA_10["outReal"][idx])
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
                sellrules["EMA_5<EMA_10"] = function(idx, holdprice) {
                    if (EMA_10["outReal"][idx] > EMA_5["outReal"][idx]) {
                        return true;
                    }
                    else {
                        return false;
                    }
                };