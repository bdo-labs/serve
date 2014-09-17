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
  .option('--css [path]', 'path to CSS entry-file [lib/index.css]', 'lib/index.css')
  .option('--html [path]', 'path to html entry-file [lib/index.html]', 'lib/index.html')
  .option('--js [path]', 'path to JavaScript entry-file [lib/index.js]', 'lib/index.js')
  .option('--out [path]', 'path to compiled output [build]', 'build')
  .option('--port [n]', 'port to serve component to [3000]', 3000)
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
 * Files to do the initial build from.
 */

opts.entries = [program.js, program.css];

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

