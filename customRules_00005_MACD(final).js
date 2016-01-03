var EMA_Fast = yield talib.exec({
    name: 'SMA',
    startIdx: 0,
    endIdx: quotelength - 1,
    inReal: closes,
    optInTimePeriod:10
});
var EMA_Middle = yield talib.exec({
    name: 'SMA',
    startIdx: 0,
    endIdx: quotelength - 1,
    inReal: closes,
    optInTimePeriod: 30
});
var EMA_Slow = yield talib.exec({
    name: 'SMA',
    startIdx: 0,
    endIdx: quotelength - 1,
    inReal: closes,
    optInTimePeriod: 52
});
var MACD = yield talib.exec({
        name: "MACD",
        startIdx: 0,
        endIdx: quotelength - 1,
        inReal: closes,
        optInFastPeriod: 12,
        optInSlowPeriod: 26,
        optInSignalPeriod: 9}
);
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

customHeaders["MACD"] = function(idx)
{
    return Math.round(MACD['outMACD'][idx] * 1000)/1000+','+Math.round(MACD['outMACDSignal'][idx] * 1000)/1000+','+Math.round(MACD['outMACDHist'][idx] * 1000)/1000;
};

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

buyrules["buy_outMACDHist>0"] = function(idx, holdprice) {
    if (MACD["outMACD"][idx] != null)
    {
        if (MACD['outMACDHist'][idx] >=0 && MACD['outMACDHist'][idx-1] <0)
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

//sellrules["win_3%"] = function(idx, holdprice) {
//    if (((highs[idx] - holdprice) / holdprice) >= 0.03) {
//        return true;
//    }
//    else {
//        return false;
//    }
//};
sellrules["loss_1%"] = function(idx, holdprice) {
    if (((highs[idx] - holdprice) / holdprice) <= -0.01) {
        return true;
    }
    else {
        return false;
    }
};
sellrules["sell_outMACDHist<0"] = function(idx, holdprice) {
    if (MACD['outMACDHist'][idx] <0 && MACD['outMACDHist'][idx-1] >=0){
        return true;
    }
    else {
        return false;
    }
};
              