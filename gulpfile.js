// Dependencies
// -------------------------
var gulp = require('gulp');
var rename = require('gulp-rename');
var less = require('gulp-less')
var minifyCSS = require('gulp-minify-css');
var nodemon = require('gulp-nodemon');
var browserify = require('browserify');
var rename = require('gulp-rename');
var del = require('del');
var gulpuglify = require('gulp-uglify');
var hbsfy = require('hbsfy');
var source = require('vinyl-source-stream');
var runSequence = require('run-sequence');
var sourcemaps  = require('gulp-sourcemaps');
var gulpif = require('gulp-if');
var prefix = require('gulp-autoprefixer');
var concat = require('gulp-concat');

// Tasks
// -------------------------

// Only uglify if not in development
var uglify = function() {
  return gulpif(true, gulpuglify());
}

// Build tasks
gulp.task('browserify', function() {
  var b = browserify('./js/main.js', {debug: true})
  return b.transform(hbsfy)
	.bundle()
	.pipe(source('app.browserified.js'))
	.pipe(gulp.dest('./build'))
});

gulp.task('minify', ['styles'], function() {
  return gulp.src('./build/bundle.css')
	.pipe(minifyCSS())
	.pipe(rename('app.min.css'))
	.pipe(gulp.dest('./public/css'))
});

gulp.task('uglify', function() {
  return gulp.src('./build/app.browserified.js')
	.pipe(uglify())
	.pipe(rename('app.min.js'))
	.pipe(gulp.dest('./wp-content/themes/llportal/js'));
});

// Style tasks
gulp.task('styles', function() {
  return gulp.src('./scr/less/style.less')
	.pipe(less())
	.pipe(prefix({ cascade: true }))
	.pipe(rename('style.css'))
	.pipe(gulp.dest('./scr/css'))
});

// Clean tasks
gulp.task('clean', ['cleanbuild'], function(done) {
  del(['./scr/js', './scr/css'], done)
});

gulp.task('cleanbuild', function(done) {
  del(['./build'], done)
});

// commands
gulp.task('build', ['clean'], function(done) {
  return runSequence('browserify', 'uglify', 'minify', 'cleanbuild', done);
});

gulp.task('watch', function() {
	gulp.watch('./js/**/*.js', ['browserify', 'uglify']);
});

gulp.task('default', ['watch', 'browserify', 'uglify', 'styles']);