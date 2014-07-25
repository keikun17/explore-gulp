// Include gulp
var gulp    = require('gulp');

// Include Our Plugins
var jshint  = require('gulp-jshint');
var sass    = require('gulp-sass');
var concat  = require('gulp-concat');
var uglify  = require('gulp-uglify');
var rename  = require('gulp-rename');
var haml    = require('gulp-ruby-haml');
var connect = require('gulp-connect');
var watch  = require('gulp-watch');
var plumber = require('gulp-plumber');

// Lint Task
gulp.task('lint', function() {
    return gulp.src('./source/js/*.js')
        .pipe(jshint())
        .pipe(plumber())
        .pipe(jshint.reporter('default'));
});

// Compile Our Sass
gulp.task('sass', function() {
    return gulp.src('./source/scss/*.scss')
        .pipe(sass())
        .pipe(gulp.dest('./build/css'));
});

// Concatenate & Minify JS
gulp.task('scripts', function() {
    return gulp.src('./source/js/*.js')
        .pipe(concat('all.js'))
        .pipe(gulp.dest('./build/js'))
        .pipe(rename('all.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('./build/js'));
});

gulp.task('haml', function(){
  return gulp.src('./source/**/*.haml')
        .pipe(haml())
        .pipe(gulp.dest('./build'))
})

// Watch Files For Changes
gulp.task('watch', function() {
    gulp.watch('source/js/*.js', ['lint', 'scripts']);
    gulp.watch('source/scss/*.scss', ['sass']);
    gulp.watch('source/**/*.haml', ['haml']);
    gulp.watch('source/**/*.html', ['move_html']);

    gulp.watch('build/**/*.html', ['reload']);
});

// Server with Livereload
gulp.task('connect', function(){
  connect.server({
    root: 'build',
    livereload: true
  })
});

gulp.task('reload', function(){
  return gulp.src('./build/**/*.html')
        .pipe(connect.reload());
})

gulp.task('move_html', function(){
  return gulp.src('./source/**/*.html')
        .pipe(gulp.dest('./build'))
})

// Default Task
gulp.task('default', ['connect', 'haml', 'move_html', 'lint', 'sass', 'scripts', 'watch']);
