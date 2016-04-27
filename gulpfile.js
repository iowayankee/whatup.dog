
var gulp = require('gulp');
var reactify = require('reactify');
var browserify = require('browserify');
var source = require('vinyl-source-stream');

gulp.task('bundle', function () {

  var b = browserify( { entries: './client/jsx/wud.react.jsx' });

  b.transform(reactify);
  b.require('react');

  return b.bundle()
    .pipe(source('wud.bundle.js'))
    .pipe(gulp.dest('./client/js'));

});

gulp.task('default',['bundle'],function(){
   console.log('Gulp completed...');
});
