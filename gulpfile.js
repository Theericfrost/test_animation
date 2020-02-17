let gulp = require('gulp'),
		watch = require('gulp-watch'),
		preFixer = require('gulp-autoprefixer'),
		uglify = require('gulp-uglify'),
		sourseMaps = require('gulp-sourcemaps'),
		webserver = require('gulp-webserver'),
		cssMin = require('gulp-minify-css'),
		rimRaf = require('rimraf'),
		browserSync = require('browser-sync'),
		sass = require("gulp-sass");
		del = require('del');

let path = {
		build: {
			html: 'build/',
			js: "build/js/",
			css: "build/style/",
      img: "build/img/"
		},
		src: {
			html: 'src/index.html',
			js: 'src/js/main.js',
			css: 'src/style/main.scss',
      img: 'src/img/**/*.*',
		},
		watch: {

			html: 'src/**/*.html',
			js: 'src/js/**/*.js',
			css: 'src/style/**/*.scss',
      img: 'src/img/**/*.*',
		},
		clean : './build'
}

gulp.task('clean', function (cb) {
    rimRaf(path.clean, cb);
});

gulp.task('html:build' , function() {
		return gulp.src(path.src.html)
				.pipe(gulp.dest(path.build.html))
				.pipe(browserSync.reload({stream: true}))
});

gulp.task('img:build' , function() {
		return gulp.src(path.src.img)
				.pipe(gulp.dest(path.build.img))
				.pipe(browserSync.reload({stream: true}))
});

gulp.task('js:build', function() {
	return gulp.src(path.src.js)
		.pipe(sourseMaps.init())
		.pipe(uglify())
		.pipe(sourseMaps.write())
		.pipe(gulp.dest(path.build.js))
		.pipe(browserSync.reload({stream: true}))
});

gulp.task('css:build', function (){
	return gulp.src(path.src.css)
		.pipe(sourseMaps.init())
		.pipe(sass({
      outputStyle: 'compact'
     }).on('error', sass.logError))
		.pipe(preFixer())
		.pipe(cssMin())
		.pipe(sourseMaps.write())
		.pipe(gulp.dest(path.build.css))
		.pipe(browserSync.reload({stream: true}))
});

gulp.task('watch', function(){
		gulp.watch(path.watch.html, gulp.series('html:build')).on("change", browserSync.reload );
		gulp.watch(path.watch.js, gulp.series('js:build')).on("change", browserSync.reload);
		gulp.watch(path.watch.css, gulp.series('css:build')).on("change", browserSync.reload);
		gulp.watch(path.watch.img, gulp.series('img:build')).on("change", browserSync.reload);
});


gulp.task('webserver', function() {

	browserSync({
		server: {
			baseDir: "./build"
		},
		host: 'localhost',
		port: 8080,
		tunnel: false,
		open: 'external'
	});

});
gulp.task('build', gulp.parallel('html:build','js:build','css:build','img:build'));
gulp.task('default',gulp.series('clean','build',gulp.parallel('webserver', 'watch')));
