/**
* Gulp task provider for processing styles
*/
import config from './config';

import gulp from 'gulp';
import once from 'gulp-once';
import postcss from 'gulp-postcss';

import stylelint from 'gulp-stylelint';

import scss from 'postcss-scss';
import sorting from 'postcss-sorting';

/**
* Task provided for cleaning css directory
*/
gulp.task('stylesheet:clean', function () {

  return gulp.src(config.distCssPath + '/*', {
    read: false
  }).pipe(clean());

});

gulp.task('stylesheet:lint', function () {

  return gulp.src(config.srcCssPath + '/**/*.scss')
    // Sort scss files and save to source directory
    .pipe(once())
    .pipe(stylelint({
      reporters: [
        {
          formatter: 'string',
          console: true
        }
      ],
      // Stylelint will break watch if this is not true
      failAfterError: false,
    }))
    // Save css file
    .pipe(gulp.dest(config.srcCssPath));

});

gulp.task('stylesheet:fix', function () {

  return gulp.src(config.srcCssPath + '/**/*.scss')
    .pipe(once())
    .pipe(stylelint({
      // Fix sccs files using styleling
      fix: true,

      // Stylelint will not save files if this is set to true
      failAfterError: false,
    }, { parser: scss }))
    // Save css file
    .pipe(gulp.dest(config.srcCssPath));

});

gulp.task('stylesheet:sort', function () {

  return gulp.src(config.srcCssPath + '/**/*.scss')
    .pipe(once())
    // Sort scss files and save to source directory
    .pipe(postcss([
      sorting()
    ], { parser: scss }))
    // Save css file
    .pipe(gulp.dest(config.srcCssPath));

});

/**
* Taks provided for inspecting stylesheet files
*/
gulp.task('stylesheet:inspect', gulp.series(
    'stylesheet:lint'
));

/**
* Taks provided for gather all build tasks
*/
gulp.task('stylesheet:build', gulp.series(
    'stylesheet:fix',
    'stylesheet:sort',
    'stylesheet:lint'
));

/**
* Task provided for listening changes on files and processing it
*/
gulp.task('stylesheet:watch', function (done) {
  gulp.watch(config.cssWatchGlob, gulp.series('stylesheet:build'));
  done();
});
