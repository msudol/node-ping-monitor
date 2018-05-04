// ping.js
"use strict"

var tcpie = require('tcpie');

class Ping{
     
	constructor(address, port, count, interval, timeout) {
		this.address = address;
		this.port = port;
        this.settings = {
            count: count,
            interval: interval,
            timeout: timeout
        };
        this.pie = tcpie(this.address, this.port, this.settings);
        this.pie.on('connect', function(stats) {
          console.info('connect', stats);
        }).on('error', function(err, stats) {
          console.error(err, stats);
        }).on('timeout', function(stats) {
          console.info('timeout', stats);
        }).on('end', function(stats) {
          console.info(stats);
        })        
	}

    init() {
        this.pie.start();
    }
        
}
	
module.exports = Ping