const webpack = require('webpack');
const path = require('path');
const resolve = path.resolve;
module.exports = {
  output: {
    filename: '[name].js',
    library: 'ZE',
    libraryTarget: 'umd',
    path: resolve(__dirname, '../dist/')
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        // exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            babelrc: true
          }
        }
      }
    ]
  },
  plugins: [
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.optimize.AggressiveMergingPlugin()
  ]
};
