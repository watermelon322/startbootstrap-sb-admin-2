"use strict";

// Load plugins
const autoprefixer = require("gulp-autoprefixer");
const cleanCSS = require("gulp-clean-css");
const del = require("del");
const gulp = require("gulp");
const header = require("gulp-header");
const merge = require("merge-stream");
const plumber = require("gulp-plumber");
const rename = require("gulp-rename");
const sass = require("gulp-sass");
const uglify = require("gulp-uglify");

// Load package.json for banner
const pkg = require('./package.json');

// Set the banner content
const banner = ['/*!\n',
  ' * Start Bootstrap - <%= pkg.title %> v<%= pkg.version %> (<%= pkg.homepage %>)\n',
  ' * Copyright 2013-' + (new Date()).getFullYear(), ' <%= pkg.author %>\n',
  ' * Licensed under <%= pkg.license %> (https://github.com/BlackrockDigital/<%= pkg.name %>/blob/master/LICENSE)\n',
  ' */\n',
  '\n'
].join('');

// Clean vendor
function clean() {
  return del(["./vendor/"]);
}

// Bring third party dependencies from node_modules into vendor directory
function modules() {
  // Bootstrap JS
  var bootstrapJS = gulp.src('./node_modules/bootstrap/dist/js/*')
    .pipe(gulp.dest('./vendor/bootstrap/js'));
  // Bootstrap SCSS
  var bootstrapSCSS = gulp.src('./node_modules/bootstrap/scss/**/*')
    .pipe(gulp.dest('./vendor/bootstrap/scss'));
  // Bootstrap Table
  var bootstrapTable = gulp.src('./node_modules/bootstrap-table/dist/**/*')
    .pipe(gulp.dest('./vendor/bootstrap-table'));
  // ChartJS
  var chartJS = gulp.src('./node_modules/chart.js/dist/*.js')
    .pipe(gulp.dest('./vendor/chart.js'));
  // dataTables
  var dataTables = gulp.src([
      './node_modules/datatables.net/js/*.js',
      './node_modules/datatables.net-bs4/js/*.js',
      './node_modules/datatables.net-bs4/css/*.css'
    ])
    .pipe(gulp.dest('./vendor/datatables'));
  // lodash
  var lodash = gulp.src(['./node_modules/lodash/lodash.js', './node_modules/lodash/lodash.min.js'])
    .pipe(gulp.dest('./vendor/lodash'));
  // moment
  var moment = gulp
    .src([
      './node_modules/moment/moment.js',
      './node_modules/moment/min/moment.min.js',
      './node_modules/moment/min/moment-with-locales.js',
      './node_modules/moment/min/moment-with-locales.min.js',
      './node_modules/moment/min/locales.js',
      './node_modules/moment/min/locales.min.js'
    ])
    .pipe(gulp.dest('./vendor/moment'));
  var moment_locale = gulp
    .src([
      './node_modules/moment/locale/**/*.js'
    ])
    .pipe(gulp.dest('./vendor/moment/locale'));
  // Font Awesome
  var fontAwesome = gulp.src('./node_modules/@fortawesome/**/*')
    .pipe(gulp.dest('./vendor'));
  // jQuery Easing
  var jqueryEasing = gulp.src('./node_modules/jquery.easing/*.js')
    .pipe(gulp.dest('./vendor/jquery-easing'));
  // jQuery Treegrid
  var jqueryTreegrid = gulp.src([
      './node_modules/jquery-treegrid/js/jquery.treegrid.js',
      './node_modules/jquery-treegrid/js/jquery.treegrid.min.js',
      './node_modules/jquery-treegrid/css/jquery.treegrid.css'
    ])
    .pipe(gulp.dest('./vendor/jquery-treegrid'));
  // jQuery Slimscroll
  var jquerySlimscroll = gulp.src('./node_modules/jquery-slimscroll/*.js')
    .pipe(gulp.dest('./vendor/jquery-slimscroll'));
  // jQuery zTree
  var jqueryZtree = gulp.src([
      './node_modules/ztree/js/jquery.ztree.*.js',
      './node_modules/ztree/css/**/*',
      '!./node_modules/ztree/css/demo.css',
      '!./node_modules/ztree/css/**/*.less'
    ])
    .pipe(gulp.dest('./vendor/jquery-ztree'));
  // jQuery
  var jquery = gulp.src([
      './node_modules/jquery/dist/*',
      '!./node_modules/jquery/dist/core.js'
    ])
    .pipe(gulp.dest('./vendor/jquery'));
  return merge(bootstrapJS, bootstrapSCSS, bootstrapTable, chartJS, dataTables, moment, moment_locale, lodash, fontAwesome, jquery, jqueryEasing, jquerySlimscroll, jqueryZtree, jqueryTreegrid);
}

// CSS task
function css() {
  return gulp
    .src("./scss/**/*.scss")
    .pipe(plumber())
    .pipe(sass({
      outputStyle: "expanded",
      includePaths: "./node_modules",
    }))
    .on("error", sass.logError)
    .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    .pipe(header(banner, {
      pkg: pkg
    }))
    .pipe(gulp.dest("./css"))
    .pipe(rename({
      suffix: ".min"
    }))
    .pipe(cleanCSS())
    .pipe(gulp.dest("./css"));
}

// JS task
function js() {
  return gulp
    .src([
      './js/*.js',
      '!./js/*.min.js',
    ])
    .pipe(uglify())
    .pipe(header(banner, {
      pkg: pkg
    }))
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest('./js'));
}

// Watch files
function watchFiles() {
  gulp.watch("./scss/**/*", css);
  gulp.watch("./js/**/*", js);
  gulp.watch("./**/*.html", browserSyncReload);
}

// Define complex tasks
const vendor = gulp.series(clean, modules);
const build = gulp.series(vendor, gulp.parallel(css, js));
const watch = gulp.series(build, gulp.parallel(watchFiles));

// Export tasks
exports.css = css;
exports.js = js;
exports.clean = clean;
exports.vendor = vendor;
exports.build = build;
exports.watch = watch;
exports.default = build;