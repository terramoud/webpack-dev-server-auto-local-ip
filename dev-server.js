'use strict';
const webpackDevServer = require('webpack-dev-server');
const webpack = require('webpack');
const path = require('path');
var os = require('os');
var ifaces = os.networkInterfaces();
var ipAdress = false;

Object.keys(ifaces).forEach(function (ifname) {
  var alias = 0;

  ifaces[ifname].forEach(function (iface) {
    if ('IPv4' !== iface.family || iface.internal !== false) {
      // skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
      return;
    }

    if (alias >= 1) {
      // this single interface has multiple ipv4 addresses
      console.log(ifname + ':' + alias, iface.address);
    } else {
      // this interface has only one ipv4 adress
      console.log(ifname, iface.address);
      ipAdress = iface.address;
    }
    ++alias;
  });
});



const config = require('./webpack.config.js');
const options = {
  contentBase: path.join(__dirname, 'dist'),
  publicPath: path.join(__dirname, 'dist'),

  hot: true,
    /*host: 'localhost'*/
    host: ipAdress, // for externally use
    port: 5000,
    /*open: true,*/
};

webpackDevServer.addDevServerEntrypoints(config, options);
const compiler = webpack(config);
const server = new webpackDevServer(compiler, options);

server.listen(5000, ipAdress, () => {
    console.log('dev server listening on port 5000');
});
