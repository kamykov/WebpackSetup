/* eslint-disable import/no-extraneous-dependencies, no-console */
const webpack = require('webpack');
const merge = require('webpack-merge');
const WebpackDevServer = require('webpack-dev-server');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const path = require('path');

const baseConfig = require('./config');

const {
  host: HOST,
  port: PORT,
  https: HTTPS,
} = require('yargs')
  .options({
    // --host
    host: {
      default: '0.0.0.0',
      type: 'string',
    },
    // --port
    port: {
      default: 9000,
      type: 'number',
    },
    // --https
    https: {
      default: false,
      type: 'boolean',
    },
  })
  .argv;

const ROOT_DIR = process.cwd();

const compiler = webpack(
  merge(
    baseConfig,
    {
      entry: {
        showcase: path.join(ROOT_DIR, 'src', 'showcase', 'index.jsx'),
      },
      devtool: 'source-map',
      plugins: [
        new webpack.DefinePlugin({'process.env.NODE_ENV': JSON.stringify('development')}),
        new webpack.LoaderOptionsPlugin({debug: true}),
        new HtmlWebpackPlugin({
          template: path.join(ROOT_DIR, 'src', 'showcase', 'index.html'),
          filename: 'showcase.html',
          chunks: ['showcase'],
        }),
      ],
    }
  )
);

const devServer = new WebpackDevServer(
  compiler,
  {
    historyApiFallback: true,
    publicPath: '/',
    hot: true,
    quiet: false,
    compress: false,
    noInfo: false,
    stats: {
      // Add asset information
      assets: true,
      // Sort assets by a field
      // You can reverse the sort with `!field`.
      assetsSort: 'field',
      // Add information about cached (not built) modules
      cached: false,
      // Show cached assets (setting this to `false` only shows emitted files)
      cachedAssets: false,
      // Add children information
      children: false,
      // Add chunk information (setting this to `false` allows for a less verbose output)
      chunks: false,
      // Add built modules information to chunk information
      chunkModules: true,
      // Add the origins of chunks and chunk merging info
      chunkOrigins: false,
      // Sort the chunks by a field
      // You can reverse the sort with `!field`. Default is `id`.
      chunksSort: 'field',
      // `webpack --colors` equivalent
      colors: true,
      // Context directory for request shortening
      context: '../src/',
      // Display the distance from the entry point for each module
      depth: false,
      // Display the entry points with the corresponding bundles
      entrypoints: false,
      // Add errors
      errors: true,
      // Add details to errors (like resolving log)
      errorDetails: true,
      // Exclude assets from being displayed in stats
      // This can be done with a String, a RegExp, a Function getting the assets name
      // and returning a boolean or an Array of the above.
      // excludeAssets: 'filter' | /filter/ | (assetName) => ... return true|false |
      //   ['filter'] | [/filter/] | [(assetName) => ... return true|false],
      excludeAssets: [
        /^.*\.map$/,
      ],
      // Exclude modules from being displayed in stats
      // This can be done with a String, a RegExp, a Function getting the modules source
      // and returning a boolean or an Array of the above.
      // excludeModules: 'filter' | /filter/ | (moduleSource) => ... return true|false |
      //   ['filter'] | [/filter/] | [(moduleSource) => ... return true|false],
      excludeModules: [
        /node_modules/,
        /^(?!.*\.(js|jsx)$)/,
      ],
      // See excludeModules
      // exclude: 'filter' | /filter/ | (moduleSource) => ... return true|false |
      //   ['filter'] | [/filter/] | [(moduleSource) => ... return true|false],
      // Add the hash of the compilation
      hash: false,
      // Set the maximum number of modules to be shown
      maxModules: Infinity,
      // Add built modules information
      modules: false,
      // Sort the modules by a field
      // You can reverse the sort with `!field`. Default is `id`.
      modulesSort: 'field',
      // Show dependencies and origin of warnings/errors (since webpack 2.5.0)
      moduleTrace: false,
      // Display bailout reasons
      optimizationBailout: false,
      // Show performance hint when file size exceeds `performance.maxAssetSize`
      performance: false,
      // Show the exports of the modules
      providedExports: false,
      // Add public path information
      publicPath: false,
      // Add information about the reasons why modules are included
      reasons: false,
      // Add the source code of modules
      source: false,
      // Add timing information
      timings: true,
      // Show which exports of a module are used
      usedExports: false,
      // Add webpack version information
      version: false,
      // Add warnings
      warnings: true,
      // Filter warnings to be shown (since webpack 2.4.0),
      // can be a String, Regexp, a function getting the warning and returning a boolean
      // or an Array of a combination of the above. First match wins.
      // warningsFilter: 'filter' | /filter/ | ['filter', /filter/] | (warning) => ... return true|false
    },
    watchOptions: {
      ignored: /(node_modules|dist)/,
    },
    https: HTTPS,
  }
);

const isInteractive = process.stdout.isTTY;
const address = `${HTTPS ? 'https' : 'http'}://${HOST === '0.0.0.0' ? 'localhost' : HOST}:${PORT}`;

const tcpServer = devServer.listen(PORT, HOST, () => {
  // Connections will end after ~5 seconds (arbitrary), affecting download of large pieces of content.
  // This results in browsers throwing a "net::ERR_CONTENT_LENGTH_MISMATCH" error.
  // https://nodejs.org/api/http.html#http_server_keepalivetimeout
  tcpServer.keepAliveTimeout = 120000;
});

tcpServer
  .on('listening', () => {
    if (isInteractive) {
      console.log(`Server listening on ${address}`);
      console.log();
    }
  })
  .on('error', (err) => {
    if (isInteractive) {
      if (err.code === 'EADDRINUSE') {
        console.log(`Address \`${address}\` in use`);
        console.log();
      }
    }
  });
