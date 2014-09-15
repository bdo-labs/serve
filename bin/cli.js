#!/usr/bin/env node --harmony

var program = require('commander');
var pkg = require('../package.json');
var server = require('../lib/serve');
var opts = {};

program
  .version(pkg.version)
  .option('-p, --port [n]', 'port to serve component to [3000]', 3000)
  .parse(process.argv);

if (program.port){
  opts.port = program.port;
}

server(opts);

