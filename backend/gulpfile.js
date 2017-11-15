const gulp = require('gulp');
const clean = require('gulp-clean');
const del = require('del');
const ts = require('gulp-typescript');
const JSON_FILES = ['src/*.json', 'src/**/*.json'];
const JS_FILES = ['src/*.js', 'src/**/*.js'];

gulp.task('scripts', () => {
  const tsProject = ts.createProject('tsconfig.json');
  const tsResult = tsProject.src()
    .pipe(tsProject());
  return tsResult.js.pipe(gulp.dest('dist'));
});

gulp.task('scripts-test', () => {
  const tsProject = ts.createProject('tsconfig.test.json');
  const tsResult = tsProject.src()
    .pipe(tsProject());
  return tsResult.js.pipe(gulp.dest('dist'));
});

gulp.task('js-scripts', function() {
  return gulp.src(JS_FILES)
    .pipe(gulp.dest('dist'));
});

gulp.task('assets', function() {
  return gulp.src(JSON_FILES)
    .pipe(gulp.dest('dist'));
});

gulp.task('clean', function clean() {
  // You can use multiple globbing patterns as you would with `gulp.src`,
  // for example if you are using del 2.0 or above, return its promise
  return del([ 'clean-test-generated' ]);
});

gulp.task('clean-test-generated', function () {
  return gulp.src('test-generated', {read: true})
    .pipe(clean());
});

gulp.task('default', gulp.series(gulp.parallel('scripts', 'js-scripts', 'assets', 'clean')));

gulp.task('test', gulp.series(gulp.parallel('scripts-test', 'js-scripts', 'assets', 'clean')));
