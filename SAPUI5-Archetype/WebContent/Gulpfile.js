var gulp = require('gulp');
var replace = require('gulp-string-replace');


var namespace = 'my.new.namespace';
var dependancies = 'my/new/namespace';


//
gulp.task('replace-namespace', function() {
	  gulp.src(["./**/*.*","!Gulpfile.js"]) 
	    .pipe(replace('com.raprins.archetype', namespace))
	    .pipe(gulp.dest('./'))
	});

gulp.task('replace-import', function() {
	  gulp.src(["./**/*.*",
	            "!Gulpfile.js"]) 
	    .pipe(replace('com/raprins/archetype', dependancies))
	    .pipe(gulp.dest('./'))
	});

gulp.task('init-ui5',['replace-namespace','replace-import']);
