/**
 * Production webpack config
 */
import path from 'path';

import MiniCssExtractPlugin from "mini-css-extract-plugin";

import config from './config';

let webpackConfig = {
  mode: 'production',
  devtool: 'source-map',

  // Output files
  output: {
    filename: '[name].[contenthash:8].min.js'
  },

  // Resolve helpers
  resolve: {
    alias: {
      'vue$': 'vue/dist/vue.min.js',
    }
  },
  module: {
    rules: [{
      // Stylesheet files loader
      test: /\.(css|scss)$/,
      use: [
        { loader: 'vue-style-loader' },
        { loader: MiniCssExtractPlugin.loader },
        { loader: 'css-loader' },
        { loader: 'postcss-loader' },
        { loader: 'sass-loader',
          options: { includePaths: [ path.resolve(config.root, 'node_modules/bootstrap/scss') ]}
      }]
    }]
  },

  plugins: [
    new MiniCssExtractPlugin({
      filename: 'css/[name].[contenthash:8].css',
    }),
  ],
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /node_modules/,
          chunks: 'all',
          priority: 1
        }
      }
    }
  }
};

export default webpackConfig;
