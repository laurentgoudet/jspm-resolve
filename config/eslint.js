module.exports = function (gulp, config) {
    var eslint = require("gulp-eslint"),
        gutil = require("gulp-util"),
        debug = require("gulp-debug"),
        cached = require("gulp-cached"),
        gulpif = require("gulp-if"),
        notify = require("gulp-notify"),
        chalk = require("chalk");

    gulp.task("eslint", function () {
        return gulp.src(config.files || "**/*.js{,x}")
            .pipe(cached("eslint"))
            .pipe(gulpif(gutil.env.debug, debug()))
            .pipe(eslint())
            .pipe(eslint.format())
            .pipe(notify(function (file) {
                if (!file || !file.eslint || !(file.eslint.messages || []).length) {
                    // Don't show something if success
                    return false;
                }

                var errors = file.eslint.messages
                    .filter(function (data) {return data.message;})
                    .map(function (data) {
                        return "(" + data.line + ":" + data.column + ") " + data.message;
                    }).join("\n");

                var errorString = file.relative + " (" + file.eslint.messages.length + " errors)\n" + errors;

                if (process.platform === "win32") {
                    errorString = chalk.stripColor(errorString);
                }

                return errorString;
            }));
    });
};
