/* eslint-disable import/no-extraneous-dependencies */
const webpack = require('webpack');
const merge = require('webpack-merge');
const {BundleAnalyzerPlugin} = require('webpack-bundle-analyzer');

const reporter = require('./scripts/reporter');

const baseConfig = require('./config');

const compiler = webpack(
  merge(
    baseConfig,
    {
      plugins: [
        new BundleAnalyzerPlugin(),
      ],
    }
  )
);

compiler.run(reporter);
