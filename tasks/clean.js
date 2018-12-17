/**
* Gulp task provider for cleaning dist directory
*/
import gulp from 'gulp';
import clean from 'gulp-clean';

import config from './config';

gulp.task('clean', function(){
    return gulp.src(config.dist, {
        allowEmpty: true
    }).pipe(clean());
});
