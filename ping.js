// ping.js
"use strict"

// use the tcpie module
var tcpie = require('tcpie');

// create a ping class
class Ping {
     
    // our constructor function fires on new Ping(etc)
    //(target.host, target.port, target.count, target.interval, targets.timeout, targets.autostart, targets.runs)
	constructor(target) {
        var self = this;
        this.target = target;
        this.settings = {
            count: target.count,
            interval: target.interval,
            timeout: target.timeout
        };
        // maintain array of round trip times
        this.stats = {};
        this.rttArray = [];
        this.rttAvg = null;
        this.runs = target.runs;
        this.autostart = target.autostart;
        
        // create an instance of tcpie for this ping
        this.pie = tcpie(this.target.host, this.target.port, this.settings);
        
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
        
        
        // we should probably assume autostart at this point
        if (this.autostart) {
            this.init();
        }
        
	}

    // init function runs start.
    init() {
        // useless log - console.log("starting");
        this.pie.start();
    }
    
    connect(stats) {
        console.info('Success connection to: ' + stats.target.host + ':' + stats.target.port + ' seq=' + stats.sent + ' time=' + stats.rtt );
        // push time into the array
        this.rttArray.push(stats.rtt);        
    }
    
    error(err, stats) {
        //console.error(err, stats);
        console.info('Failed connection to: ' + stats.target.host + ':' + stats.target.port + ' seq=' + stats.sent + ' time=' + stats.rtt );
    }
    
    timeout(stats) {
        console.info('timeout', stats);
    }
    
    // function called when event ends
    end(stats) {
        
        var self = this;
        
        this.stats = stats;
        
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
                
        // log with the ping avr rtt
        console.info('finished: ' + stats.target.host + ':' + stats.target.port + ' success=' + stats.success + ' failed=' + stats.failed +  ' avg=' + this.rttAvg );
        
        // call complete which can be used as an additional end function
        this.complete();
    }
    
    // empty function to use as a prototype if needed
    complete() {
       
    }
    
}
	
module.exports = Ping;