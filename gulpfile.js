
const gulp = require('gulp')
const del = require('del')
const runSequence = require('run-sequence')
const $ = require('gulp-load-plugins')()
const mergeStream = require("merge-stream")

gulp.task('clean', del.bind(null, ['./dist', './rev'], {
    force: true
}));

gulp.task('css', function () {

    console.log("css");

    return gulp.src('src/**/*.css')
        .pipe($.stylus()) // 该任务调用的模块
        .pipe($.autoprefixer({
            browsers: ['last 10 versions'],

            // 是否美化属性值 默认：true 像这样：
            // -webkit-transform: rotate(45deg);
            //        transform: rotate(45deg);
            cascade: true,
            remove: false // 是否去掉不必要的前缀 默认：true
        }))
        // .pipe($.concat("index.css"))
        .pipe($.minifyCss())
        // .pipe($.rev())
        .pipe(gulp.dest('dist'))

    // .pipe($.rev.manifest())
    // .pipe(gulp.dest('rev/css'));

});

gulp.task("styl", function (params) {

    return gulp.src('src/**/*.styl')
        .pipe($.watch('src/**/*.styl'))
        .pipe($.stylus()) // 该任务调用的模块
        .on('error', swallowError)
        // .pipe(gulp.dest('src'))
        .pipe(gulp.dest('dist'))

})

gulp.task("babel", function (params) {
// 
    // console.log($)
    return gulp.src('src/**/*.babel.js')
        .pipe($.rename(function (path) {
            path.basename = path.basename.split(".")[0]
        }))
    // return $.watch('src/**/*.babel.js')
        // .pipe($.changed('src2/**/*',{extension:'.js'}))
        // .pipe($.debug({title: '编译:'}))
        .pipe($.babel({
            presets: ['es2015']
        }))
        .on('error', swallowError)
        // .pipe(gulp.dest('src'))
        .pipe(gulp.dest('dist'))
})

gulp.task("js", function (params) {

    var minjs = gulp.src(['src/**/*.js', '!src/**/*.min.js'])
        .pipe($.babel({
            presets: ['es2015']
        }))
        .pipe($.uglify({
            compress: {
                drop_console: true
            }
        }))
        .pipe(gulp.dest('dist'))

    var copyjs = gulp.src('src/**/*.min.js')
        .pipe(gulp.dest('dist'))

    return mergeStream(minjs, copyjs)
})

gulp.task("img", function (params) {

    return gulp.src(getPath(["png", 'jpg', 'jpeg', 'gif']))
        .pipe($.imagemin())
        .pipe(gulp.dest('dist'))

})

gulp.task("html", function (params) {

    var options = {

        removeComments: true,// 清除HTML注释
        collapseWhitespace: true,// 压缩HTML
        collapseBooleanAttributes: true,// 省略布尔属性的值 <input checked="true"/> ==> <input />

        removeEmptyAttributes: true,// 删除所有空格作属性值 <input id="" /> ==> <input />
        removeAttributeQuotes: true, // 去掉属性的引号

        removeScriptTypeAttributes: true,// 删除<script>的type="text/javascript"
        removeStyleLinkTypeAttributes: true,// 删除<style>和<link>的type="text/css"

        minifyJS: true,// 压缩页面JS
        minifyCSS: true,// 压缩页面CSS

    };

    return gulp.src(getPath("html"))
        .pipe($.htmlmin(options))
        .pipe(gulp.dest("dist"))

})

gulp.task("copy", function (params) {

    return gulp.src(getPath(['eot', 'svg', 'ttf', 'woff', 'json']))
        .pipe(gulp.dest('dist'))

})

gulp.task('watch', function () {
    $.livereload.listen();
    gulp.watch('src/**/*.styl', ['styl']);
    gulp.watch('src/**/*.babel.js', ['babel']);
    gulp.watch('src/**/*.js', ['js']);
});

gulp.task('watch_babel', function () {
    $.livereload.listen();
    gulp.watch('src/**/*.babel.js', ['babel']);
});

// 监听本地使用先进工具开发，然后转换解析
gulp.task("development",function (params) {
    $.livereload.listen();
    gulp.watch('src/**/*.styl', ['styl']);
    gulp.watch('src/**/*.babel.js', ['babel'])
})

gulp.task("d",function (params) {
    $.livereload.listen();
    gulp.watch('src/**/*.styl', ['styl']);
    gulp.watch('src/**/*.babel.js', ['babel'])
    $.livereload.listen();
})


gulp.task('default', function (cb) {

    // 同步运行任务
try{


    // runSequence('clean', "styl", ['css', 'babel', 'img', 'js', 'html', 'copy'], 'watch', cb)
    runSequence('clean',[ 'img', 'babel','html','copy','css','js'],  cb)

}
catch (e){
    console.log("e",e);
}
})

function getPath(postfix) {

    var arr = []
    if (Array.isArray(postfix)) {

        postfix.forEach(function (item, index) {
            arr.push('src/**/*.' + item)
        })
        return arr
    } else {
        return 'src/**/*.' + postfix
    }
}

function swallowError(error) {
    // If you want details of the error in the console
  console.log("\n\n%c发生错误了--------->\n\n","text-shadow: 0 1px 0 #ccc,0 2px 0 #c9c9c9,0 3px 0 #bbb,0 4px 0 #b9b9b9,0 5px 0 #aaa,0 6px 1px rgba(0,0,0,.1),0 0 5px rgba(0,0,0,.1),0 1px 3px rgba(0,0,0,.3),0 3px 5px rgba(0,0,0,.2),0 5px 10px rgba(0,0,0,.25),0 10px 10px rgba(0,0,0,.2),0 20px 20px rgba(0,0,0,.15);font-size:5em")

  console.log(error.toString());

  console.log("--------------\n\n")
  

  this.emit('end')
}
