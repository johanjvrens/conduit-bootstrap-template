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

// styles - build the scss to the build (tmp) folder, including the required paths, and writing out a sourcemap
gulp.task("styles", function() {
  $.fancyLog("---> Compiling scss <---");
  return gulp
    .src(pkg.paths.src.scss)
    .pipe($.plumber({ errorHandler: onError }))
    .pipe($.sourcemaps.init({ loadMaps: true }))
    .pipe($.sass().on("error", $.sass.logError))
    .pipe($.cleanCss({ compatibility: "ie9" }))
    .pipe($.header(banner, { pkg: pkg }))
    .pipe($.sourcemaps.write("./"))
    .pipe(gulp.dest(pkg.paths.dest.css));
});

gulp.task("templates", function() {
  const templates = {};
  const files = $.fs
    .readdirSync(pkg.paths.src.partials)
    .filter(function(file) {
      // return filename
      if (file.charAt(0) === "_") {
        return file;
      }
    })
    // add them to the templates object
    .forEach(function(template) {
      const slug = template.replace("_", "").replace(".html", "");
      templates[slug] = $.fs.readFileSync(
        pkg.paths.src.partials + template,
        "utf8"
      );
    });

  return gulp
    .src([pkg.paths.src.pages])
    .pipe($.template(templates))
    .on("error", $.util.log)
    .pipe(gulp.dest(pkg.paths.dest.html));
});

// Watch task
gulp.task("default", function() {
  // run task initially, after that watch
  gulp.start(["styles", "templates"]);
  gulp.watch(pkg.paths.src.scss, ["styles"]);
  gulp.watch(pkg.paths.src.html, ["templates"]);
  gulp.src(pkg.paths.dest.html).pipe(
    $.serverLivereload({
      livereload: true,
      directoryListing: false,
      open: true
    })
  );
});

// Production build
gulp.task("build", ["styles", "templates"]);
