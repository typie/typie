const gulp = require('gulp');
const clean = require('gulp-clean');
const fs = require('fs');
const yaml = require("js-yaml");

let settings = yaml.safeLoad(fs.readFileSync("./.env", 'utf8'));
let deployPaths = settings.deployPaths;

let copyPaths = [
    "./**/*",
    "!./node_modules/",
    "!./node_modules/**",
    "!./node_modules/**/*"
];

gulp.task('delete-old-sdk-modules', function (done) {
    for(let path of deployPaths) {
        try {
            if (fs.existsSync(path)) {
                gulp.src(path, {read: false}).pipe(clean({force: true}));
                console.log("deleted " + path);
            }
        } catch (err) {
            console.error("skiped " + path, err);
        }
    }
    setTimeout(() => done(), 1000);
});

gulp.task('copy-new-sdk', function (done) {
    for(let path of deployPaths) {
        try {
            if(!fs.existsSync(path)) {
                fs.mkdirSync(path);
            }
            gulp.src(copyPaths).pipe(gulp.dest(path));
            console.log("copied " + path);
        } catch (err) {
            console.error("skiped " + path, err);
        }
    }
    done();
});

gulp.task('deploy', gulp.series('delete-old-sdk-modules', 'copy-new-sdk'));