/**
 * Common webpack config
 */
import path from 'path';
import webpack from 'webpack';

import Dotenv from 'dotenv-webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import WorkboxPlugin from 'workbox-webpack-plugin';
import VueLoaderPlugin from 'vue-loader/lib/plugin';

import config from './config';

let webpackConfig = {

  // Entry files
  entry: {
      'app': path.resolve(config.srcJsPath, 'app.js')
  },

  // Output files
  output: {
    path: path.resolve(config.distJsPath),
    filename: '[name].js',
    publicPath: '/'
  },

  // Resolve helpers
  resolve: {
    modules: [
      path.resolve(config.root, 'node_modules')
    ],
    alias: {
      'vue$': 'vue/dist/vue.js',
    }
  },

  // Loaders
  module: {
    rules: [{
        // Vue files loader
        test: /\.vue$/,
        exclude: /node_modules/,
        loader: 'vue-loader'
      },{
        // JavaScriprt files loader
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      },{
        // Stylesheet files loader
        test: /\.(css|scss)$/,
          use: [
            { loader: 'vue-style-loader' },
            { loader: 'style-loader' },
            { loader: 'css-loader' },
            { loader: 'postcss-loader' },
            { loader: 'sass-loader',
              options: { includePaths: [ path.resolve(config.root, 'node_modules/bootstrap/scss') ]}
            }]
      }, {
        // Template files loader
        test: /\.(html|ejs)$/,
        exclude: /node_modules/,
        loader: path.resolve('./tasks/loaders/ejs.js'),
    }]
  },

  // Plugins
  plugins: [
    // Load environmental variables from .env file.
    new Dotenv(),

    // Replace environmental variables in assets with given values.
    new webpack.EnvironmentPlugin({
      NODE_ENV: "development",
      SW: false,
      HMR: true,
      FLICKR_API_KEY: null,
      GOOGLE_MAPS_API_KEY: null,
      SENTRY_DNS: null
    }),

    // Generate HTML index.html file from template using ejs|html loader.
    new HtmlWebpackPlugin({
        chunks: ['app', 'vendor~app'],
        template: path.resolve(config.srcTemplatePath, 'index.html'),
        filename: path.resolve(config.distTemplatePath, 'index.html')
    }),

    // Generate Service Worker manifest and sw.js file.
    new WorkboxPlugin.InjectManifest({
      swSrc: path.resolve(config.srcJsPath, 'sw.js')
    }),

    // Include vue-loader plugin to handle .vue files properly in modules section.
    new VueLoaderPlugin(),
  ],
};

export default webpackConfig;
