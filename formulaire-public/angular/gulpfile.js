var gulp = require('gulp');
var webpack = require('webpack-stream');
var merge = require('merge2');
const replace = require('gulp-replace');
var clean = require('gulp-clean');
var argv = require('yargs').argv;
var fs = require('fs');

if (argv.targetModule) {
    console.log("using arg:", argv.targetModule);
    apps = [argv.targetModule];
}

gulp.task('drop-cache', () => {
    var streams = [];
    streams.push(gulp.src(['./src/dist'], {read: false}).pipe(clean()))
    streams.push(gulp.src(['./build'], {read: false}).pipe(clean()))
    return merge(streams);
});

gulp.task('copy-mdi-font', ['drop-cache'], () => {
    var streams = [];
    streams.push(gulp.src('./node_modules/@mdi/font/fonts/*')
        .pipe(gulp.dest('./src/mdi')))
    return merge(streams);
});

gulp.task('webpack', ['copy-mdi-font'], () => {
    var streams = [];
    streams.push(gulp.src('./src/**/*.ts')
        .pipe(webpack(require('./webpack.config.js')))
        .on('error', function handleError() {
            this.emit('end'); // Recover from errors
        })
        .pipe(gulp.dest('./src/dist')))
    return merge(streams);
});

gulp.task('build', ['webpack'], () => {
    var streams = [];
    streams.push(gulp.src("./src/view-src/**/*.html")
        .pipe(replace('@@VERSION', Date.now()))
        .pipe(gulp.dest("./src/view")));
    streams.push(gulp.src("./src/dist/behaviours.js")
        .pipe(gulp.dest("./src/js")));
    return merge(streams);
});