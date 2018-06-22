// const webpack = require('webpack');
const webpackConfig = require('./common');
const merge = require('webpack-merge');
const path = require('path');
const resolve = path.resolve;
// const pkg = require('../package.json');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

module.exports = merge({
  entry: {
    ze: resolve(__dirname, '../src/index.js')
  },
  mode: 'production',
  plugins: [
    new CleanWebpackPlugin(['dist'],{root: path.join(__dirname, '../')}),
    new UglifyJSPlugin(),
  ]
}, webpackConfig);
