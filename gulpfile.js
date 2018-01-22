var gulp        = require('gulp'),
    browserSync = require('browser-sync').create(),
    sass        = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    sourcemaps = require('gulp-sourcemaps'),
    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant'),
    babel = require("gulp-babel"),
    minify = require("gulp-babel-minify"),
    concat = require('gulp-concat');


// task Imagemin, Compile images

gulp.task('imagemin', function () {
    return gulp.src('./src/images/*')
        .pipe(imagemin({
            progressive: true,
            svgPlugins: [{removeViewBox: false}],
            use: [pngquant()]
        }))
        .pipe(gulp.dest('./assets/images'));
});

// Compile sass into CSS & auto-inject into browsers

gulp.task('sass', function() {
    return gulp.src(['./src/scss/**/*.scss'])
        .pipe(sourcemaps.init())
        .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
        .pipe(autoprefixer('last 2 version'))
        .pipe(concat('styles.css'))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest("./assets/css"))
        .pipe(browserSync.stream());
});


// Compile JS files

gulp.task('script', function () {
    return gulp.src([
        './node_modules/bootstrap/dist/js/bootstrap.bundle.js',
        './src/js/**/*.js'
    ])
        .pipe(sourcemaps.init())
        .pipe(babel({
            presets: ['@babel/env']
        }))
        .pipe(concat('all.js'))
        .pipe(minify({
            mangle: {
                keepClassName: true
            }
        }))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('./assets/js'))
        .pipe(browserSync.stream());
});


// Static Server + watching scss/html files

gulp.task('watch', ['sass', 'script'], function() {

    browserSync.init({
        proxy: 'http://dev.drupalpractice'
    });

    gulp.watch('./src/scss/**/*.scss', ['sass']);
    gulp.watch('./src/js/*.js', ['script']);
    gulp.watch('./src/images/*', ['imagemin']);
    gulp.watch('./**/**/*.html.twig').on('change', browserSync.reload);
});