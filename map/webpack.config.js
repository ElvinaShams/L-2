const path = require('path')
module.exports = {
   watch: true,
   entry: "./src/js/index.js",
   output: {
       filename: "./bundle.js",
       path: path.resolve(__dirname,'build'),
       publicPath: "/"
   },
   devServer: {
    port: 8000,
    historyApiFallback: true,
    hot: true,
},
};