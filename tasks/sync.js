/**
* Gulp task provider for syncing static files
*/
import gulp from 'gulp';

import config from './config';

/**
 * Task provided for syncing manifest file
 */
gulp.task('sync:manifest', function () {

  return gulp.src(config.src + '/assets/manifest.json')
    .pipe(gulp.dest(config.dist));
});

/**
 * Task provided for syncing _redirects file
 */
gulp.task('sync:redirects', function () {

  return gulp.src(config.src + '/assets/_redirects')
    .pipe(gulp.dest(config.dist));
});

/**
 * Task provided for syncing _headers file
 */
gulp.task('sync:headers', function () {

  return gulp.src(config.src + '/assets/_headers')
    .pipe(gulp.dest(config.dist));
});

/**
 * Taks provided for gather all build tasks
 */
gulp.task('sync:build', gulp.series([
  'sync:manifest',
  'sync:redirects',
  'sync:headers'
]));
