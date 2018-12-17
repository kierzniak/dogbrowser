import gulp from 'gulp'

import './clean';
import './javascript';
import './stylesheet';
import './icon';
import './sync';
import './server';

gulp.task('watch', gulp.parallel( [
    'javascript:watch',
    'stylesheet:watch'
]));

gulp.task('inspect', gulp.series(
    'javascript:inspect',
    'stylesheet:inspect'
));

gulp.task('build', gulp.series(
    'clean',
    'stylesheet:build',
    'javascript:build',
    'icon:build',
    'sync:build'
));

gulp.task('dev', gulp.series([
    'clean',
    'build',
    'server',
    'watch'
]));

gulp.task('default', gulp.series(['build']));
