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
gulp.task("serve", ["scss"], function() {
  $.browserSync.init({ server: pkg.paths.build.base });
  // scss file watcher
  gulp.watch(pkg.paths.src.scss, ["scss"]).on("change", function(event) {
    $.fancyLog(
      "File " +
        event.type +
        $.chalk.cyanBright(" scss: ") +
        $.chalk.magentaBright(event.path)
    );
  });
  // njk file watcher
  gulp
    .watch([pkg.paths.src.njk, pkg.paths.src.templates], ["njk-watch"])
    .on("change", function(event) {
      $.fancyLog(
        "File " +
          event.type +
          $.chalk.cyanBright(" njk: ") +
          $.chalk.magentaBright(event.path)
      );
    });
});

// scss - build the scss to the build (tmp) folder, including the required paths, and writing out a sourcemap
gulp.task("scss", ["njk"], function() {
  $.fancyLog("Compile: " + $.chalk.greenBright("scss to css."));
  return gulp
    .src(pkg.paths.src.scss)
    .pipe($.plumber({ errorHandler: onError }))
    .pipe($.sourcemaps.init({ loadMaps: true }))
    .pipe($.sass().on("error", $.sass.logError))
    .pipe($.autoprefixer({ browsers: ["last 2 versions", "> 5%"] }))
    .pipe($.cleanCss({ compatibility: "ie9" }))
    .pipe($.sourcemaps.write("./maps"))
    .pipe(gulp.dest(pkg.paths.build.css))
    .pipe($.browserSync.stream());
});

// njk - build the nunjucks templates to the build (tmp) folder as html files
gulp.task("njk", function() {
  $.fancyLog("Compile: " + $.chalk.greenBright("njk to html."));
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

// js - lint, minify and copy js files to (tmp) folder
gulp.task("js", function() {
  $.fancyLog("Process: " + $.chalk.greenBright("js."));
  return gulp
    .src(pkg.paths.src.js)
    .pipe($.plumber({ errorHandler: onError }))
    .pipe($.sourcemaps.init())
    .pipe($.uglify())
    .pipe($.sourcemaps.write("./maps"))
    .pipe(gulp.dest(pkg.paths.build.js));
});

// Strip, prefix, minify and concatenate CSS during a deployment
gulp.task("css-dist", ["scss"], function() {
  $.fancyLog($.chalk.greenBright("• run CSS tasks for distribution"));
  return gulp
    .src(pkg.paths.src.css)
    .pipe($.plumber({ errorHandler: onError }))
    .pipe($.header(banner, { pkg: pkg }))
    .pipe(gulp.dest(pkg.paths.dist.css));
});

// Strip, minify and concatenate your JavaScript during a deployment
gulp.task("js-dist", ["js"], function() {
  $.fancyLog($.chalk.greenBright("• run JavaScript tasks for distribution"));
  return gulp
    .src(pkg.paths.src.js)
    .pipe($.plumber({ errorHandler: onError }))
    .pipe($.uglify())
    .pipe(gulp.dest(pkg.paths.dist.js));
});

// html-dist - build the nunjucks templates to the build (tmp) folder as html files
gulp.task("html-dist", ["njk"], function() {
  $.fancyLog($.chalk.greenBright("• run HTML tasks for distribution"));
  return gulp.src(pkg.paths.src.html).pipe(gulp.dest(pkg.paths.dist.html));
});

// service worker
gulp.task("bundle-sw", ["serve"], function() {
  return $.workboxBuild
    .generateSW({
      globDirectory: pkg.paths.build.base,
      swDest: pkg.paths.build.base + "sw.js",
      globPatterns: ["**/*.{html,js,css}"],
      globIgnores: ["admin.html"]
    })
    .then(() => {
      console.log("Service worker generated.");
    })
    .catch(err => {
      console.log("[ERROR] This happened: " + err);
    });
});

// default serve (runs on yarn start)
gulp.task("default", ["serve"]);

// production build (runs on yarn build)
gulp.task("build", ["bundle-sw", "css-dist", "js-dist", "html-dist"]);
