/**
* Gulp task provider for processing icons
*/
import gulp from 'gulp';
import mobileIcons from 'gulp-mobile-icons';

import config from './config';

gulp.task('icon:generate:favicon', function () {

  return gulp.src([
    config.srcIconsPath + '/icon.svg'
  ])
    .pipe(mobileIcons({
        'favicon': { width: 192, height: 192 }
    }))
    .pipe(gulp.dest(config.distIconsPath));
});

gulp.task('icon:generate:google', function () {

  return gulp.src([
    config.srcIconsPath + '/icon.svg'
  ])
    .pipe(mobileIcons({

        /** Chrome touch icon **/
        // Reference: https://developer.chrome.com/multidevice/android/installtohomescreen
        'google-192': { width: 192, height: 192 },
        'google-128': { width: 128, height: 128 }
    }))
    .pipe(gulp.dest(config.distIconsPath));
});

gulp.task('icon:generate:apple', function () {

    return gulp.src([
      config.srcIconsPath + '/icon-bg.svg'
    ])
      .pipe(mobileIcons({

          /** iOS **/
          // References:
          // - https://makeappicon.com/ios10icon (good listing)
          // - https://developer.apple.com/ios/human-interface-guidelines/graphics/app-icon/ (canonical source, but usually only for the most recent iOS version)
          /* App icon */

          // iPhone 6s, iPhone 6, iPhone SE
          'apple-touch-icon'  : { width: 120, height: 120 },
          // iPhone 6s Plus, iPhone 6 Plus
          'apple-touch-icon-180'  : { width: 180, height: 180 },
          // iPad, iPad mini
          'apple-touch-icon-152'  : { width: 152, height: 152 },
          // iPad Pro
          'apple-touch-icon-167': { width: 167, height: 167 }
      }))
      .pipe(gulp.dest(config.distIconsPath));
});

gulp.task('icon:generate:pwa', function () {

  return gulp.src([
    config.srcIconsPath + '/icon-bg.svg'
  ])
    .pipe(mobileIcons({

        /** PWA icons **/
        'pwa-64': { width: 64, height: 64 },
        'pwa-128': { width: 128, height: 128 },
        'pwa-256': { width: 256, height: 256 },
        'pwa-512': { width: 512, height: 512 },
    }))
    .pipe(gulp.dest(config.distIconsPath));
});

/**
 * Taks provided for gather all build tasks
 */
gulp.task('icon:build', gulp.series([
  'icon:generate:favicon',
  'icon:generate:google',
  'icon:generate:apple',
  'icon:generate:pwa'
]));
