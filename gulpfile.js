var gulp = require('gulp');
var mainBowerFiles = require('main-bower-files');
var bowerNormalizer = require('gulp-bower-normalize');
var server = require('gulp-server-livereload');

gulp.task('default', ['watch', 'serve']);

gulp.task('html', function () {
  return gulp.src('src/*.html')
    .pipe(gulp.dest('./dist/'));
});

gulp.task('styles', function () {
  return gulp.src('src/styles/**/*.css')
    .pipe(gulp.dest('./dist/styles/'));
});

gulp.task('javascripts', function () {
  return gulp.src('src/javascripts/**/*.js')
    .pipe(gulp.dest('./dist/javascripts/'));
});

gulp.task('images', function () {
  return gulp.src('src/images/**/*')
    .pipe(gulp.dest('./dist/images/'));
});

gulp.task('bower', function () {
  return gulp.src(mainBowerFiles(), { base: './bower_components/' })
    .pipe(bowerNormalizer())
    .pipe(gulp.dest('./dist/lib'));
});

gulp.task('serve', function () {
  gulp.src('./dist')
    .pipe(server({
      livereload: true
    }));
});

gulp.task('watch', ['html', 'styles', 'javascripts', 'images', 'bower'], function () {
  gulp.watch('./src/*.html', ['html']);
  gulp.watch('./src/styles/**/*.css', ['styles']);
  gulp.watch('./src/javascripts/**/*.js', ['javascripts']);
  gulp.watch('./src/images/**/*', ['images']);
});
