const PATH_BUILD = 'assets';
const PATH_BUILD_HTML = 'assets/';
const PATH_BUILD_JS = 'assets/js/';
const PATH_BUILD_CSS = 'assets/css/';
const PATH_BUILD_IMG = 'assets/img/';

const PATH_SRC_HTML = 'src/*.html';
const PATH_SRC_CSS = 'src/scss/main.scss';
const PATH_SRC_IMG = 'src/img/**/*.*';

const PATH_WATCH_HTML = 'src/**/*.html';
const PATH_WATCH_JS = 'src/js/**/*.js';
const PATH_WATCH_CSS = 'src/scss/*.scss';
const PATH_WATCH_IMG = 'src/img/**/*.*';
const PATH_CLEAN = 'assets/';

const {
    src,
    dest,
    parallel,
    series,
    watch
} = require('gulp');

// Load plugins

const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
const sass = require('gulp-sass')(require('sass'));
const autoprefixer = require('gulp-autoprefixer');
const cssnano = require('gulp-cssnano');
const concat = require('gulp-concat');
const clean = require('gulp-clean');
const changed = require('gulp-changed');
const browsersync = require('browser-sync').create();
const cleancss = require('gulp-clean-css');

// Clean assets

function clear() {
    return src(PATH_CLEAN, {
        read: false
    })
        .pipe(clean());
}

// JS function 

function js() {
    return src(PATH_WATCH_JS)
        .pipe(changed(PATH_WATCH_JS))
        .pipe(concat('bundle.js'))
        .pipe(uglify())
        .pipe(rename({
            extname: '.min.js'
        }))
        .pipe(dest(PATH_BUILD_JS))
        .pipe(browsersync.stream());
}

// CSS function 

function css() {
    return src(PATH_SRC_CSS)
        .pipe(changed(PATH_WATCH_CSS))
        .pipe(sass())
        .pipe(autoprefixer({
            overrideBrowserslist: ['last 2 versions'],
            cascade: false
        }))
        .pipe(rename({
            extname: '.min.css'
        }))
        .pipe(cssnano())
        .pipe(concat('main.min.css'))
        .pipe(cleancss())
        .pipe(dest(PATH_BUILD_CSS))
        .pipe(browsersync.stream());
}

// Optimize images

function img() {
    return src(PATH_SRC_IMG)
        .pipe(dest(PATH_BUILD_IMG));
}

function html() {
    return src(PATH_SRC_HTML)
        .pipe(dest(PATH_BUILD_HTML))
        .pipe(browsersync.reload({ stream: true }))
};

// Watch files

function watchFiles() {
    watch(PATH_WATCH_HTML, html);
    watch(PATH_WATCH_CSS, css);
    watch(PATH_WATCH_JS, js);
    watch(PATH_WATCH_IMG, img);
}

// BrowserSync

function browserSync() {
    browsersync.init({
        server: {
            baseDir: PATH_BUILD
        },
        notify: false
    })
}

exports.watch = parallel(watchFiles, browserSync);
exports.default = series(clear, parallel(js, css, img, html));