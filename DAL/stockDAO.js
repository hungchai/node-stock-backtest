var mongoose = require('mongoose');

var getStockDayQuote = function (symbol, StockDayQuoteModel) {
    return function (callback) {
        var aggreg = StockDayQuoteModel.aggregate(
            [
                //// Stage 1
                {
                    $match: {
                        "symbol": symbol
                    }
                },
                // Stage 2
                {
                    $sort: {
                        "symbol": 1,
                        "date": 1
                    }
                },

                // Stage 3
                {
                    $group: {
                        "_id": "$symbol",

                        "highs": {
                            "$push": "$high"
                        },
                        "lows": {
                            "$push": "$low"
                        },
                        "opens": {
                            "$push": "$open"
                        },
                        "closes": {
                            "$push": "$close"
                        },
                        "volumes": {
                            "$push": {$ifNull: ["$volume", 0]}
                        },
                        "turnover": {
                            "$push": {$ifNull: ["$turnover", 0]}
                        },
                        "dates": {
                            "$push": "$date"
                        }
                    }
                }
            ]);

        aggreg.options = {allowDiskUse: true};
        aggreg.exec(function (err, result) {
            callback(err, result);
        });
    }
}

var transformStockDayQuote = function (StockDayQuoteModel) {
    return function (callback) {

        var aggreg = StockDayQuoteModel.aggregate(
            [

                // Stage 2
                {
                    $sort: {
                        "symbol": 1,
                        "date": 1
                    }
                },

                // Stage 3
                {
                    $group: {
                        "_id": "$symbol",

                        "highs": {
                            "$push": "$high"
                        },
                        "lows": {
                            "$push": "$low"
                        },
                        "opens": {
                            "$push": "$open"
                        },
                        "closes": {
                            "$push": "$close"
                        },
                        "volumes": {
                            "$push": {$ifNull: ["$volume", 0]}
                        },
                        "turnover": {
                            "$push": {$ifNull: ["$turnover", 0]}
                        },
                        "dates": {
                            "$push": "$date"
                        }
                    }
                },
                {$out: "stockQuotesArray"}
            ]);

        aggreg.options = {allowDiskUse: true};
        aggreg.exec(function (err, result) {
            callback(err, result);
        });
    }
}
module.exports.getStockDayQuote = getStockDayQuote;
module.exports.transformStockDayQuote = transformStockDayQuote;