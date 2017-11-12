const gulp = require('gulp');
const clean = require('gulp-clean');
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

gulp.task('watch', ['scripts', 'js-scripts'], () => {
   gulp.watch('src/**/*.(t|j)s', ['scripts', 'js-scripts']);
});

gulp.task('js-scripts', function() {
  return gulp.src(JS_FILES)
    .pipe(gulp.dest('dist'));
});

gulp.task('assets', function() {
  return gulp.src(JSON_FILES)
    .pipe(gulp.dest('dist'));
});

gulp.task('clean', function () {
  return gulp.src('dist', {read: false})
    .pipe(clean());
});

gulp.task('clean-test-generated', function () {
  return gulp.src('test-generated', {read: false})
    .pipe(clean());
});

gulp.task('default', ['scripts', 'js-scripts', 'assets', 'clean-test-generated']);

gulp.task('test', ['scripts-test', 'js-scripts', 'assets', 'clean-test-generated']);
