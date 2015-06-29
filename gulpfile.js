/**
 * Created by idams on 6/18/15.
 */

var gulp = require('gulp');
var browserify = require('browserify');
var watchify = require('watchify');
var babelify = require('babelify');
var source = require('vinyl-source-stream');
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');
var buffer = require('vinyl-buffer');

function build(watch,prod){
    var b = browserify({
                cache: {},
                packageCache: {},
                fullPaths: true,
                entries: 'js/app.jsx',
                extensions: ['.jsx'],
                debug: true
            })
            .transform(babelify)

    if( watch ) b = watchify(b);

    createBundle(b,prod);

    b.on('update',function(){
        createBundle(b)
    });

}

function createBundle(b,prod){

    var bundle = b.bundle();

    if( prod ){
        bundle = bundle.pipe(source('bundle.min.js'))
            .pipe(buffer())
            .pipe(uglify());
    }else{
        bundle = bundle.pipe(source('bundle.js'))
            .pipe(buffer())
            .pipe(sourcemaps.init())
            .pipe(sourcemaps.write('.'));
    }
    bundle.pipe(gulp.dest('js'));

}

gulp.task('prod',function(){

    build(false,true);

});

gulp.task('watch',function(){

    build(true);

});

gulp.task('default', function(){

    build();

});