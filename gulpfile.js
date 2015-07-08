var gulp = require('gulp');
var mainBowerFiles = require('main-bower-files');
var bowerNormalizer = require('gulp-bower-normalize');

gulp.task('default', function () {
  return gulp.src(mainBowerFiles(), { base: './bower_components/' })
    .pipe(bowerNormalizer())
    .pipe(gulp.dest('./lib'));
});
