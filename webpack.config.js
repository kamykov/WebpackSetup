const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const package = require('./package.json');

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'main.bundle.js'
  },
  mode: process.env.NODE_ENV || 'development',
  resolve: {
    extensions: ['.js', '.jsx'],
    modules: ['node_modules']
  },
  devServer: {
    contentBase: path.join(__dirname, 'src'),
    hot: true
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ['babel-loader']
      },
      {
        test: /\.(scss|sass)$/,
        use: ['style-loader', 'css-loader', 'sass-loader']
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'src', 'index.ejs'),
      title: package.title
    })
  ]
};
