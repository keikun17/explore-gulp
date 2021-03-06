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
var gulpBowerFiles = require('gulp-bower-files');
var browserify = require('gulp-browserify');


// Build bower files
gulp.task("bower-files", function(){
  gulpBowerFiles().pipe(gulp.dest("build/vendor"));
})

// Lint Task
gulp.task('lint', function() {
    gulp.src('./source/js/*.js')
        .pipe(plumber())
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

// Compile Our Sass
gulp.task('sass', function() {
  watch({glob: 'source/scss/**/*.scss'})
    .pipe(plumber())
    .pipe( sass( { errLogToConsole: true, sourceComments: 'map', sourceMap: 'sass'} ) )
    .pipe(gulp.dest('./build/css'));
});

// Browserify & Minify JS
gulp.task('scripts', function() {
    return gulp.src('./source/js/*.js')
        .pipe(plumber())
        .pipe(browserify())
        // .pipe(concat('all.js'))
        .pipe(gulp.dest('./build/js'))
        // .pipe(rename('all.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('./build/js'));
});

gulp.task('haml', function(){
  return gulp.src('./source/**/*.haml')
        .pipe(plumber())
        .pipe(haml())
        .pipe(gulp.dest('./build'))
})

// Watch Files For Changes
gulp.task('watch', function() {
    gulp.watch('source/js/*.js', ['lint', 'scripts']);
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
  gulp.src('./source/**/*.html')
    .pipe(plumber())
    .pipe(gulp.dest('./build'))
})

// Default Task
gulp.task('default', ['bower-files', 'connect', 'haml', 'move_html', 'lint', 'sass', 'scripts', 'watch']);
