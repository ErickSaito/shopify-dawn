const { src, dest, series, parallel, watch } = require("gulp");
const gulpSass = require("gulp-sass");
const dartSass = require("sass");
const clean = require("gulp-clean");
const babel = require("gulp-babel");
const minify = require("gulp-minify");
const cleancss = require("gulp-clean-css");

const sass = gulpSass(dartSass);
const srcPath = {
  scss: "src/styles/",
  js: "src/scripts/",
};

const assetsPath = "assets/";

function processScss() {
  return src(`${srcPath.scss}/*.scss`)
    .pipe(
      sass({
        includePaths: [srcPath.scss],
      }).on("error", sass.logError)
    )
    .pipe(cleancss())
    .pipe(dest(assetsPath));
}

function processScripts() {
  return src(`${srcPath.js}/*.js`)
    .pipe(
      babel({
        presets: ["@shopify/babel-preset"],
      })
    )
    .pipe(
      minify({
        noSource: true,
        ext: {
          min: ".js",
        },
      })
    )
    .pipe(dest(assetsPath));
}

function watchPaths() {
  watch(srcPath.js, processScripts);
  watch(srcPath.scss, processScss);
}

const styles = series(processScss);

const scripts = series(processScripts);
const buildAssets = parallel(styles, scripts);

exports.build = series(buildAssets);
exports.default = series(buildAssets, watchPaths);
