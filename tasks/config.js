import path from "path";

/**
 * Config file with base variables.
 *
 * To load variables into file just include this file. e.g.
 *
 * import config from './config';
 * console.log(config.src);
 */

/**
 * Base variables
 *
 * Path relative to path where gulp is executed. Probably root directory
 */
let root = './';
let src = './src';
let dist = './dist';

/**
 * File paths
 */

let srcTemplatePath = src + '/assets/template';
let distTemplatePath = dist + '/';

let srcJsPath = path.resolve(src);
let distJsPath = path.resolve(dist);
let jsWatchGlob = [srcJsPath + '/**/*.{js,vue}'];

let srcCssPath = path.resolve(src + '/assets/scss');
let distCssPath = path.resolve(dist + '/css');
let cssWatchGlob = [srcCssPath + '/**/*.scss'];

let srcImgPath = path.resolve(src + '/assets/img');
let distImgPath = path.resolve(dist + '/img');

let srcIconsPath = path.resolve(src + '/assets/icons');
let distIconsPath = path.resolve(dist + '/img/icons');

export default {
    root,
    src,
    dist,

    srcTemplatePath,
    distTemplatePath,

    srcJsPath,
    distJsPath,
    jsWatchGlob,

    srcCssPath,
    distCssPath,
    cssWatchGlob,

    srcImgPath,
    distImgPath,

    srcIconsPath,
    distIconsPath
};
