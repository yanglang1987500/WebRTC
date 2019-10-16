var gulp = require("gulp");
var concat = require('gulp-concat');
var del = require("del");
var filesExist = require('files-exist');

const libList = [
  'jquery-3.3.1.min.js',
  'moment.js',
  'inobounce.min.js'
]

function buildLib() {
  return gulp.src(filesExist(libList.map(lib => `../src/ui/script/${lib}`), { onMissing: function(file) {
      console.log('File not found: ' + file)
      return false
    }}))
    .pipe(concat("common-plugins.js"))
    .pipe(gulp.dest("../dist/lib/"));
}

function cleanLib() {
  return del([
    "../dist/lib/**/*"
  ], { force: true });
}

function cleanChunks() {
  return del([
    "../dist/chunks/**/*"
  ], { force: true });
}

const styleList = [
  'style.css',
  'weather-icons.css',
  'bootstrap-datepicker3.css'
]

function buildCss() {
  return gulp.src(filesExist(styleList.map(style => `../src/ui/css/${style}`)), { onMissing: function(file) {
      console.log('File not found: ' + file)
      return false
    }})
    .pipe(concat("common.css"))
    .pipe(gulp.dest("../dist/css/"));
}

function cleanCss() {
  return del([
    "../dist/css/**/*"
  ], { force: true });
}


function copySource() {
  return gulp.src(["../src/ui/sources/**/*"])
    .pipe(gulp.dest("../dist/sources"));
}

function cleanSource() {
  return del([
    "../dist/sources/**/*"
  ], { force: true });
}

gulp.task('resource', gulp.series(
  cleanLib,
  cleanCss,
  cleanSource,
  buildLib,
  buildCss,
  copySource
))

gulp.task('cleanChunks', gulp.series(
  cleanChunks
))