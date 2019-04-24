const gulp = require('gulp');

const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const cleanCss = require('gulp-clean-css');
const typescript = require("gulp-typescript");
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
const sourcemaps = require('gulp-sourcemaps');

const del = require('del');

// 输入根目录
const inputSrc = 'build';
// 输出根目录
const outputDest = 'dist'

function clean() {
    return del([outputDest]);
}

function adminCss() {
    return gulp.src(`${inputSrc}/scss/wm.admin.scss`)
        .pipe(sass())
        .pipe(autoprefixer({
            browsers: ['last 2 versions', 'Android >= 4.0']
        }))
        .pipe(gulp.dest(`${outputDest}/css`));
}

function minCss() {
    return gulp.src([`${outputDest}/css/**/*.css`, `!${outputDest}/css/**/*.min.css`])
        .pipe(sourcemaps.init())
        .pipe(cleanCss())
        .pipe(rename(function (path) {
            path.basename += ".min";
        }))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(`${outputDest}/css`))
}

function pagesJs(target) {
    console.info(`开始生成 pages/**/*.js 目标:${target}...`);
    const project = typescript.createProject(`${inputSrc}/ts/admin/pages.json`, { target: target });
    return project.src()
        .pipe(project())
        .pipe(gulp.dest(`${outputDest}/js/wm/admin`));
}

function frameworkJs(target) {
    console.info(`开始生成 framework.js 目标:${target}...`);
    const project = typescript.createProject(`${inputSrc}/ts/admin/framework.json`, { target: target });
    return project.src()
        .pipe(project())
        .pipe(gulp.dest(`${outputDest}/js/wm/admin`));
}

function moduleJs(target) {
    console.info(`开始生成 module.js 目标:${target}...`);
    const project = typescript.createProject(`${inputSrc}/ts/admin/module.json`, { target: target });
    return project.src()
        .pipe(project())
        .pipe(gulp.dest(`${outputDest}/js/wm/admin`));
}

function minJs() {
    console.info('开始生成压缩js文件 ...');
    return gulp.src([`${outputDest}/js/**/*.js`, `!${outputDest}/js/**/*.min.js`])
        .pipe(sourcemaps.init())
        .pipe(uglify())
        .pipe(rename(function (path) {
            path.basename += ".min";
        }))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(`${outputDest}/js`))
}

var cssDev = gulp.series(adminCss);
var cssPro = gulp.series(cssDev, minCss);
var js = target => gulp.series(() => frameworkJs(target), () => moduleJs(target), () => pagesJs(target));
var jsDev = gulp.series(js('ES2015'), minJs);
var jsPro = gulp.series(js('es5'), minJs);

var buildDev = gulp.series(clean, gulp.parallel(jsDev, cssDev));
var buildPro = gulp.series(clean, gulp.parallel(jsPro, cssPro));

gulp.task('clean', clean);
gulp.task('fwjs', () => frameworkJs('ES2015'));
gulp.task('mjs', () => moduleJs('ES2015'));
gulp.task('pjs', () => pagesJs('ES2015'));
// gulp.task('fwjs_es5', () => frameworkJs('es5'));
// gulp.task('mjs_es5', () => moduleJs('es5'));
// gulp.task('pjs_es5', () => pagesJs('es5'));
gulp.task('jsDev', jsDev);
gulp.task('jsPro', jsPro);
gulp.task('cssDev', cssDev);
gulp.task('cssPro', cssPro);
gulp.task('build', buildPro);