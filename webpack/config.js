/* eslint-disable import/no-extraneous-dependencies, no-useless-escape */
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const sass = require('node-sass');

const path = require('path');
const url = require('url');

const PACKAGE = require('../package.json');
const BANNER = require('./scripts/banner');
const {MULTI_TENANT} = require('../src/config.json');

const {
  eban_api: EBAN_API,
  client_id: CLIENT_ID,
  basename: BASENAME,
  bc_no: TENANT_ID,
} = require('yargs')
  .options({
    // --eban_api
    eban_api: {
      default: 'http://localhost:8081/ebankingMobileLogin/',
      type: 'string',
    },
    // --client_id
    client_id: {
      default: '0f07e1ab8141891c3c7f81f18959e45012798c14',
      type: 'string',
    },
    // --basename
    basename: {
      default: '/public/portal/',
      type: 'string',
    },
    bc_no: {
      default: undefined,
      type: 'string',
    }
  })
  .argv;

const API_LIB_URL = url.resolve(EBAN_API, 'staticcontent/html/api/api.js');

const ROOT_DIR = process.cwd();

const publicPath = BASENAME;

module.exports = {
  context: path.join(ROOT_DIR, 'src'),
  entry: {
    index: [
      'babel-polyfill',
      path.join(ROOT_DIR, 'src', 'index.js'),
    ],
    app: [
      'babel-polyfill',
      path.join(ROOT_DIR, 'src', 'app.js'),
    ],
    eban2: path.join(ROOT_DIR, 'src', 'eban2.scss'),
    postMessageApi: path.join(ROOT_DIR, 'src/widgets/campaigner/plugins', 'postMessageApi.js'),
  },
  output: {
    path: path.join(ROOT_DIR, 'dist'),
    filename: 'js/[name].[hash:7].js',
    chunkFilename: 'js/[name].[hash:7].js',
    publicPath,
  },
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        loader: 'eslint-loader',
        options: {
          emitWarning: false,
          emitError: false,
          quiet: false,
          failOnError: false,
          failOnWarning: false,
        },
      },
      {
        oneOf: [
          {
            test: /\.(css|scss)$/,
            use: ExtractTextPlugin.extract({
              use: [
                {
                  loader: 'css-loader',
                  options: {
                    modules: false,
                    import: true,
                    url: true,
                    minimize: {
                      autoprefixer: {
                        add: true,
                        remove: true,
                        // http://browserl.ist/
                        browsers: 'last 2 Android versions, last 2 and_chr versions, last 4 ios_saf versions',
                      },
                    },
                    sourceMap: true,
                    camelCase: false,
                    importLoaders: 2,
                  },
                },
                {
                  loader: 'resolve-url-loader',
                  options: {sourceMap: true},
                },
                {
                  loader: 'sass-loader',
                  options: {
                    sourceMap: true,
                    functions: {
                      getTenant() {
                        const tenant = TENANT_ID && MULTI_TENANT.custom && !!MULTI_TENANT.mapping[TENANT_ID] &&
                        MULTI_TENANT.mapping[TENANT_ID].toUpperCase();

                        return tenant
                          ? sass.types.String(tenant)
                          : sass.types.Null.NULL;
                      },
                    },
                  },
                },
              ],
              publicPath: '../',
            }),
          },
          {
            test: /\.(js|jsx)$/,
            exclude: /node_modules/,
            use: {
              loader: 'babel-loader',
              options: {
                babelrc: true,
                plugins: [
                  ['replace-imports', {
                    test: /\/___tenant___/,
                    replacer: `/${(TENANT_ID && MULTI_TENANT.custom && !!MULTI_TENANT.mapping[TENANT_ID] &&
                      MULTI_TENANT.mapping[TENANT_ID].toUpperCase()) || ''}`,
                  }],
                ],
              },
            },
          },
          {
            test: /\.html$/,
            use: 'html-loader',
          },
          {
            test: /\.json$/,
            use: 'json-loader',
          },
          {
            test: /\/P2.woff$/,
            use: {
              loader: 'url-loader',
              options: {
                limit: 50000,
                name: 'assets/fonts/[name].[hash:7].[ext]',
              },
            },
          },
          {
            test: /\.(woff2|woff|ttf)$/,
            use: {
              loader: 'url-loader',
              options: {
                limit: 10000,
                name: 'assets/fonts/[name].[hash:7].[ext]',
              },
            },
          },
          {
            test: /\.(l20n|png|jpg|jpeg)$/,
            use: {
              loader: 'file-loader',
              options: {
                name: 'assets/images/[name].[hash:7].[ext]',
              },
            },
          },
          {
            test: /\.(pdf|docx)$/,
            use: {
              loader: 'file-loader',
              options: {
                name: 'assets/docs/[path][name].[ext]',
              },
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new ExtractTextPlugin('css/[name].[hash:7].css'),
    new webpack.BannerPlugin(BANNER),
    new HtmlWebpackPlugin({
      template: path.join(ROOT_DIR, 'src', 'index.ejs'),
      ebanApiLibraryUrl: API_LIB_URL,
      filename: 'index.html',
      chunks: ['index'],
      library: ['CLX'],
      libraryTarget: 'umd',
    }),
    new HtmlWebpackPlugin({
      template: path.join(ROOT_DIR, 'src', 'app.ejs'),
      ebanApiLibraryUrl: API_LIB_URL,
      frontendAppVersion: PACKAGE.version,
      filename: 'app.html',
      chunks: ['app'],
      library: ['CLX'],
      libraryTarget: 'umd',
    }),
    new webpack.DefinePlugin({
      __CLIENT_ID__: JSON.stringify(CLIENT_ID),
      __BASENAME__: JSON.stringify(BASENAME),
    }),
    new webpack.LoaderOptionsPlugin({
      options: {
        context: path.join(ROOT_DIR, 'src'),
        output: {path: path.join(ROOT_DIR, 'dist')},
      },
    }),
    // load a subset of locales for moment
    new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /^\.\/(en.*|de.*|fr.*|it.*|es.*)$/),
    // load a subset of locales for numeral
    new webpack.ContextReplacementPlugin(/numeral[\/\\]locales$/, /^\.\/(en.*|de.*|fr.*|it.*|es.*)$/),
  ],
  resolve: {
    extensions: ['.js', '.jsx'],
    modules: [
      'node_modules',
    ],
  },
};
