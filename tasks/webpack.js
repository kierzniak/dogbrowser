/**
 * Webpack config
 */
import merge from 'webpack-merge';

import commonWebpackConfing from './webpack.common.js';
import developmentWebpackConfing from './webpack.development.js';
import productionWebpackConfing from './webpack.production.js';

let webpackConfig;

switch(process.env.NODE_ENV) {
  case 'production':
    webpackConfig = merge.smart(commonWebpackConfing, productionWebpackConfing);
    break;
  case 'development':
    webpackConfig = merge.smart(commonWebpackConfing, developmentWebpackConfing);
  default:
    break;
}

export default webpackConfig;
