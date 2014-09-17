
/**
 * Module dependencies.
 */

var Watcher = require('duo-watch');
var Duo = require('duo');
var basename = require('path').basename;
var browserSync = require('browser-sync');
var co = require('co');
var format = require('format').format;
var join = require('path').join;
var koa = require('koa');
var mkdir = require('mkdirp').sync;
var myth = require('duo-myth');
var reload = browserSync.reload;
var send = require('koa-send');
var write = require('fs').writeFileSync;
var root = process.cwd();

/**
 * Expose `server`.
 */

module.exports = server;

/**
 * Server.
 */

function server(opts){
  opts = opts || {};
  var build = join(root, opts.out);

  /**
   * Watch for changes.
   */

  Watcher(root).watch(function(file){
    console.log('changed: %s', file);
    var out = join(build, basename(file));

    // Transform
    var duo = Duo(root).entry(file).use(myth()).use(function(){
      return function (file){
        // TODO Investigate why immediate #reload does not work
        if ('css' === file.type) {
          reload({stream: true});
        }
      }
    }());

    // Build & reload
    duo.run(function(err, str){
      err && console.error(err);
      mkdir(build);
      write(out, str);
      if (!out.match(/^.*\.css$/)) {
        reload();
      }
      console.log('rebuilt: %s', file);
    });
  });

  /**
   * Create server.
   */

  var app = koa();
  app.use(function *(){
    if (this.path.match(/^.+\.[\w]+$/g)) {
      yield send(this, this.path, {root: build});
    } else {
      yield send(this, join(root, opts.html));
    }
  });

  /**
   * Start listening for requests.
   */

  app.listen(opts.port);
  browserSync({
    proxy: format('localhost:%d', opts.port),
    online: opts.online,
    xip: opts.xip
  });
}

