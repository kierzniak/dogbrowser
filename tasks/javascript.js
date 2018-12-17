/**
* Gulp task provider for processing javascript
*/
import config from './config';

import gulp from 'gulp';
import once from 'gulp-once';
import eslint from 'gulp-eslint';

import webpack from 'webpack';
import webpackStream from 'webpack-stream';

import webpackConfig from './webpack'

/**
* Task provided for linting browser js files
*/
gulp.task('javascript:lint', function () {

  return gulp.src(config.srcJsPath + '/**/*.{js,vue}')
    .pipe(once())
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(gulp.dest(config.srcJsPath));
});

/**
* Task provided for fixing code styling in browser js files
*/
gulp.task('javascript:fix', function () {

  return gulp.src(config.srcJsPath + '/**/*.{js,vue}')
    .pipe(once())
    .pipe(eslint({ fix: true }))
    .pipe(gulp.dest(config.srcJsPath));
});

/**
* Task provided for "compile" browser js files by webpack
*/
gulp.task('javascript:compile', function () {

  return gulp.src(config.srcJsPath + '/*.js')
    .pipe(webpackStream(webpackConfig, webpack))
    .pipe(gulp.dest(config.distJsPath));
});

/**
* Taks provided for inspecting javascript files
*/
gulp.task('javascript:inspect', gulp.series(
    'javascript:lint'
));

/**
* Taks provided for gather all build tasks
*/
gulp.task('javascript:build', gulp.series(
    'javascript:compile'
));

/**
* Task provided for listening changes on js files and processing it
*/
gulp.task('javascript:watch', function (done) {
  gulp.watch(config.jsWatchGlob, gulp.series('javascript:fix', 'javascript:lint'));
  done();
});

