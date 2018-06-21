const webpack = require('webpack');
const resolve = require('path').resolve;
const pkg = require('../package.json');

module.exports = {
  entry: {
    ze: resolve(__dirname, '../src/index.js')
  },
  output: {
    filename: '[name].js',
    library: 'ZE',
    libraryTarget: 'umd',
    path: resolve(__dirname, '../build/')
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
