import gulp from 'gulp';
import loadPlugins from 'gulp-load-plugins';
import path from 'path';

// Load the gulp plugins into the `plugins` variable
const plugins = loadPlugins();

const paths = {
    js: ['./**/*.js', '!dist/**', '!node_modules/**'],
};

// Compile all Babel Javascript into ES5 and put it into the dist dir
gulp.task('babel', () => {
    return gulp.src(paths.js, { base: '.' }).pipe(plugins.babel()).pipe(gulp.dest('dist'));
});

// Start server with restart on file change events
gulp.task(
    'nodemon',
    gulp.series('babel', function () {
        plugins.nodemon({
            script: path.join('dist', 'index.js'),
            ext: 'js',
            ignore: ['node_modules/**/*.js', 'dist/**/*.js'],
            tasks: ['babel'],
        });
    }),
);
