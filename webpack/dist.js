/* eslint-disable import/no-extraneous-dependencies */
const webpack = require('webpack');
const merge = require('webpack-merge');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');

const reporter = require('./scripts/reporter');

const baseConfig = require('./config');

const compiler = webpack(
  merge(
    baseConfig,
    {
      devtool: false,
      plugins: [
        new webpack.DefinePlugin({'process.env.NODE_ENV': JSON.stringify('production')}),
        new webpack.optimize.ModuleConcatenationPlugin(),
        new webpack.optimize.UglifyJsPlugin(),
        new OptimizeCssAssetsPlugin({
          // processor fallback to cssnano
          cssProcessorOptions: {
            safe: true,
            autoprefixer: {
              add: true,
              remove: true,
              // http://browserl.ist/
              browsers: 'last 2 Android versions, last 2 and_chr versions, last 4 ios_saf versions',
            },
          },
          canPrint: true,
        }),
      ],
    }
  )
);

compiler.run(reporter);
