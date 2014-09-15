
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
 * Output directory.
 */

var build = join(root, 'build');

/**
 * File changes.
 */

Watcher(root).watch(function(file){
  console.log('changed: %s', file);
  var out = join(build, basename(file));

  // Transform
  var duo = Duo(root)
    .entry(file)
    .use(myth());

  // Build & reload
  duo.run(function(err, str){
    err && console.error(err);
    mkdir(build);
    write(out, str);
    console.log('rebuilt: %s', file);
    reload();
  });
});

/**
 * Server.
 */

function server(opts){
  opts = opts || {};

  var app = koa();

  app.use(function *(){
    if (this.path.match(/^.+\.[\w]+$/g)) {
      yield send(this, this.path, {root: build});
    } else {
      yield send(this, join(root, '/lib/index.html'));
    }
  });

  app.listen(opts.port);
  browserSync({ proxy: format('localhost:%d', opts.port) });
}

