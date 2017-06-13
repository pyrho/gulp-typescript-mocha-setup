const gulp = require('gulp');
const ts = require('gulp-typescript');
const sourcemaps = require('gulp-sourcemaps');
const mocha = require('gulp-mocha');
const del = require('del');
const gutil = require('gulp-util');

const config = {
    outputDirectory: './build',
    inputSourceFiles: [
        './src/**/*.ts',
    ],
    inputTestFiles: [
        './test/**/*.ts',
    ],
    tsConfigPath: 'tsconfig.json',
};

const typescriptProjectSource = ts.createProject(config.tsConfigPath, {
    "sourceMap": false
});
const typescriptProjectTest = ts.createProject(config.tsConfigPath, {
    "sourceMap": false
});

// Helpers {{{
function onErrorHandler(error) {
    this.emit('end');
}
// }}}

// Gulp tasks {{{
// As recommended by https://github.com/gulpjs/gulp/blob/master/docs/recipes/delete-files-folder.md

gulp.task('cleanTest', () => 
    del([
        `${config.outputDirectory}/test`,
    ])
);
gulp.task('compileTest', ['cleanTest'], () => gulp
    .src(config.inputTestFiles)
    .pipe(sourcemaps.init())
    .pipe(typescriptProjectTest())
    .on('error', onErrorHandler)
    .pipe(sourcemaps.write('.', {
        sourceRoot: function (file) {
            return file.cwd + '/test';
        }
    }))
    .pipe(gulp.dest(config.outputDirectory + '/test'))
);

gulp.task('cleanSrc', () => 
    del([
        `${config.outputDirectory}/src`,
    ])
);
gulp.task('compileSrc', ['cleanSrc'], () => gulp
    .src(config.inputSourceFiles)
    .pipe(sourcemaps.init())
    .pipe(typescriptProjectSource(ts.reporter.fullReporter(true)))
    .on('error', gutil.log)
    .pipe(sourcemaps.write('.', {
        sourceRoot: function (file) {
            return file.cwd + '/src';
        }
    }))
    .pipe(gulp.dest(config.outputDirectory + '/src'))
);

gulp.task('compile', ['compileSrc', 'compileTest']);

gulp.task('test', () => gulp
    .src('./build/test/**/*.js', { read: false })
    .pipe(mocha({ 
        reporter: 'spec',
        timeout: 5000,
        require: ['source-map-support/register'],
    }))
    .on('error', onErrorHandler)
);


gulp.task('compileSrcForWatch', ['compileSrc'], () => gulp.start('test'));
gulp.task('compileTestForWatch', ['compileTest'], () => gulp.start('test'));

gulp.task('watchAndTest', () => {
    gulp.watch(config.inputSourceFiles, ['compileSrcForWatch']);
    gulp.watch(config.inputTestFiles, ['compileTestForWatch']);
});
gulp.task('watch', () => {
    gulp.watch(config.inputSourceFiles, ['compileSrc']);
    gulp.watch(config.inputTestFiles, ['compileTest']);
});

// }}}
