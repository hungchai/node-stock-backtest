var talib = require('talib');
var function_desc = talib.explain(process.argv[2]);
console.dir(function_desc);