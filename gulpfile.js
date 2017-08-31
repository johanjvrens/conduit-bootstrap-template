const gulp = require("gulp");
// package vars
const pkg = require("./package.json");
// load all plugins in "devDependencies" into the variable $
const $ = require("gulp-load-plugins")({
  pattern: ["*"],
  scope: ["devDependencies"]
});
// plumber log all errors
const onError = err => {
  console.log(err);
};
// banner ontop of css files
const banner = [
  "/**",
  " * @project        <%= pkg.name %>",
  " * @version        v<%= pkg.version %>",
  " * @author         <%= pkg.author %>",
  " * @build          " + $.moment().format("llll") + " ET",
  " * @release        " +
    $.gitRevSync.long() +
    " [" +
    $.gitRevSync.branch() +
    "]",
  " * @copyright      Copyright (c) " +
    $.moment().format("YYYY") +
    ", <%= pkg.copyright %>",
  " */",
  ""
].join("\n");

// static server + watching scss/html files
gulp.task("serve", ["scss", "html"], function() {
  $.browserSync.init({
    server: pkg.paths.build.html
  });
  gulp.watch(pkg.paths.src.scss, ["scss"]);
  gulp.watch(pkg.paths.src.njk).on("change", $.browserSync.reload);
});

// scss - build the scss to the build (tmp) folder, including the required paths, and writing out a sourcemap
gulp.task("scss", () => {
  $.fancyLog(
    $.chalk.yellowBright("Compiling: ") + $.chalk.greenBright("scss to css.")
  );
  return gulp
    .src(pkg.paths.src.scss)
    .pipe($.plumber({ errorHandler: onError }))
    .pipe($.sourcemaps.init({ loadMaps: true }))
    .pipe($.sass().on("error", $.sass.logError))
    .pipe($.cleanCss({ compatibility: "ie9" }))
    .pipe($.header(banner, { pkg: pkg }))
    .pipe($.sourcemaps.write("./"))
    .pipe(gulp.dest(pkg.paths.build.css))
    .pipe($.browserSync.stream());
});

// html - build the nunjucks templates to the build (tmp) folder as html files
gulp.task("html", () => {
  $.fancyLog(
    $.chalk.yellowBright("Compiling: ") + $.chalk.greenBright("njk to html.")
  );
  return gulp
    .src(pkg.paths.src.njk)
    .pipe($.nunjucksRender({ path: [pkg.paths.src.templates] }))
    .pipe(gulp.dest(pkg.paths.build.html));
});

// default serve (runs on yarn start)
gulp.task("default", ["serve"]);

// production build (runs on yarn build)
gulp.task("build", ["scss", "html"]);
