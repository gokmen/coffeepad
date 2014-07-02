gulp       = require 'gulp'
gutil      = require 'gulp-util'
stylus     = require 'gulp-stylus'
CSSmin     = require 'gulp-minify-css'
browserify = require 'browserify'
watchify   = require 'watchify'
concat     = require 'gulp-concat'
source     = require 'vinyl-source-stream'
streamify  = require 'gulp-streamify'
symlink    = require 'gulp-sym'
uglify     = require 'gulp-uglify'
coffeeify  = require 'coffeeify'
ecstatic   = require 'ecstatic'
livereload = require 'gulp-livereload'

production = process.env.NODE_ENV is 'production'

paths =
  scripts       :
    watch       : './src/*.coffee'
    source      : './src/main.coffee'
    destination : './public/js/'
    filename    : 'main.js'
  styles        :
    source      : './src/styl/main.styl'
    watch       : './src/styl/*.styl'
    destination : './public/css/'

handleError = (err) ->
  gutil.log err
  gutil.beep()
  this.emit 'end'

gulp.task 'scripts', ->

  bundle = browserify
    entries: [paths.scripts.source]
    extensions: ['.coffee']

  bundle.transform coffeeify

  build = bundle.bundle(debug: not production)
    .on 'error', handleError
    .pipe source paths.scripts.filename

  build.pipe streamify uglify() if production

  build
    .pipe gulp.dest paths.scripts.destination

gulp.task 'styles', ->

  styles = gulp
    .src paths.styles.source
    .pipe(stylus({set: ['include css']}))
    .on 'error', handleError

  styles = styles.pipe CSSmin() if production

  styles.pipe gulp.dest paths.styles.destination
    .pipe livereload()


gulp.task 'build-libs', ->

  build = gulp.src [
    "./src/coffee-script.min.js"
    "./src/codemirror/lib/codemirror.js"
    "./src/codemirror/addon/hint/show-hint.js"
    "./src/codemirror/addon/hint/javascript-hint.js"
    "./src/codemirror/mode/javascript/javascript.js"
    "./src/codemirror/mode/coffeescript/coffeescript.js"
    "./src/codemirror/mode/css/css.js"
    "./src/jshint.js"
    "./src/codemirror/addon/selection/active-line.js"
    "./src/codemirror/addon/search/searchcursor.js"
    "./src/codemirror/addon/search/search.js"
    "./src/codemirror/addon/dialog/dialog.js"
    "./src/codemirror/addon/edit/matchbrackets.js"
    "./src/codemirror/addon/edit/closebrackets.js"
    "./src/codemirror/addon/comment/comment.js"
    "./src/codemirror/addon/wrap/hardwrap.js"
    "./src/codemirror/addon/fold/foldcode.js"
    "./src/codemirror/addon/fold/brace-fold.js"
    "./src/codemirror/addon/fold/foldgutter.js"
    "./src/codemirror/addon/fold/comment-fold.js"
    "./src/codemirror/addon/fold/indent-fold.js"
    "./src/codemirror/addon/lint/coffeelint.js"
    "./src/codemirror/addon/lint/lint.js"
    "./src/codemirror/addon/lint/javascript-lint.js"
    "./src/codemirror/addon/lint/coffeescript-lint.js"
    "./src/codemirror/keymap/sublime.js"
    "./src/kd.libs.js"
    "./src/kd.js"
  ]

  build.pipe streamify uglify() if production
  build
    .pipe concat 'coffeepad.js'
    .pipe gulp.dest paths.scripts.destination


gulp.task 'server', ->
  require 'http'
    .createServer ecstatic root: __dirname + '/public'
    .listen 1903

gulp.task "watch", ->
  livereload.listen()

  gulp.watch paths.styles.watch,  ['styles']
  gulp.watch paths.scripts.watch, ['scripts']

  bundle = watchify
    entries    : [paths.scripts.source]
    extensions : ['.coffee']

  bundle.transform coffeeify

  bundle.on 'update', ->
    build = bundle.bundle debug: not production
      .on 'error', handleError

      .pipe source paths.scripts.filename

    build
      .pipe gulp.dest paths.scripts.destination
      .pipe livereload()

  .emit 'update'

gulp.task "create-links", ->

  gulp

    .src [
      './src/images',
      './src/css',
      './src/chrome',
      './src/index.html'
      './src/manifest.json'
    ]

    .pipe symlink [
      './public/images',
      './public/css',
      './public/chrome',
      './public/index.html'
      './public/manifest.json'
    ], force: yes


gulp.task "build", ["build-libs", "scripts", "styles", "create-links"]
gulp.task "default", ["build", "watch", "server"]
