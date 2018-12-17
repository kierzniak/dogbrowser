/**
 * Development webpack config
 */
import path from 'path';
import webpack from 'webpack';

import BundleAnalyzerPlugin from 'webpack-bundle-analyzer';

import config from './config';

let entry = [path.resolve(config.srcJsPath, 'app.js')];
let plugins = [new BundleAnalyzerPlugin.BundleAnalyzerPlugin()];

if (process.env.HMR) {
  entry.unshift('webpack/hot/dev-server', 'webpack-hot-middleware/client');
  plugins.push(new webpack.HotModuleReplacementPlugin());
}

let webpackConfig = {
    mode: 'development',
    devtool: 'eval-source-map',

    // Entry files
    entry: {
      'app': entry,
    },

    // Plugins
    plugins: plugins
};

export default webpackConfig;
