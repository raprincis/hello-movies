
//Declare dependancies
var gulp = require('gulp');
var ui5preload = require('gulp-ui5-preload');
var uglify = require('gulp-uglify');
var prettydata = require('gulp-pretty-data');
var gulpif = require('gulp-if');
var csso = require('gulp-csso');

const BASE_NAMESPACE = 'com.raprins.ui5.offline';
const BASE_DIRECTORY = './';

//Generate Component-preload.json
gulp.task('ui5preload', function(){
	return gulp.src([
	          './controller/*.js',
	          './view/*.xml',
	          './css/*.css',
	          './Component.js'
	                 ])
		.pipe(gulpif(BASE_DIRECTORY + '**/*.js',uglify()))
		.pipe(gulpif(BASE_DIRECTORY + '**/*.xml',prettydata({type:'minify'})))
		.pipe(ui5preload({base: BASE_DIRECTORY ,BASE_NAMESPACE: BASE_NAMESPACE}))
		.pipe(gulp.dest(BASE_DIRECTORY));
});

//Default task
gulp.task('default',['ui5preload']);
