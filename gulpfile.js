var gulp            = require('gulp'),
    concat          = require('gulp-concat'),
    concatCSS       = require('gulp-concat-css'),
    rename          = require('gulp-rename'),
    uglify          = require('gulp-uglify'),
    cssmin          = require('gulp-cssmin'),
    runSequence     = require('gulp-run-sequence'),
    watch           = require('gulp-watch');
    sass            = require('gulp-sass'),
    plumber         = require('gulp-plumber'),
    autoprefixer    = require('gulp-autoprefixer'),
    browserSync     = require('browser-sync'),
    // imagemin     = require('gulp-imagemin');


/*====================================================
    task script 
     
====================================================*/

gulp.task('script', function () {
    // proses pencarian file js
    return gulp.src([
            'bower_components/jquery/dist/jquery.js',
            'bower_components/bootstrap-css/js/bootstrap.min.js',
         ])
    // kombinasi file js menggunakan plugin concat
    .pipe(concat('all.js'))
    // simpan file yang sudah di kombinasikan
    .pipe(gulp.dest('dev/js'))
    // merubah nama file js yang sudah di kombinasikan
    .pipe(rename('all.min.js'))
    // meng-comprese file js
    .pipe(uglify())
    // menyimpan file yang sudah di comprsae
    .pipe(gulp.dest('dist/js'));
});

gulp.task('mixCSS', function () {
    return gulp.src([
        'bower_components/bootstrap-css/css/bootstrap.min.css',
        'bower_components/material-design-iconic-font/dist/css/material-design-iconic-font.min.css',
         ])
    .pipe(concatCSS("plugins.css"))
    .pipe(cssmin())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('dist/css'));

});


gulp.task('mainJS', function(){
    return gulp.src('dev/js/*.js')
    .pipe(rename('main.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('dist/js'));
});

// task sass
gulp.task('sass', function(){
    return gulp.src('dev/scss/**/*.scss')
    .pipe(plumber({ errorHandler: function (err) {
                    console.log(err);
                    this.emit('end');
                    }
                }))
    .pipe(sass({
        outputStyle:'compressed'
    }))
    .pipe(autoprefixer({
            browsers: ['last 3 versions'],
            cascade: false
        }))
    .pipe(gulp.dest(('dist/css/')))
    .pipe(browserSync.reload({
        stream:true
    }));
});



// sass + browserSync
gulp.task('sassSync',['sass'], browserSync.reload)

// gulp watch 
gulp.task('watch', function(){

    browserSync.init({
        server: {
            baseDir: './'
        },
        injectChanges: true
    });

    gulp.watch('dev/js/*.js', ['mainJS']);
    gulp.watch('dev/images/*', ['image']);
    gulp.watch('dev/**/*.scss', ['sassSync']);
    gulp.watch('*.html').on('change', browserSync.reload);
});



// task default
gulp.task('default', function(callback){
    runSequence('script', callback);
});
