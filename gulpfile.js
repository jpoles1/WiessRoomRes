var gulp = require('gulp');
var bower = require('gulp-bower');
var del = require('del');
gulp.task("default", ['clean'], function(){
  gulp.start('bower');
})
gulp.task('bower', function() {
  return bower()
    .pipe(gulp.dest('lib/'))
});
gulp.task('clean', function() {
    return del(['lib/']);
});
