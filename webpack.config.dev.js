const HtmlWebpackPlugin = require('html-webpack-plugin')
const path = require('path')
const webpack = require('webpack')

module.exports = {
  devtool: 'eval',
  entry: [
    'babel/polyfill',
    './website/index.js'
  ],
  output: {
    path: 'build',
    filename: '/static/[name].js'
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      inject: true,
      template: './website/index.html'
    }),
    new webpack.NoErrorsPlugin()
  ],
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: path.join(__dirname, 'node_modules'),
        loader: 'babel'
      },
      {
        test: /\.css$/,
        loaders: ['style', 'css?modules&importLoaders=1', 'cssnext'],
        include: path.join(__dirname, 'website')
      }
    ]
  },
  devServer: {
    contentBase: 'build',
    port: 3456
  }
}
