const { src, dest } = require('gulp');
const gulp = require('gulp');
const uglify = require('gulp-uglify');
const clean  = require('gulp-clean');
const useref = require('gulp-useref');
const minifyCss = require('gulp-clean-css');
const gulpif = require('gulp-if');
const browsersync = require("browser-sync");
const jsonminify = require('gulp-jsonminify');
const changed = require('gulp-changed');
const htmlmin = require('gulp-htmlmin');
const gnf = require('gulp-npm-files');
const ngannotate = require('gulp-ng-annotate');
const concat = require('gulp-concat');
const zip = require('gulp-zip');
const removeLog = require("gulp-remove-logging");
const minify = require('gulp-minify');
const jsonModify = require('gulp-json-modify');
const rename = require('gulp-rename');
const dist = 'dist';

/***** CLEAN - DELETES ALL EXISTING DIST FILES IN PREP FOR BUILD ********/

const cleanFiles = function(){
    return src('dist/',{read:false, allowEmpty:true}).pipe(clean());
}

const views = function(){
    return src('src/views/*.html')
        .pipe(htmlmin({
            collapseWhitespace:true
        }))
        .pipe(dest('dist/views'));
}

const fixEncrypt = function(){
    return src('dist/assets/node_modules/jsencrypt/bin/**/*')
        .pipe(dest('dist/assets/node_modules/jsencrypt/dev/'));
}
gulp.task('fixEncrypt',fixEncrypt);
const index = function(){

    return src('src/*.html')
        .pipe(useref())
        .pipe(gulpif('*.js',ngannotate()))

        .pipe(gulpif('*.js',uglify({
            compress:{
                drop_console:false
            }
        })))
        .pipe(gulpif('*.css', minifyCss()))
        .pipe(dest(dist))
}
const images = function(){
    return src('src/assets/images/**/*')
        .pipe(dest('dist/assets/images'));
}
const node = function(){
    return src(gnf(),{base:'./'}).pipe(dest('dist/assets'));
}

const components = function(){
    return src('src/components/html/*')
        .pipe(dest('dist/components/html'));
}
const configuration = function(){
    return src('src/assets/configuration/*')
        .pipe(dest('dist/assets/configuration'));
}

const fonts = function(){
    return src(
        [
            "./node_modules/bootstrap-icons/font/fonts/bootstrap-icons.woff",
            "./node_modules/bootstrap-icons/font/fonts/bootstrap-icons.woff2"
        ]
    )
        .pipe(dest('dist/assets/css/fonts'));
}

const amx_export = function(){
    return src('dist/**/**')
        .pipe(rename(function(file){
            file.dirname = "app/" + file.dirname;
        }))
        .pipe(zip('gui.zip'))
        .pipe(dest('exports'))

}



/********* TASKS *********/
gulp.task('clean',gulp.series(cleanFiles));
gulp.task('build',gulp.series(index,views,images,node,components,configuration,fixEncrypt,fonts));
gulp.task('default',gulp.series('clean','build',amx_export));