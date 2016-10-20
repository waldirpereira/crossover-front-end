var gulp = require('gulp');
var merge = require('merge-stream');
var jshint = require('gulp-jshint');
var clean = require('gulp-clean');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var gulpif = require('gulp-if');
var htmlmin = require('gulp-htmlmin');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var cleanCss = require('gulp-clean-css');
var rename = require('gulp-rename');
var runSequence = require('run-sequence');

gulp.task('clean', function () {
    return gulp.src('dist/')
		.pipe(clean());
});

gulp.task('jshint', function () {
    return gulp.src('scripts/app/**/*.js')
      .pipe(jshint())
      .pipe(jshint.reporter('default'));
});

gulp.task('bundle', ['jshint'], function () {
    return merge(
		makeBundleJs([
			'scripts/app/cong.module.js',
			'scripts/app/cong.template.service.js',
			'scripts/app/cong.menu.js'
		], 'app.min.js', 'dist/js/app'),
		makeBundleJs([
			'scripts/app/element/cong.element.module.js',
			'scripts/app/element/cong.element.components.js',
			'scripts/app/element/cong.element.service.js',
			'scripts/app/element/cong.element.controller.js',
			'scripts/app/element/cong.element.modal.controller.js'
		], 'element.min.js', 'dist/js/app'),
		makeBundleJs([
			'scripts/app/readme/cong.readme.controller.js',
			'scripts/app/readme/cong.readme.directive.js'
		], 'readme.min.js', 'dist/js/app'),
		makeBundleJs([
			'node_modules/jquery/dist/jquery.min.js',
			'node_modules/bootstrap/dist/js/bootstrap.min.js',
			'node_modules/angular/angular.min.js',
			'node_modules/angular-route/angular-route.min.js',
			'node_modules/angular-animate/angular-animate.min.js',
			'node_modules/angular-ui-bootstrap/dist/ui-bootstrap-tpls.js',
			'node_modules/chart.js/dist/Chart.min.js',
			'node_modules/angular-chart.js/dist/angular-chart.min.js'
		], 'all.min.js', 'dist/js/vendor'),
        makeBundleJs('node_modules/angular-mocks/angular-mocks.js',
            'angular-mocks.js',
            'dist/js/vendor')
	);

    function makeBundleJs(src, dest, path) {
        return gulp.src(src)
			.pipe(gulpif(src.indexOf('.min.js') < 0, uglify()))
			.pipe(concat(dest))
			.pipe(gulp.dest(path));
    }
});

gulp.task('htmlmin', function () {
    return gulp.src('content/templates/*.html')
		.pipe(htmlmin({
		    collapseWhitespace: true
		}))
		.pipe(gulp.dest('dist/tpt'));
});

gulp.task('scss', function () {
    return gulp.src('content/css/app/*.scss')
		.pipe(sass().on('error', sass.logError))
		.pipe(gulp.dest('dist/css/app'));
});

gulp.task('minify-css', ['scss'], function () {
    return merge(
		gulp.src('dist/css/app/*.css')
			.pipe(sourcemaps.init())
			.pipe(cleanCss({ compatibility: 'ie8' }))
			.pipe(rename({ suffix: '.min' }))
			.pipe(sourcemaps.write('./'))
			.pipe(gulp.dest('dist/css/app')),

		merge(
			gulp.src('node_modules/bootstrap/dist/css/bootstrap.min.css'),
			gulp.src('node_modules/angular-ui-bootstrap/dist/ui-bootstrap-csp.css')
				.pipe(cleanCss({ compatibility: 'ie8' }))
		)
			.pipe(concat('vendor.min.css'))
			.pipe(gulp.dest('dist/css/vendor')),

		gulp.src('node_modules/bootstrap/dist/fonts/*.*')
			.pipe(gulp.dest('dist/css/fonts'))
	);
});

gulp.task('copy', function () {
    return merge(
        gulp.src([
            'index.html',
            'README.txt',
            'test/**/*.*',
            'json/**/*.*'
        ], { base: '.' })
            .pipe(gulp.dest('dist')),

        gulp.src('test.html')
        	.pipe(gulp.dest('dist/test.html'));
        	
        gulp.src('content/images/app/**/*.*')
            .pipe(gulp.dest('dist/img'))
    );
});

gulp.task("default", function (cb) {
    return runSequence('clean', ['jshint', 'minify-css', 'bundle', 'htmlmin', 'copy'], cb);
});