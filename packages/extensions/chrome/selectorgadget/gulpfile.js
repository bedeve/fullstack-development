/**
 * Building scripts.
 */

var fs          = require('fs')
  , gulp        = require('gulp')
  , browserify  = require('browserify')
  , transform   = require('vinyl-transform')
  , source      = require('vinyl-source-stream')
  , concat      = require('gulp-concat')
  , uglify      = require('gulp-uglify')
  , minify      = require('gulp-minify-css')
  , streamify   = require('gulp-streamify')
  , header      = require('gulp-header')
  , ignore      = require('gulp-ignore')
  , git         = require('gulp-git')
  , bump        = require('gulp-bump')
  , filter      = require('gulp-filter')
  , sequence    = require('run-sequence')
  , signature   = fs.readFileSync('./signature')
  , gitignore   = fs.existsSync('.gitignore') ? fs.readFileSync('.gitignore') + '' : ''
    // We read it as file so not to cache results.
  , pkg         = JSON.parse(fs.readFileSync('./package.json'));

/**
 * Refresh package info.
 */
function refreshPackage(next) {
  pkg = JSON.parse(fs.readFileSync('./package.json'));
  next && next();
  return pkg;
}

/**
 * Get a tag version from package json.
 */
function tag() {
  return 'v' + (refreshPackage()).version;
}

/**
 * Get signature header.
 */
function signatureHeader() {
  return header(signature, {
    pkg: pkg
  });
}

/**
 * Build a distribute bundler for SelectorGadget.
 */
gulp.task('script', function() {
  var browserified = transform(function(filename) {
    return browserify(filename).bundle();
  });

  return gulp.src(['./lib/js/main.js'])
    .pipe(browserified)
    .pipe(concat(pkg.name + '.js'))
    .pipe(signatureHeader())
    .pipe(gulp.dest('./dist'))
    .pipe(uglify({ mangle: false }))
    .pipe(signatureHeader())
    .pipe(concat(pkg.name + '.min.js'))
    .pipe(gulp.dest('./dist'));
});

/**
 * Build a distribute CSS.
 */
gulp.task('css', function () {
  gulp.src('./lib/css/*.css')
    .pipe(concat(pkg.name + '.css'))
    .pipe(signatureHeader())
    .pipe(gulp.dest('./dist'))
    .pipe(minify())
    .pipe(signatureHeader())
    .pipe(concat(pkg.name + '.min.css'))
    .pipe(gulp.dest('./dist'));
});

/**
 * Bumps version numbers.
 */
function bumper(importance, end) {
  // Get all the files to bump version in.
  gulp.src(['./package.json', './bower.json'])
    // Bump the version number in those files.
    .pipe(bump({ type: importance }))
    // Save it back to filesystem.
    .pipe(gulp.dest('./'))
    // Update our copy of package json.
    .on('end', refreshPackage.bind(this, end));
}

/**
 * Creates a new release.
 */
function release(version, end) {
  sequence(version, 'build', 'publish', end);
}

/**
 * Commits files and creates a new tag.
 */
gulp.task('publish', function (end) {
  var newTag = tag()
    , message = 'Created release ' + newTag;

  gulp.src('./*')
    .pipe(ignore.include(gitignore))
    // Add all files.
    .pipe(git.add({ args: '-u' }))
    // Commit the changed version number.
    .pipe(git.commit(message))
    // Tag it to the repository. 
    .pipe(git.tag(tag(), message, function(err) {
      if (err) throw err;
      git.push('origin', newTag, end);
    }));
});

// Versioning tags.
gulp.task('version:patch', bumper.bind(this, 'patch'));
gulp.task('version:minor', bumper.bind(this, 'minor'));
gulp.task('version:major', bumper.bind(this, 'major'));

// Common alias.
gulp.task('version', ['version:minor']);

// Releasing tasks.
gulp.task('release:patch', release.bind(this, 'version:patch'));
gulp.task('release:minor', release.bind(this, 'version:minor'));
gulp.task('release:major', release.bind(this, 'version:major'));

// Common alias.
gulp.task('release', ['release:minor']);

// Compilation tasks.
gulp.task('build', ['css', 'script']);
gulp.task('default', ['build']);
