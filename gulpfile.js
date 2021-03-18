'use strict';

const { src, dest } = require('gulp');
const gulp = require('gulp');
const autoprefixer = require('gulp-autoprefixer');
const cssbeautify = require('gulp-cssbeautify');
const removeComments = require('gulp-strip-css-comments');
const sass = require('gulp-sass');
const cssnano = require('gulp-cssnano');
const uglify = require('gulp-uglify');
const htmlmin = require('gulp-htmlmin');
const plumber = require('gulp-plumber');
const imagemin = require('gulp-imagemin');
const del = require('del');
const browsersync = require('browser-sync').create();

/* ############# Paths ############# */
var path = {
	build: {
		html: 'dist/',
		js: 'dist/assets/js/',
		css: 'dist/assets/css/',
		images: 'dist/assets/img/',
	},
	src: {
		html: 'src/*.html',
		js: 'src/assets/js/*.js',
		css: 'src/assets/sass/style.scss',
		images: 'src/assets/img/**/*.{jpg,png,svg,ico}',
	},
	watch: {
		html: 'src/**/*.html',
		js: 'src/assets/js/**/*.js',
		css: 'src/assets/sass/**/*.scss',
		images: 'src/assets/img/**/*.{jpg,png,svg,ico}',
	},
	clean: './dist',
};

/* ############# Tasks ############# */
function browserSync(done) {
	browsersync.init({
		server: {
			baseDir: './dist/',
		},
		port: 3000,
	});
}

function browserSyncReload(done) {
	browsersync.reload();
}

function html() {
	return src(path.src.html, { base: 'src/' })
		.pipe(plumber())
		.pipe(htmlmin({ collapseWhitespace: true }))
		.pipe(dest(path.build.html))
		.pipe(browsersync.stream());
}

function css() {
	return src(path.src.css, { base: 'src/assets/sass/' })
		.pipe(plumber())
		.pipe(sass())
		.pipe(
			autoprefixer({
				cascade: true,
			})
		)
		.pipe(cssbeautify())
		.pipe(
			cssnano({
				zindex: false,
				discardComments: {
					removeAll: true,
				},
			})
		)
		.pipe(removeComments())
		.pipe(dest(path.build.css))
		.pipe(browsersync.stream());
}

function js() {
	return src(path.src.js, { base: './src/assets/js/' })
		.pipe(plumber())
		.pipe(uglify())
		.pipe(dest(path.build.js))
		.pipe(browsersync.stream());
}

function images() {
	return src(path.src.images).pipe(imagemin()).pipe(dest(path.build.images));
}

function fonts() {
	return src('src/assets/fonts/**/*.{eot,otf,svg,ttf,woff,woff2}').pipe(
		dest('dist/assets/fonts/')
	);
}

function clean() {
	return del(path.clean);
}

function watchFiles() {
	gulp.watch([path.watch.html], html);
	gulp.watch([path.watch.css], css);
	gulp.watch([path.watch.js], js);
	gulp.watch([path.watch.images], images);
}

const build = gulp.series(clean, gulp.parallel(html, css, js, images, fonts));
const watch = gulp.parallel(build, watchFiles, browserSync);

/* ############# Exports Tasks ############# */
exports.html = html;
exports.css = css;
exports.js = js;
exports.images = images;
exports.fonts = fonts;
exports.clean = clean;
exports.build = build;
exports.watch = watch;
exports.default = watch;
