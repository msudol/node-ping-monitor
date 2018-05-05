// ping.js
"use strict"

// use the tcpie module
var tcpie = require('tcpie');

// create a ping class
class Ping{
     
    // our constructor function fires on new Ping(etc)
	constructor(address, port, count, interval, timeout, start) {
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
            self.connect(stats)
        }).on('error', function(err, stats) {
            self.error(err, stats)
        }).on('timeout', function(stats) {
            self.timeout(stats)
        }).on('end', function(stats) { 
            self.end(stats)
        });  
        
        if (start) {
            this.init();
        }
        
	}

    // init function runs start.
    init() {
        this.pie.start();
    }
    
    connect(stats) {
        console.info('connected to: ' + stats.target.host + ':' + stats.target.port + ' seq=' + stats.sent + ' time=' + stats.rtt );
        // push time into the array
        this.rttArray.push(stats.rtt);        
    }
    
    error(err, stats) {
        console.error(err, stats);
    }
    
    timeout(stats) {
        console.info('timeout', stats);
    }
    
    // function called when event ends
    end(stats) {
        
        if (this.rttArray.length > 0) {
            this.rttAvg = this.rttArray.reduce((total, amount, index, array) => {
                total += amount;
                if(index === array.length-1) { 
                    return total/array.length;
                } else { 
                    return total;
                }
            });
        }
        
        console.info('finished: ' + stats.target.host + ':' + stats.target.port + ' success=' + stats.success + ' failed=' + stats.failed +  ' avg=' + this.rttAvg );
    }
    
}
	
module.exports = Ping;