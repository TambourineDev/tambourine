const
gulp = require('gulp'),
sass = require('gulp-ruby-sass'),
autoprefixer = require('gulp-autoprefixer'),
concat = require('gulp-concat'),
uglify = require('gulp-uglify'),
notify = require('gulp-notify'),
replace = require('gulp-replace'),
plumber = require('gulp-plumber'),
livereload = require('gulp-livereload'),
maps = require('gulp-sourcemaps'),
browserSync = require('browser-sync'),
del = require('del'),
babel = require('gulp-babel');


//Process all SASS files and output compressed style.css
gulp.task('styles', function() {
    return sass('assets/sass/style.scss', {sourcemap: true, style: 'compressed', noCache:true})
        .pipe(maps.init())
        .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1'))
        .pipe(maps.write('.'))
        .pipe(gulp.dest('assets/'))
        // .pipe(livereload())
        .pipe(browserSync.stream())
        .pipe(notify({ message: 'Styles task complete' }));
});

//Process MOBILE SASS files and output compressed mobile style.css
gulp.task('mobile-styles', function() {
    return sass('m/includes/css/style.scss', {sourcemap: true, style: 'compressed', noCache:true})
        .pipe(maps.init())
        .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1'))
        //Rebase desktop urls to be relative to mobile style.css
        .pipe(replace(/(url\(['"]?)[/]?(images)[/]/ig, '$1../$2/' ))
        .pipe(replace(/(url\(['"]?)[/]?(fonts)[/]/ig, '$1../../../assets/$2/' ))
        .pipe(maps.write('.'))
        .pipe(gulp.dest('m/includes/css/'))
        // .pipe(livereload())
        .pipe(browserSync.stream())
        .pipe(notify({ message: 'Mobile styles task complete' }));
});

// Combine all JS files located on assets/js/
gulp.task('scripts', function() {
    return gulp.src(['assets/js/*.js'],{ base: '.'})
        .pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
        .pipe(babel({
            presets: ['env']
        }))
        .pipe(maps.init())
        .pipe(concat('scripts.js'))
        .pipe(uglify())
        .pipe(maps.write('.'))
        .pipe(gulp.dest('assets/'))
        // .pipe(livereload())
        .pipe(browserSync.stream())
        .pipe(notify({ message: 'Scripts task complete' }));
});

// Clean
gulp.task('clean', function() {
    return del(['assets/global.css', 'assets/global.js']);
});

// Default task
gulp.task('default', ['clean'], function() {
    gulp.start('styles', 'mobile-styles', 'scripts');
});

//Watch for changes with Livereload
gulp.task('watch', ['clean'], function() {

    livereload.listen();

    // Watch .scss files
    gulp.watch('assets/sass/**/**.scss', ['styles']);
    gulp.watch('m/includes/css/**/**.scss', ['mobile-styles']);

    // Watch .php, .tpl and .html files
    gulp.watch('**/*.{php,tpl,html}', livereload.reload);


    // Watch .js files
    gulp.watch('assets/js/*.js', ['scripts']);

});

//Watch for changes with Browsersync
gulp.task('watch-bs', ['clean'], function() {

    browserSync.init({
        open: 'external',
        proxy: 'www.symphony.local',
        port: 8080
    });
    // Watch .scss files
    gulp.watch('assets/sass/**/**.scss', ['styles']);
    gulp.watch('m/includes/css/**/**.scss', ['mobile-styles']);
    // Watch .php, .tpl and .html files
    gulp.watch('**/*.{php,tpl,html}', livereload.reload);
    gulp.watch('**/*.{php,tpl,html}', browserSync.reload);

    // Watch .js files
    gulp.watch('assets/js/*.js', ['scripts']);

});