import browserSync from 'browser-sync';
import gulp from 'gulp';
import autoPrefix from 'gulp-autoprefixer';
import clean from 'gulp-clean';
import dartSass from 'sass';
import gulpSass from 'gulp-sass';
import cleanCss from 'gulp-clean-css';
import concat from 'gulp-concat';
import imageMin from 'gulp-imagemin';
import minifyjs from 'gulp-js-minify';
import rename from 'gulp-rename';
import uglify from 'gulp-uglify';
import gulpIf from 'gulp-if';

const sass = gulpSass(dartSass);
browserSync.create()

//Creat paths

const path = {
	src: {
		scss: './src/scss/**/*.scss',
		js: './src/js/**/*.js',
		img: './src/img/*',
	},
	dist: {
		self: './dist/',
		css: './dist/css/',
		js: './dist/js/',
		img: "./dist/images/",
	},

	setEnv() {
		this.isProd = process.argv.includes("--prod")
		this.isDev = !this.isProd
	},

}

path.setEnv()

//Create functions-tasks

const createScss = () => {
	gulp
		.src(path.src.scss)
		.pipe(sass().on('error', sass.logError))
		.pipe(gulpIf(path.isProd, autoPrefix({
			cascade: false
		})))
		.pipe(rename("style.min.css"))
		.pipe(gulp.dest(path.dist.css))
		.pipe(browserSync.stream())
}

const createJS = () => {
	gulp
		.src(path.src.js)
		.pipe(minifyjs())
		.pipe(rename('script.min.js'))
		.pipe(gulp.dest(path.dist.js))
		.pipe(browserSync.stream())
}
const createImg = () => {
	gulp
		.src(path.src.img)
		.pipe(imageMin())
    	.pipe(gulp.dest(path.dist.img))
		.pipe(browserSync.stream())
}


const createClean = () => {
	gulp
		.src(path.dist.self, {
			allowEmpty: true
		}).pipe(clean());
}


const watcher = () => {
	browserSync.init({
		server: {
			baseDir: "./"
		}
	})

	gulp.watch(path.src.scss, createScss).on('change', browserSync.reload)
}