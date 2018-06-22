const webpackConfig = require('./common');
const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const merge = require('webpack-merge')

module.exports = merge({
  entry: {
    ze: path.resolve(__dirname, '../src/index.js'),
    demo: path.resolve(__dirname, '../demo/demo.js')
  },
  devtool: 'cheap-source-map',
  watch: true,
  watchOptions: {
    aggregateTimeout: 300,
    poll: 1000
  },
  mode: 'development',
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      title: 'Demo',
      template: path.join(__dirname, '../demo/index.html'),
    })
  ],
  devServer: {
    contentBase: path.join(__dirname, '../dist'),
    historyApiFallback: false,
    compress: true,
    hot: true,
    host: '0.0.0.0'
  }
}, webpackConfig);
