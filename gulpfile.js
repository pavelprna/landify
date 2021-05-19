const {src, dest, watch, series, parallel} = require('gulp');

const uglify = require('gulp-uglify-es').default;
const sass = require('gulp-sass');
const concat = require('gulp-concat');
const autoprefixer = require('gulp-autoprefixer');
const del = require('del');
const browserSync = require('browser-sync').create();

function scripts() {
    return src('./app/js/main.js')
        .pipe(concat('main.min.js'))
        .pipe(uglify())
        .pipe(dest('app/js'))
        .pipe(browserSync.stream())
}

function styles() {
    return src('./app/scss/style.scss')
        .pipe(sass({
            outputStyle: 'nested'
        }).on('error', sass.logError))
        .pipe(concat('style.css'))
        .pipe(autoprefixer({
            overrideBrowserslist: ['last 4 version'],
            grid: true
        }))
        .pipe(dest('./app/css/'))
        .pipe(sass({
            outputStyle: 'compressed'
        }).on('error', sass.logError))
        .pipe(concat('style.min.css'))
        .pipe(dest('./app/css/'))
        .pipe(browserSync.stream());
}

function build() {
    return src([
        './app/css/**/*.css',
        './app/js/main.min.js',
        './app/*.html',
    ], {base: './app'})
        .pipe(dest('./dist'));
}

function watcher() {
    watch(['./app/scss/**/*.scss'], styles);
    watch(['./app/js/*.js', '!./app/js/main.min.js'], scripts);
    watch(['./app/*.html']).on('change', browserSync.reload);
}

function clear() {
    return del(['./dist', './app/css']);
}

function serve() {
    browserSync.init({
        server: {baseDir: './app'}
    });
}

exports.scripts = scripts;
exports.styles = styles;
exports.clear = clear;

exports.build = series(clear, styles, scripts, build);
exports.default = series(styles, scripts, parallel(watcher, serve));
