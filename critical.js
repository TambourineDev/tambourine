/*
 * Critical for both. No shortcodes
*/

const 
gulp = require('gulp'),
livereload = require('gulp-livereload'),
browserSync = require('browser-sync'),
sass = require('gulp-ruby-sass'),
autoprefixer = require('gulp-autoprefixer'),
concat = require('gulp-concat'),
uglify = require('gulp-uglify'),
maps = require('gulp-sourcemaps'),
notify = require('gulp-notify'),
plumber = require('gulp-plumber'),
babel = require('gulp-babel'),
del = require('del'),
sassFolder = './assets/sass/',
jsFolder = './assets/js/',
shortcodePath = './shortcode/',
dataFile = './symphony.json',
requireDir = require('require-dir'),
{ getData, readDir } = require('../lib/gulp/data');

gulp.task('watch', () => reload('liveReload') );
gulp.task( 'watch-bs', () => reload() );


// Function running when gulp watch-bs / gulp watch is used
function reload(reload = 'browserSync'){
    
    // Require Centralized tasks
    const tasks = requireDir(`../lib/gulp/${reload}/`);
    
    // Specify all files browser testing would be watching
    const watchForReload = ['**/*.{php,tpl,html}', `./assets/critical.css`, `./m/assets/critical.css`, `${shortcodePath}**/**.{css,js}`];
    
    // Options depending on browser testing option
    if(reload === 'browserSync'){
        browserSync.init({
            open: 'external',
            proxy: 'www.symphony.local',
            port: 8080
        });
        gulp.watch(watchForReload, browserSync.reload);    
    } else if(reload === 'liveReload') {
        livereload.listen();
        gulp.watch(watchForReload, livereload.reload);  
    }

    // Watch Styles
    gulp.watch(`${sassFolder}**/**.scss`, ['styles', 'critical']);
    gulp.watch(`m/${sassFolder}**/**.scss`, ['mobile-styles','mobile-critical']);

    // Watch scripts
    gulp.watch(`${jsFolder}*.js`, ['scripts', 'mobile-scripts']);
    gulp.watch(`m/${jsFolder}*.js`, ['mobile-scripts']);

    // For Shortcodes
    const folders = readDir(shortcodePath);
    if(folders.length > 0) gulp.watch('shortcode/**/*.scss', ['shortcode-styles']);

    // Read and generate symphony.json file
    getData(dataFile);
}