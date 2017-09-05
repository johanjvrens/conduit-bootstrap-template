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

// static server + watching scss/njk files
gulp.task("serve", ["scss", "njk"], function() {
  $.browserSync.init({ server: pkg.paths.build.base });
  gulp.watch(pkg.paths.src.scss, ["scss"]);
  gulp.watch(pkg.paths.src.templates, ["njk-watch"]);
  gulp.watch(pkg.paths.src.njk, ["njk-watch"]);
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

// njk - build the nunjucks templates to the build (tmp) folder as html files
gulp.task("njk", () => {
  $.fancyLog(
    $.chalk.yellowBright("Compiling: ") + $.chalk.greenBright("njk to html.")
  );
  return gulp
    .src(pkg.paths.src.njk)
    .pipe(
      $.data(function() {
        return require("./data.json");
      })
    ) // Adding data to Nunjucks
    .pipe($.nunjucksRender({ path: ["src/templates/"] }))
    .pipe(gulp.dest(pkg.paths.build.html));
});

// njk-watch - ensures the `njk` task is complete before reloading browsers
gulp.task("njk-watch", ["njk"], function(done) {
  $.browserSync.reload();
  done();
});

// default serve (runs on yarn start)
gulp.task("default", ["serve"]);

// production build (runs on yarn build)
gulp.task("build", ["scss", "njk"]);
