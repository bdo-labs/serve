#!/usr/bin/env node --harmony

/**
 * Module dependencies.
 */

var program = require('commander');
var pkg = require('../package.json');
var server = require('../lib/serve');
var opts = {};

/**
 * Usage.
 */

program
  .version(pkg.version)
  .option('-o, --out [path]', 'path to compiled output [build]', 'build')
  .option('-h, --html [path]', 'path to `index.html` [lib/index.html]', 'lib/index.html')
  .option('-p, --port [n]', 'port to serve component to [3000]', 3000)
  .option('--xip', 'use xip.io domain routing')
  .parse(process.argv);

/**
 * Process.
 */

for (var key in program) {
  if (!program.hasOwnProperty(key)) continue;
  opts[key] = program[key];
}

/**
 * Turn off online-features for improved performance.
 */

if (!program.xip) {
  opts.online = false;
}

/**
 * Start server.
 */

server(opts);

