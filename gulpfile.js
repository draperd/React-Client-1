var gulp = require("gulp");
var babel = require("gulp-babel");
var del = require("del");
var merge = require("merge-stream");

gulp.task("clean:lib", function () {
   return del(["lib"]);
});

gulp.task("build:lib", function () {
   var js = gulp.src([ "./src/**/*.js", "!./src/index.js"])
                .pipe(babel({presets:["react-app"]}))
                .pipe(gulp.dest("lib"));

   var css = gulp.src([ "./src/**/*.css", "!./src/index.css"])
                 .pipe(gulp.dest("lib"));

   return merge(js, css);
});
