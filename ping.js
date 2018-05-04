// ping.js
"use strict"

// use the tcpie module
var tcpie = require('tcpie');

// create a ping class
class Ping{
     
    // our constructor function fires on new Ping(etc)
	constructor(address, port, count, interval, timeout) {
        var self = this;
		this.address = address;
		this.port = port;
        this.settings = {
            count: count,
            interval: interval,
            timeout: timeout
        };
        // maintain array of round trip times
        this.rttArray = [];
        this.rttAvg = null;
        
        // create an instance of tcpie for this ping
        this.pie = tcpie(this.address, this.port, this.settings);
        
        // setup event handlers
        this.pie.on('connect', function(stats) {         
            console.info('connected to: ' + stats.target.host + ':' + stats.target.port + ' seq=' + stats.sent + ' time=' + stats.rtt );
            // push time into the array
            self.rttArray.push(stats.rtt);
        }).on('error', function(err, stats) {
            console.error(err, stats);
        }).on('timeout', function(stats) {
            console.info('timeout', stats);
        }).on('end', function(stats) {
            self.rttAvg = self.rttArray.reduce((total, amount, index, array) => {
                total += amount;
                if(index === array.length-1) { 
                    return total/array.length;
                } else { 
                    return total;
                }
            });
            
            console.info('finished: ' + stats.target.host + ':' + stats.target.port + ' success=' + stats.success + ' failed=' + stats.failed +  ' avg=' + self.rttAvg );
        })  
        
	}

    // init function runs start.
    init() {
        this.pie.start();
    }
    
        
}
	
module.exports = Ping